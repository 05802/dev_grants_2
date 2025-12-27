export const prompts = {
  generateQuestionContent: (
    questionPrompt: string,
    criteria: string[],
    maxWords: number | undefined,
    context: string
  ): string => {
    const wordLimitText = maxWords
      ? `The response must be no more than ${maxWords} words.`
      : '';
    const criteriaText =
      criteria.length > 0
        ? `\n\nEvaluation Criteria to address:\n${criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
        : '';

    return `You are a professional grant writer helping to create compelling grant applications.

${context}

Question to answer:
${questionPrompt}

${criteriaText}

${wordLimitText}

Please provide a well-structured, persuasive response that directly addresses the question and meets all evaluation criteria. Use clear, professional language and provide specific examples where appropriate.`;
  },

  evaluateQuestion: (
    questionContent: string,
    criteriaDescription: string,
    criteriaItems: string[]
  ): string => {
    return `You are an expert grant evaluator. Evaluate the following grant application response against the specified criteria.

Evaluation Criteria: ${criteriaDescription}

Specific items to assess:
${criteriaItems.map((item, i) => `${i + 1}. ${item}`).join('\n')}

Response to evaluate:
${questionContent}

Provide:
1. A numerical score (0-10) for each criteria item
2. Detailed feedback explaining the score
3. Specific suggestions for improvement
4. An overall assessment

Format your response as JSON with this structure:
{
  "overallScore": <number>,
  "itemScores": [
    { "item": "<criteria item>", "score": <number>, "feedback": "<string>" }
  ],
  "overallFeedback": "<string>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", ...]
}`;
  },

  generateLogframeElement: (
    type: 'outcome' | 'output' | 'activity',
    context: string,
    existingElements: string[]
  ): string => {
    const typeDescriptions = {
      outcome:
        'high-level changes or benefits resulting from the project (what will be different)',
      output:
        'direct deliverables or products of project activities (what will be produced)',
      activity: 'specific actions or tasks to be carried out (what will be done)',
    };

    const existingText =
      existingElements.length > 0
        ? `\n\nExisting ${type}s to build upon:\n${existingElements.join('\n')}`
        : '';

    return `You are helping to develop a logical framework (logframe) for a grant application.

Project Context:
${context}

${existingText}

Generate a ${type} - ${typeDescriptions[type]}.

Provide a clear, specific, and measurable ${type} that:
1. Aligns with the project context
2. Is realistic and achievable
3. Includes specific indicators where appropriate
4. Uses SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)

Response format:
{
  "description": "<${type} description>",
  "indicators": ["<indicator 1>", "<indicator 2>", ...]
}`;
  },
};
