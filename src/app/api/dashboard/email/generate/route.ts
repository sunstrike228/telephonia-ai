import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { scripts, voiceConfigs } from "@/db/schema";
import { getOrgId } from "@/lib/auth";
import { buildEmailPrompt } from "@/lib/prompts";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    const body = await request.json();
    const { leadName, companyName, scriptId, type } = body;

    if (!type || !["initial", "followup", "final"].includes(type)) {
      return Response.json(
        { error: "Invalid type. Must be 'initial', 'followup', or 'final'" },
        { status: 400 }
      );
    }

    // Get script content if scriptId provided
    let scriptContent = "";

    if (scriptId) {
      const scriptRows = await db
        .select()
        .from(scripts)
        .where(eq(scripts.id, scriptId))
        .limit(1);

      if (scriptRows.length > 0) {
        scriptContent = scriptRows[0].content || "";
      }
    }

    // Get language/personality from voice config (scripts table has no language/personality columns)
    const voiceRows = await db
      .select({ language: voiceConfigs.language, personality: voiceConfigs.personality })
      .from(voiceConfigs)
      .where(eq(voiceConfigs.orgId, orgId))
      .limit(1);

    const scriptLanguage = voiceRows[0]?.language || "en";
    const scriptPersonality = voiceRows[0]?.personality || "professional";

    // Build prompt using the shared prompt engine
    const emailPromptData = buildEmailPrompt({
      channel: "email",
      script: scriptContent,
      personality: scriptPersonality,
      language: scriptLanguage,
      leadContext: {
        firstName: leadName || undefined,
        company: companyName || undefined,
      },
      emailType: type as "initial" | "followup" | "final",
      dayNumber: type === "initial" ? 1 : type === "followup" ? 3 : 7,
    });

    // Call OpenRouter LLM to generate personalized email
    const llmPrompt = `${emailPromptData.body}

Generate a personalized sales email. Respond with ONLY valid JSON in this exact format:
{"subject": "email subject line", "body": "full email body text"}

Do not include any other text, markdown, or code blocks. Just the JSON.`;

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
            { role: "user", content: llmPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!openrouterRes.ok) {
      const errBody = await openrouterRes.text();
      console.error("OpenRouter error:", errBody);
      // Fallback to template-based email
      return Response.json({
        subject: emailPromptData.subject,
        body: generateFallbackBody(type, leadName, companyName, scriptLanguage),
      });
    }

    const llmData = await openrouterRes.json();
    const rawContent = llmData.choices?.[0]?.message?.content || "";

    // Parse JSON from LLM response
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      let jsonStr = rawContent.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      const parsed = JSON.parse(jsonStr);

      return Response.json({
        subject: parsed.subject || emailPromptData.subject,
        body: parsed.body || "",
      });
    } catch {
      // If JSON parsing fails, use the raw content as body
      return Response.json({
        subject: emailPromptData.subject,
        body: rawContent,
      });
    }
  } catch (error) {
    console.error("Failed to generate email:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function generateFallbackBody(
  type: string,
  leadName?: string,
  companyName?: string,
  language?: string
): string {
  const isUa =
    language?.toLowerCase().includes("uk") ||
    language?.toLowerCase().includes("ua");
  const name = leadName || (isUa ? "there" : "there");

  if (type === "initial") {
    return isUa
      ? `${name ? `${name}, ` : ""}добрий день!\n\nМене звати [Ваше ім'я] з Project Noir. Ми допомагаємо компаніям автоматизувати комунікацію з клієнтами.\n\nЧи зручно вам буде поспілкуватися на 15-хвилинному дзвінку цього тижня?\n\nЗ повагою,\n[Ваше ім'я]`
      : `Hi ${name},\n\nI'm reaching out from Project Noir. We help companies automate customer outreach across multiple channels.\n\nWould you be open to a quick 15-minute call this week to discuss how we could help ${companyName || "your team"}?\n\nBest regards,\n[Your Name]`;
  }
  if (type === "followup") {
    return isUa
      ? `${name ? `${name}, ` : ""}добрий день!\n\nПишу вам повторно щодо моєї попередньої пропозиції. Ми нещодавно допомогли подібним компаніям збільшити конверсію на 40%.\n\nЧи є у вас час на коротку розмову?\n\nЗ повагою,\n[Ваше ім'я]`
      : `Hi ${name},\n\nI wanted to follow up on my previous email. We recently helped similar companies increase their conversion rates by 40%.\n\nWould you have time for a brief chat?\n\nBest regards,\n[Your Name]`;
  }
  return isUa
    ? `${name ? `${name}, ` : ""}добрий день!\n\nЦе мій останній лист з цієї теми. Якщо зараз не вдалий час — не проблема. Буду радий поспілкуватися в майбутньому.\n\nЗ повагою,\n[Ваше ім'я]`
    : `Hi ${name},\n\nI understand you're busy, so this will be my last note on this topic. If the timing isn't right, no worries at all. I'd be happy to connect in the future.\n\nBest regards,\n[Your Name]`;
}
