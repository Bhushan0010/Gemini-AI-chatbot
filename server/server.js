import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const key = process.env.API_KEY;

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(key);

const model = "gemini-1.5-flash";

const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = genAI.getGenerativeModel({
  model: model,
  geminiConfig,
});

app.post("/", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    // res.json({ text: response.text() });
    res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Response error", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
