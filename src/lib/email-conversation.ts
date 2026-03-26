import { db } from "@/db";
import { messages, leads, channelConfigs, voiceConfigs } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

interface LeadContext {
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  email?: string | null;
}

interface EmailReply {
  subject: string;
  body: string;
}

/**
 * Fetches conversation history for a lead (email channel only).
 * Returns messages ordered oldest-first for context building.
 */
async function getConversationHistory(
  orgId: string,
  leadId: string,
  limit = 20
): Promise<{ role: "assistant" | "lead"; content: string; subject?: string }[]> {
  const rows = await db
    .select({
      direction: messages.direction,
      content: messages.content,
      metadata: messages.metadata,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(
      and(
        eq(messages.orgId, orgId),
        eq(messages.leadId, leadId),
        eq(messages.channel, "email")
      )
    )
    .orderBy(desc(messages.createdAt))
    .limit(limit);

  // Reverse to get chronological order (oldest first)
  return rows.reverse().map((r) => ({
    role: r.direction === "outbound" ? ("assistant" as const) : ("lead" as const),
    content: r.content || "",
    subject: (r.metadata as Record<string, unknown>)?.subject as string | undefined,
  }));
}

/**
 * Generates a contextual AI email reply using OpenRouter.
 */
export async function generateEmailReply(
  orgId: string,
  leadId: string,
  replyText: string,
  replySubject: string,
  leadContext: LeadContext
): Promise<EmailReply> {
  // Fetch conversation history
  const history = await getConversationHistory(orgId, leadId);

  // Get org voice config for language/personality
  const voiceRows = await db
    .select({ language: voiceConfigs.language, personality: voiceConfigs.personality })
    .from(voiceConfigs)
    .where(eq(voiceConfigs.orgId, orgId))
    .limit(1);

  const language = voiceRows[0]?.language || "en";
  const personality = voiceRows[0]?.personality || "professional";
  const isUa =
    language.toLowerCase().includes("uk") || language.toLowerCase().includes("ua");

  // Build conversation context
  const conversationLines = history.map((m) => {
    const prefix = m.role === "assistant" ? "You (sales agent)" : "Lead";
    return `${prefix}: ${m.content}`;
  });

  // Add the new reply from the lead
  conversationLines.push(`Lead: ${replyText}`);

  const systemPrompt = isUa
    ? `Ти - AI-агент з продажу. Твій характер: ${personality}. Спілкуйся українською.

Правила відповіді на email:
- Відповідай на конкретні питання ліда
- Будь корисним та інформативним
- Намагайся рухатися до зустрічі/демо/дзвінка
- Зберігай професійний але теплий тон
- 3-5 коротких абзаців максимум
- Не використовуй емодзі
- Завершуй чітким наступним кроком (CTA)
- Не починай з "Дякую за вашу відповідь" - будь більш природним
- Ім'я ліда: ${leadContext.firstName || "невідомо"}${leadContext.company ? `, компанія: ${leadContext.company}` : ""}`
    : `You are an AI sales agent. Your personality: ${personality}. Communicate in English.

Rules for email replies:
- Respond to the lead's specific questions or concerns
- Be helpful and informative
- Try to move the conversation toward a meeting/demo/call
- Maintain a professional but warm tone
- 3-5 short paragraphs max
- No emoji
- End with a clear next step (CTA)
- Don't start with "Thank you for your reply" - be more natural
- Lead name: ${leadContext.firstName || "unknown"}${leadContext.company ? `, company: ${leadContext.company}` : ""}`;

  const userPrompt = `${conversationLines.length > 1 ? `Conversation history:\n${conversationLines.join("\n")}\n\n` : `Lead's message:\n${replyText}\n\n`}Generate a reply email. The lead's latest message subject was: "${replySubject}"

Respond with ONLY valid JSON in this exact format:
{"subject": "Re: subject line", "body": "full email body text"}

Do not include any other text, markdown, or code blocks. Just the JSON.`;

  try {
    const openrouterRes = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!openrouterRes.ok) {
      const errBody = await openrouterRes.text();
      console.error("OpenRouter error:", errBody);
      return generateFallbackReply(replySubject, leadContext, isUa);
    }

    const llmData = await openrouterRes.json();
    const rawContent = llmData.choices?.[0]?.message?.content || "";

    // Parse JSON from LLM response
    let jsonStr = rawContent.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonStr);
    return {
      subject: parsed.subject || `Re: ${replySubject}`,
      body: parsed.body || "",
    };
  } catch (error) {
    console.error("Failed to generate AI email reply:", error);
    return generateFallbackReply(replySubject, leadContext, isUa);
  }
}

function generateFallbackReply(
  originalSubject: string,
  leadContext: LeadContext,
  isUa: boolean
): EmailReply {
  const name = leadContext.firstName || (isUa ? "" : "");

  return {
    subject: `Re: ${originalSubject}`,
    body: isUa
      ? `${name ? `${name}, д` : "Д"}обрий день!\n\nДякую за ваше повідомлення. Я з радістю відповім на ваші запитання.\n\nЧи зручно вам буде провести короткий дзвінок цього тижня, щоб обговорити деталі?\n\nЗ повагою,\nProject Noir`
      : `Hi${name ? ` ${name}` : ""},\n\nThanks for getting back to me. I'd be happy to address your questions.\n\nWould you be available for a quick call this week to discuss the details?\n\nBest regards,\nProject Noir`,
  };
}
