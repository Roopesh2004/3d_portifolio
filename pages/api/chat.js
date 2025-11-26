import { GoogleGenerativeAI } from "@google/generative-ai";
import { aboutData, personalInfo } from "../../lib/data";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            message: "API key not configured",
            error: "GEMINI_API_KEY is missing in environment variables."
        });
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Construct system prompt with portfolio context
        const context = `
      You are an AI assistant for ${personalInfo.name}'s portfolio website.
      Your goal is to answer questions about ${personalInfo.name} based on the following information:
      
      Name: ${personalInfo.name}
      Title: ${personalInfo.title}
      Description: ${personalInfo.description}
      Stats: ${JSON.stringify(personalInfo.stats)}
      
      Skills & Experience Data:
      ${JSON.stringify(aboutData, null, 2)}
      
      Instructions:
      - Be polite, professional, and concise.
      - Answer in the first person as if you are representing ${personalInfo.name} or as a helpful assistant.
      - If the answer is not in the data, say you don't have that information but suggest contacting ${personalInfo.name} directly.
      - Keep responses short enough to be spoken comfortably (under 3 sentences if possible).
    `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: context }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to answer questions about " + personalInfo.name + "." }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ response: text });
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        console.error("API Key present:", !!apiKey);
        if (apiKey) console.error("API Key start:", apiKey.substring(0, 5));
        res.status(500).json({ message: "Failed to generate response", error: error.message, details: error.toString() });
    }
}
