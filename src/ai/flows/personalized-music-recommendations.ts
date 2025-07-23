'use server';

/**
 * @fileOverview Provides personalized music recommendations based on listening history, time of day, and day of the week.
 *
 * - getPersonalizedRecommendations - A function that generates personalized music recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  listeningHistory: z
    .string()
    .describe('A comma-separated list of the user listening history.'),
  timeOfDay: z
    .string()
    .describe(
      'The current time of day (e.g., morning, afternoon, evening, night).'
    ),
  dayOfWeek: z.string().describe('The current day of the week (e.g., Monday).'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A comma-separated list of recommended songs.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedMusicRecommendationsFlow(input);
}

const personalizedMusicRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedMusicRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are a personalized music recommendation system. Given a user's listening history, the time of day, and the day of the week, you will provide a list of songs that the user might enjoy.

Listening History: {{{listeningHistory}}}
Time of Day: {{{timeOfDay}}}
Day of Week: {{{dayOfWeek}}}

Recommendations:`, 
});

const personalizedMusicRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedMusicRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedMusicRecommendationsPrompt(input);
    return output!;
  }
);
