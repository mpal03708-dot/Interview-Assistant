export const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions.
- For each question, generate a detailed but beginner-friendly answer.
- If the answer needs a code example, add a small code block inside.
- Keep formatting very clean.

Return a valid JSON object with a single key "questions".
"questions" should be an array of objects, each having "question" and "answer" fields.

Example format:
{
  "questions": [
    {
      "question": "What is React?",
      "answer": "React is a JavaScript library..."
    }
  ]
}
`;

export const conceptExplainPrompt = (question) => `
You are an AI trained to explain complex concepts in simple terms.

Task:
- Explain the following interview question and its concept in depth.
- Question: "${question}"
- After explaining, give a short and clear title.
- If explanation includes code, provide small code blocks.
- Keep formatting very clean and easy to read.

Return a valid JSON object with two keys: "title" and "explanation".

Example format:
{
  "title": "React State Management",
  "explanation": "State management in React refers to..."
}
`;