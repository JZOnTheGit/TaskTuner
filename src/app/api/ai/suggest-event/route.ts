import { NextResponse } from 'next/server';
import { cohere } from '../config';
import { addHours, parseISO, isValid, addDays, startOfToday, nextDay, nextFriday, previousDay, format } from 'date-fns';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const currentDate = new Date();
    const today = startOfToday();

    // Calculate dates for next 2 weeks for reference
    const nextTwoWeeks = Array.from({ length: 14 }, (_, i) => {
      const date = addDays(today, i);
      return format(date, "EEEE, MMMM d, yyyy");
    });

    const response = await cohere.generate({
      model: 'command',
      prompt: `You are a calendar assistant. Create a calendar event from this request: "${prompt}"

Important date reference (today is ${format(currentDate, "EEEE, MMMM d, yyyy")}):
- "this [day]" refers to the upcoming ${format(currentDate, "EEEE")} (${format(today, "MMMM d")})
- "next [day]" refers to the following week's occurrence of that day
- If no specific date is mentioned, assume the next occurrence of that day

Next two weeks:
${nextTwoWeeks.join('\n')}

Return ONLY a JSON object with these exact fields (no other text):
{
  "title": "brief event title",
  "description": "detailed description",
  "start": "ISO date string for start time",
  "end": "ISO date string for end time",
  "allDay": boolean for all-day event
}

Example responses:
{
  "title": "Team Meeting",
  "description": "Weekly team sync to discuss project progress",
  "start": "2024-02-14T14:00:00.000Z",
  "end": "2024-02-14T15:00:00.000Z",
  "allDay": false
}`,
      maxTokens: 500,
      temperature: 0.2,
      returnLikelihoods: 'NONE'
    });

    let suggestion;
    try {
      const jsonMatch = response.generations[0].text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      suggestion = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse response:', response.generations[0].text);
      throw new Error('Invalid response format');
    }

    // Validate and fix dates
    let start: Date;
    let end: Date;

    try {
      start = parseISO(suggestion.start);
      if (!isValid(start)) {
        start = currentDate;
      }
    } catch {
      start = currentDate;
    }

    try {
      end = parseISO(suggestion.end);
      if (!isValid(end) || end <= start) {
        end = addHours(start, 1);
      }
    } catch {
      end = addHours(start, 1);
    }

    return NextResponse.json({
      title: suggestion.title || 'New Event',
      description: suggestion.description || '',
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: !!suggestion.allDay
    });

  } catch (error) {
    console.error('Error in AI suggestion:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestion' },
      { status: 500 }
    );
  }
} 