'use server';

/**
 * @fileOverview AI flow to enhance project descriptions for better context and clarity.
 *
 * - enhanceProjectDescription - Function to enhance a project description.
 * - EnhanceProjectDescriptionInput - Input type for the enhanceProjectDescription function.
 * - EnhanceProjectDescriptionOutput - Output type for the enhanceProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceProjectDescriptionInputSchema = z.object({
  description: z
    .string()
    .describe('The current description of the project.'),
  targetAudience: z
    .string()
    .describe('The intended audience for the project description.'),
});
export type EnhanceProjectDescriptionInput = z.infer<
  typeof EnhanceProjectDescriptionInputSchema
>;

const EnhanceProjectDescriptionOutputSchema = z.object({
  enhancedDescription: z
    .string()
    .describe('The enhanced description of the project.'),
  suggestions: z
    .string()
    .describe('Suggestions for improving the project description.'),
});
export type EnhanceProjectDescriptionOutput = z.infer<
  typeof EnhanceProjectDescriptionOutputSchema
>;

export async function enhanceProjectDescription(
  input: EnhanceProjectDescriptionInput
): Promise<EnhanceProjectDescriptionOutput> {
  return enhanceProjectDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceProjectDescriptionPrompt',
  input: {schema: EnhanceProjectDescriptionInputSchema},
  output: {schema: EnhanceProjectDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in enhancing project descriptions.

You will receive a project description and the target audience for the description.

Your goal is to improve the description to better suit the target audience, providing a enhanced description and concrete suggestions for improvement.

Project Description: {{{description}}}
Target Audience: {{{targetAudience}}}

Enhanced Description Guidelines:
- Ensure the description is clear, concise, and engaging.
- Highlight key features and benefits relevant to the target audience.
- Use appropriate language and terminology for the target audience.

Suggestions Guidelines:
- Provide specific, actionable suggestions for improving the description.
- Focus on areas such as clarity, relevance, and persuasiveness.
- Consider the target audience when making suggestions.
`,
});

const enhanceProjectDescriptionFlow = ai.defineFlow(
  {
    name: 'enhanceProjectDescriptionFlow',
    inputSchema: EnhanceProjectDescriptionInputSchema,
    outputSchema: EnhanceProjectDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

