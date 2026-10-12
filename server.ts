import mysql from "mysql2/promise";
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";

// Yhteys MariaDB-tietokantaan
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const app = express();
app.use(express.json());
app.use(async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token",
  );

  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Content-Type", "application/json");

  next();
});

app.post("/", async (req, res) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    // Create an MCP server
    const server = new McpServer({
      name: "Demo",
      version: "1.0.0",
    });

    //Työkalu hakee kaikki opinnäytetyön vaiheet tietokannasta
    server.registerTool(
      "hae-vaiheet",
      {
        title: "Hae opinnäytetyön vaiheet",
        description: "Hakee opinnäytetyön vaiheet tietokannasta",
      },
      async () => {
        const [rows] = await pool.query("SELECT vaihe FROM vaiheet;");

        const vaiheet = (rows as any[]).map((row) => row.vaihe).join("\n");

        return {
          content: [{ type: "text", text: vaiheet }],
        };
      },
    );

    //työkalu hakee valitun vaiheen selityksen tietokannasta
    server.registerTool(
      "hae-vaiheen-selitys",
      {
        title: "Hae vaiheen selitys",
        description:
          "Hakee valitun opinnäytetyön vaiheen selityksen tietokannasta",
        inputSchema: {
          vaihe: z.string().describe("Opinnäytetyön vaihe"),
        },
      },
      async ({ vaihe }) => {
        const like = `%${vaihe}%`;

        const [rows] = await pool.query(
          "SELECT selitys FROM vaiheet WHERE vaihe LIKE ?;",
          [like],
        );

        const tulokset = rows as any[];

        if (tulokset.length === 0) {
          return {
            content: [
              { type: "text", text: `Vaihetta "${vaihe}" ei löytynyt.` },
            ],
          };
        }

        return {
          content: [{ type: "text", text: tulokset[0].selitys }],
        };
      },
    );

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

//Varmistus teksti konsoliin et servu pyörii
app.listen(3000, () => {
  console.log("MCP-serveri käynnissä portissa 3000");
});
