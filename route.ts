import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { date, city, country, timeWindow } = await req.json();
    const datetime = `${date}T${timeWindow}:00`;

    const astroRes = await fetch('https://api.astroapi.dev/api/v1/planets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ASTRO_API_KEY!}`,
      },
      body: JSON.stringify({
        location: { city, country },
        datetime,
        planets: ['sun', 'moon'],
      }),
    });

    const astroData = await astroRes.json();
    const sun = astroData.data?.sun?.sign || 'unknown';
    const moon = astroData.data?.moon?.sign || 'unknown';

    const prompt = `My sun sign is ${sun} and my moon sign is ${moon}. Write a romantic compatibility story for someone with these signs using emotional, poetic language.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.9,
      }),
    });

    const openaiData = await openaiRes.json();
    const result = openaiData.choices?.[0]?.message?.content || 'No response.';

    return NextResponse.json({ result });
  } catch (err) {
    console.error('Error in /api/match:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
