import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { logAgent } from '../middleware/logger.js';

dotenv.config();

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_key_here'
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export const callAgent = async (agentName, systemPrompt, userContent, expectJSON = false, isRetry = false) => {
  const start = Date.now();
  
  if (!genAI) {
    const err = new Error('Gemini API key is missing or invalid.');
    err.code = 'MISSING_API_KEY';
    err.agentFailed = agentName;
    throw err;
  }

  try {
    const config = {
      systemInstruction: systemPrompt,
      temperature: 0.2, // Low temperature for consistent output
    };

    if (expectJSON) {
      config.responseMimeType = 'application/json';
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userContent,
      config: config
    });

    const durationMs = Date.now() - start;
    
    // Fallback token counting (approximate or extracted from metadata if genai exposes it)
    let tokensUsed = 0; 
    if (response.usageMetadata) {
      tokensUsed = response.usageMetadata.totalTokenCount || 0;
    }

    const textResult = response.text;
    logAgent(agentName, durationMs, tokensUsed);

    if (expectJSON) {
      try {
        let jsonString = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonString);
        return { result: parsed, tokensUsed, durationMs };
      } catch (e) {
        if (!isRetry) {
          console.warn(`[AGENT] ${agentName} returning malformed JSON. Retrying with strict JSON instruction...`);
          const strictSystemPrompt = systemPrompt + "\n\nCRITICAL: You failed to return valid JSON previously. You MUST return ONLY valid, parseable JSON data. Do not wrap in markdown loops or include conversational text.";
          return await callAgent(agentName, strictSystemPrompt, userContent, true, true);
        }
        
        const err = new Error('Agent failed to return valid JSON after retry');
        err.code = 'JSON_PARSE_ERROR';
        err.agentFailed = agentName;
        throw err;
      }
    }

    return { result: textResult, tokensUsed, durationMs };

  } catch (error) {
    const err = new Error(error.message || 'Gemini API Error');
    err.status = error.status || 500;
    err.code = 'GEMINI_ERROR';
    err.agentFailed = agentName;
    throw err;
  }
};
