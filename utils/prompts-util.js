export const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => {
  return `You are a senior engineer conducting a technical interview.

Generate exactly ${numberOfQuestions} interview questions for the following profile:
- Role: ${role}
- Experience: ${experience} years
- Topics to focus on: ${topicsToFocus || "general topics for this role"}

Rules for each question:
1. The "answer" field must be well-structured using markdown:
   - Use **bold** for key terms
   - Use bullet points or numbered lists where appropriate
   - Add a short \`\`\`js ... \`\`\` code block when relevant (keep it under 10 lines)
   - Break the answer into short paragraphs — never one wall of text
2. Answers should be beginner-friendly but technically accurate.
3. Difficulty should match ${experience} years of experience.

Return ONLY a valid JSON array. No extra text, no markdown wrapper around the JSON.

[
  {
    "question": "...",
    "answer": "**Definition:** ...\\n\\n**Key points:**\\n- Point 1\\n- Point 2\\n\\n\`\`\`js\\n// example\\n\`\`\`"
  }
]`;
};

export const conceptExplainPrompt = (question) => {
  return `You are a senior developer explaining a concept to a junior developer.

Explain the following interview question in depth:
"${question}"

Structure your explanation like this:
1. Start with a **one-line definition** in bold.
2. Explain the concept in 2–3 short paragraphs.
3. Use bullet points for any list of features, pros/cons, or steps.
4. If relevant, include a small code example (under 10 lines) in a \`\`\`js block.
5. End with a **"Key Takeaway"** line summarizing the concept in one sentence.

Return ONLY a valid JSON object in this exact shape. No extra text outside the JSON:

{
  "title": "Short, clear concept title (5 words max)",
  "explanation": "**Definition:** ...\\n\\n Paragraph...\\n\\n**Key Takeaway:** ..."
}`;
};
