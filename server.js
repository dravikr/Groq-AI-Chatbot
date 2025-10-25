import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    let instruction = "Answer concisely in 3 lines, simple and neat.";

    if (/explain/i.test(message)) {
        instruction = "Answer in 5-6 lines, explain clearly, simple and neat.";
    }

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: `${instruction}\n\nUser: ${message}`,
    });

    res.json({ reply: response.output_text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get response" });
  }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));