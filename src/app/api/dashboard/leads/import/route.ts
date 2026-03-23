import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { getOrgId } from "@/lib/auth";
import Papa from "papaparse";

interface CsvRow {
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  telegramUsername?: string;
  telegram_username?: string;
  telegram?: string;
  company?: string;
  timezone?: string;
}

function normalizeRow(row: CsvRow) {
  return {
    firstName: row.firstName || row.first_name || null,
    lastName: row.lastName || row.last_name || null,
    phone: row.phone || null,
    email: row.email || null,
    telegramUsername: row.telegramUsername || row.telegram_username || row.telegram || null,
    company: row.company || null,
    timezone: row.timezone || null,
  };
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.endsWith(".csv")) {
      return Response.json({ error: "Only CSV files are supported" }, { status: 400 });
    }

    const text = await file.text();
    const result = Papa.parse<CsvRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (result.errors.length > 0 && result.data.length === 0) {
      return Response.json({ error: "Failed to parse CSV", details: result.errors }, { status: 400 });
    }

    const rows = result.data
      .map(normalizeRow)
      .filter((r) => r.firstName || r.lastName || r.phone || r.email || r.telegramUsername);

    if (rows.length === 0) {
      return Response.json({ error: "No valid rows found in CSV" }, { status: 400 });
    }

    // Batch insert in chunks of 100
    const BATCH_SIZE = 100;
    let imported = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE).map((row) => ({
        orgId,
        ...row,
      }));

      await db.insert(leads).values(batch);
      imported += batch.length;
    }

    return Response.json({
      success: true,
      imported,
      total: result.data.length,
      skipped: result.data.length - imported,
    });
  } catch (error) {
    console.error("Failed to import leads:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
