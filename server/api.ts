import express from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

export const apiRouter = express.Router();
apiRouter.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

function getAiClient() {
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Kodi AI Mentor Multi-turn Chat
apiRouter.post('/mentor', async (req, res) => {
  try {
    const { message, history = [], language, chapterTitle } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        reply: `Hey there! Kodi here 🐾 I'm currently running in local offline mode because no API key was detected. For ${language || 'coding'}, remember to break the problem into smaller steps!`,
      });
    }

    const systemInstruction = `You are Kodi, the friendly, quirky, and deeply supportive mascot & coding mentor of Codeks Academy (corporate memphis aesthetic, warm and enthusiastic).
Target audience: Adult beginners learning programming in bite-sized 10-minute sessions.
Tone: Encouraging, concise, practical, clear, and never condescending.
Rules:
- Give short, punchy answers (under 3 paragraphs or concise bullet points).
- When writing code examples, keep them minimal, clean, and modern.
- If asked about debugging, point out where to look instead of simply giving raw code.
- Always include an upbeat closing or emoji (🐾, 🚀, ✨, 💡).
Current context: Language: ${language || 'General Programming'}, Chapter: ${chapterTitle || 'Basics'}.`;

    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
    });

    // Load recent history if available
    for (const item of history.slice(-6)) {
      if (item.role === 'user') {
        await chat.sendMessage({ message: item.content });
      }
    }

    const response = await chat.sendMessage({
      message: message || 'Hello Kodi, can you guide me through this topic?',
    });

    res.json({ reply: response.text || 'Keep coding! You are doing great!' });
  } catch (error: any) {
    console.error('Error in /api/mentor:', error);
    res.status(500).json({
      error: 'Mentor is taking a quick coffee break.',
      details: error?.message || String(error),
    });
  }
});

// 2. High Thinking Deep Code Explainer
apiRouter.post('/explain', async (req, res) => {
  try {
    const { code, language, question } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        analysis: `Kodi's offline breakdown: In ${language}, this code snippet processes operations sequentially. Ensure your variable types and control structures align.`,
      });
    }

    const prompt = `Perform an architectural breakdown and beginner-friendly deep explanation of this ${language || 'programming'} code:
\`\`\`${language || ''}
${code}
\`\`\`
User question: ${question || 'How does this work behind the scenes in memory and execution?'}

Provide:
1. High-level mental model (analogy)
2. Step-by-step execution trace
3. Potential edge cases or gotchas for beginners
4. 2026 industry best practice recommendation`;

    let response;
    try {
      // Try gemini-4-argon with HIGH thinking level as requested
      response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        },
      });
    } catch (argonErr: any) {
      // Fallback to gemini-3.8-flash with HIGH thinking level if argon is unavailable or unpaid
      console.warn('Falling back to gemini-3.8-flash with high thinking:', argonErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        },
      });
    }

    res.json({ analysis: response.text || 'Analysis completed.' });
  } catch (error: any) {
    console.error('Error in /api/explain:', error);
    res.status(500).json({
      error: 'Could not run deep reasoning breakdown.',
      details: error?.message || String(error),
    });
  }
});

// 3. Real-time Search Grounding for current documentation & ecosystem trends
apiRouter.post('/search-grounding', async (req, res) => {
  try {
    const { query, language } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        result: `${language || 'Modern language'} continues to evolve with active community standards and official documentation.`,
        sources: [],
      });
    }

    const searchQuery = query || `latest official features and best practices for ${language} in 2026`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Provide an accurate, up-to-date summary for this query based on web search grounding:
Query: ${searchQuery}
Topic: ${language}

Include key facts, version changes, and standard recommendations for learners.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchChunks = groundingMetadata?.groundingChunks || [];

    const sources = searchChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Documentation Reference',
        url: chunk.web?.uri,
      }))
      .slice(0, 5);

    res.json({
      result: response.text || 'Information retrieved.',
      sources,
    });
  } catch (error: any) {
    console.error('Error in /api/search-grounding:', error);
    res.status(500).json({
      error: 'Search lookup failed.',
      details: error?.message || String(error),
    });
  }
});

// 4. Kind Hint Assistant (analyzes code without revealing direct answer)
apiRouter.post('/hint', async (req, res) => {
  try {
    const { language, taskDescription, userCode, testFailures } = req.body;
    const ai = getAiClient();

    if (!ai) {
      return res.json({
        hint: 'Double-check your syntax, punctuation, variable naming, and return statements!',
      });
    }

    const prompt = `You are Kodi, the gentle mentor of Codeks Academy.
The student is working on this task:
Task: "${taskDescription}"
Language: ${language}

Current Student Code:
\`\`\`
${userCode}
\`\`\`

Test Failure / Feedback:
${testFailures || 'Code did not produce expected output.'}

CRITICAL INSTRUCTION:
- DO NOT provide the direct answer or solution code.
- Give ONE kind, encouraging directional hint that prompts the learner to realize what is missing or misaligned.
- Keep it under 2 sentences.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ hint: response.text?.trim() || 'Look closely at your output format and variables!' });
  } catch (error: any) {
    console.error('Error in /api/hint:', error);
    res.json({
      hint: 'Remember to check syntax, correct casing, and expected return types!',
    });
  }
});
