import { GoogleGenAI } from "@google/genai";
import { ProposalWithDetails, Comment } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this prototype, we'll allow the app to run but AI features will fail.
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getProposalSummary = async (proposal: ProposalWithDetails): Promise<string> => {
    if (!API_KEY) {
        return Promise.reject(new Error("AI features are disabled because the API key is missing."));
    }

    const model = 'gemini-2.5-flash';

    const formattedComments = proposal.comments.length > 0
        ? proposal.comments.map(c => `- ${c.authorName}: "${c.content}"`).join('\n')
        : "No comments yet.";

    const prompt = `
        You are an impartial analyst. Your task is to summarize a community proposal and the discussion around it.
        Provide a neutral, one-paragraph summary of the proposal itself.
        Then, based on the comments, list the key arguments FOR the proposal and the key arguments AGAINST it. If there are no comments for a category, state that.
        Do not add any opinions or conclusions of your own.

        **Proposal Title:** ${proposal.title}

        **Proposal Description:**
        ${proposal.description}

        **Discussion Comments:**
        ${formattedComments}
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate AI summary. The model may be overloaded.");
    }
};