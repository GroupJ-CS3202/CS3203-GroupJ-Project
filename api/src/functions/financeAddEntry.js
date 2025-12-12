const { app } = require("@azure/functions");
const { poolPromise, sql } = require("./db");

app.http("financeAddEntry", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",

  // IMPORTANT:
  // Use a unique route to avoid conflict with financeGetEntries (GET)
  route: "finance/entries/add",

  handler: async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return { status: 204, headers: cors() };
    }

    // Parse JSON body
    const body = await req.json().catch(() => null);
    if (!body) {
      return json(400, { error: "Invalid JSON body" });
    }

    const { userId, entryType, category, amount, entryDate, note } = body;

    // Basic validation
    if (!userId) return json(400, { error: "Missing userId" });
    if (!entryType) return json(400, { error: "Missing entryType" });
    if (!category) return json(400, { error: "Missing category" });
    if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
      return json(400, { error: "Invalid amount" });
    }
    if (!entryDate) return json(400, { error: "Missing entryDate" });

    // Insert into dbo.FinancialEntries
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("entryId", sql.UniqueIdentifier, sql.UUID())
      .input("userId", sql.NVarChar(128), userId)
      .input("entryType", sql.NVarChar(20), entryType)
      .input("category", sql.NVarChar(100), category)
      .input("amount", sql.Decimal(18, 2), Number(amount))
      .input("entryDate", sql.DateTime2, new Date(entryDate))
      .input("note", sql.NVarChar(500), note ?? null)
      .query(`
        INSERT INTO dbo.FinancialEntries
          (EntryID, UserID, EntryType, Category, Amount, EntryDate, Note, CreatedAt)
        OUTPUT
          inserted.EntryID,
          inserted.UserID,
          inserted.EntryType,
          inserted.Category,
          inserted.Amount,
          inserted.EntryDate,
          inserted.Note,
          inserted.CreatedAt
        VALUES
          (@entryId, @userId, @entryType, @category, @amount, @entryDate, @note, SYSUTCDATETIME());
      `);

    return json(200, result.recordset[0]);
  },
});

// ---------- helpers ----------

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(status, body) {
  return {
    status,
    headers: {
      "Content-Type": "application/json",
      ...cors(),
    },
    body: JSON.stringify(body),
  };
}
