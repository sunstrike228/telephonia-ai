export type Channel = "voice" | "telegram" | "email";

interface PromptOptions {
  channel: Channel;
  script: string;
  objectionHandlers?: string[];
  personality: string;
  language: string;
  leadContext?: {
    firstName?: string;
    lastName?: string;
    company?: string;
  };
  conversationHistory?: { role: string; content: string }[];
}

const CHANNEL_RULES: Record<Channel, string> = {
  voice: [
    "Keep sentences short and natural — no more than 15 words per sentence.",
    "Use natural pauses. Insert '...' where you'd pause in real speech.",
    "End questions with rising intonation markers.",
    "Avoid complex vocabulary — prefer simple, conversational language.",
    "Never spell out URLs, emails, or long numbers — say 'I'll send you a link' instead.",
    "If the person is confused, repeat the key point in simpler words.",
    "Sound warm and confident, not robotic.",
  ].join("\n"),

  telegram: [
    "Keep messages short — 2-3 sentences max per message.",
    "Use a friendly, informal but professional tone.",
    "You may use emoji sparingly (1-2 per message max) to add warmth.",
    "Never use markdown formatting (no bold, italic, code blocks, links).",
    "Write like a real person texting, not like a chatbot.",
    "Don't greet with 'Hello!' every message — only in the first one.",
    "If the lead asks a question, answer directly then redirect to the goal.",
    "End with a clear, simple question or call to action.",
  ].join("\n"),

  email: [
    "Use a professional email format with greeting, body, and sign-off.",
    "Keep the body concise — 3-5 short paragraphs max.",
    "Include a clear call to action (CTA) — suggest a specific next step.",
    "Use the lead's first name in the greeting if available.",
    "Maintain a warm but professional tone.",
    "Avoid exclamation marks — one at most in the entire email.",
    "Don't use slang, emoji, or overly casual language.",
    "End with a professional signature.",
  ].join("\n"),
};

function buildLeadGreeting(
  channel: Channel,
  language: string,
  lead?: PromptOptions["leadContext"]
): string {
  if (!lead) return "";

  const name = lead.firstName || "";
  const isUa = language.toLowerCase().includes("uk") || language.toLowerCase().includes("ua");

  if (channel === "telegram") {
    if (name) {
      return isUa ? `Звертайся до ліда як "${name}".` : `Address the lead as "${name}".`;
    }
  }

  if (channel === "email") {
    if (name) {
      return isUa
        ? `Ім'я ліда: ${name}${lead.lastName ? ` ${lead.lastName}` : ""}${lead.company ? `, компанія: ${lead.company}` : ""}.`
        : `Lead name: ${name}${lead.lastName ? ` ${lead.lastName}` : ""}${lead.company ? `, company: ${lead.company}` : ""}.`;
    }
  }

  if (channel === "voice") {
    if (name) {
      return isUa ? `Ім'я співрозмовника: ${name}.` : `The person's name is ${name}.`;
    }
  }

  return "";
}

function buildConversationContext(history?: { role: string; content: string }[]): string {
  if (!history || history.length === 0) return "";

  const recent = history.slice(-10);
  const lines = recent.map((m) => `${m.role === "assistant" ? "You" : "Lead"}: ${m.content}`);
  return `\nConversation so far:\n${lines.join("\n")}\n`;
}

export function buildSystemPrompt(opts: PromptOptions): string {
  const {
    channel,
    script,
    objectionHandlers,
    personality,
    language,
    leadContext,
    conversationHistory,
  } = opts;

  const isUa = language.toLowerCase().includes("uk") || language.toLowerCase().includes("ua");

  const sections: string[] = [];

  // Role & personality
  sections.push(
    isUa
      ? `Ти — AI-агент з продажу. Твій характер: ${personality}. Спілкуйся ${language === "ua" || language === "uk" ? "українською" : language}.`
      : `You are an AI sales agent. Your personality: ${personality}. Communicate in ${language}.`
  );

  // Channel rules
  sections.push(
    isUa
      ? `\nПравила каналу (${channel}):\n${CHANNEL_RULES[channel]}`
      : `\nChannel rules (${channel}):\n${CHANNEL_RULES[channel]}`
  );

  // Script
  if (script) {
    sections.push(
      isUa
        ? `\nСкрипт продажу:\n${script}`
        : `\nSales script:\n${script}`
    );
  }

  // Objection handlers
  if (objectionHandlers && objectionHandlers.length > 0) {
    sections.push(
      isUa
        ? `\nОбробники заперечень:\n${objectionHandlers.map((h, i) => `${i + 1}. ${h}`).join("\n")}`
        : `\nObjection handlers:\n${objectionHandlers.map((h, i) => `${i + 1}. ${h}`).join("\n")}`
    );
  }

  // Lead context
  const greeting = buildLeadGreeting(channel, language, leadContext);
  if (greeting) {
    sections.push(`\n${greeting}`);
  }

  // Conversation history
  const context = buildConversationContext(conversationHistory);
  if (context) {
    sections.push(context);
  }

  return sections.join("\n");
}

export function buildEmailPrompt(
  opts: PromptOptions & {
    emailType: "initial" | "followup" | "final";
    dayNumber: number;
  }
): { subject: string; body: string } {
  const { emailType, dayNumber, leadContext, language } = opts;
  const isUa = language.toLowerCase().includes("uk") || language.toLowerCase().includes("ua");
  const name = leadContext?.firstName || (isUa ? "там" : "there");

  const systemPrompt = buildSystemPrompt({ ...opts, channel: "email" });

  const typeInstructions: Record<string, string> = {
    initial: isUa
      ? `Це перший email ліду (день ${dayNumber}). Представся, коротко опиши пропозицію та запропонуй конкретний наступний крок (дзвінок, демо).`
      : `This is the initial email to the lead (day ${dayNumber}). Introduce yourself, briefly describe the offer, and suggest a specific next step (call, demo).`,
    followup: isUa
      ? `Це follow-up email (день ${dayNumber}). Ти вже писав раніше. Коротко нагадай про пропозицію, додай нову цінність (кейс, результат), запропонуй конкретний час для зустрічі.`
      : `This is a follow-up email (day ${dayNumber}). You've written before. Briefly remind about the offer, add new value (case study, result), suggest a specific meeting time.`,
    final: isUa
      ? `Це фінальний email (день ${dayNumber}). Коротко, без тиску — скажи що це останній лист, залиш двері відкритими для майбутнього контакту.`
      : `This is the final email (day ${dayNumber}). Keep it short, no pressure — say this is the last email, leave the door open for future contact.`,
  };

  // The actual subject and body would be generated by the LLM using this prompt
  // Here we return the prompt structure for the AI to process
  const fullPrompt = `${systemPrompt}\n\n${typeInstructions[emailType]}`;

  // These are template placeholders - the actual AI call fills them
  const subjectTemplates: Record<string, Record<string, string>> = {
    initial: {
      ua: `Пропозиція для ${leadContext?.company || name}`,
      en: `A quick note for ${leadContext?.company || name}`,
    },
    followup: {
      ua: `Слідкую за моїм попереднім листом`,
      en: `Following up on my previous email`,
    },
    final: {
      ua: `Останній лист — ${leadContext?.company || ""}`,
      en: `Final note — ${leadContext?.company || ""}`,
    },
  };

  const lang = isUa ? "ua" : "en";

  return {
    subject: subjectTemplates[emailType]?.[lang] || "Hello",
    body: fullPrompt,
  };
}
