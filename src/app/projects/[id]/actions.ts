'use server';

import {
  enhanceProjectDescription,
} from '@/ai/flows/enhance-project-description';
import { z } from 'zod';

const schema = z.object({
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  targetAudience: z.string().min(3, { message: 'Target audience must be at least 3 characters.' }),
});

export type EnhanceFormState = {
  status: 'error' | 'success' | 'idle';
  message: string;
  data?: {
    enhancedDescription: string;
    suggestions: string;
  };
};

export async function enhanceDescriptionAction(
  prevState: EnhanceFormState,
  formData: FormData
): Promise<EnhanceFormState> {
  const parsed = schema.safeParse({
    description: formData.get('description'),
    targetAudience: formData.get('targetAudience'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.errors.map((e) => e.message).join(', '),
    };
  }

  try {
    const result = await enhanceProjectDescription(parsed.data);
    if (result.enhancedDescription && result.suggestions) {
       return {
         status: 'success',
         message: 'Description enhanced successfully!',
         data: result,
       };
    } else {
        return { status: 'error', message: "AI failed to generate a response."};
    }
  } catch (error) {
    console.error(error);
    return { status: 'error', message: 'An unexpected error occurred. Please try again.' };
  }
}
