import { NextRequest, NextResponse } from 'next/server';

const CHART_API_URL = 'https://gustave-n8n.sixtynine.dev/webhook/chart-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Chart API request body:', JSON.stringify(body, null, 2));
    
    // Extract the analysis from the request body
    const analysis = body.query?.analysis || '';
    
    // Encode the analysis as a URL parameter (matching Postman)
    const encodedAnalysis = encodeURIComponent(analysis);
    const urlWithParams = `${CHART_API_URL}?analysis=${encodedAnalysis}`;
    
    console.log('Chart API URL:', urlWithParams);
    
    const response = await fetch(urlWithParams, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body.body || {}),
    });

    const responseText = await response.text();
    console.log('Chart API response status:', response.status);
    console.log('Chart API response:', responseText);

    if (!response.ok) {
      console.error('Chart API error response:', responseText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('Failed to parse chart API response:', parseError);
      return NextResponse.json({ error: 'Invalid response from chart API', details: responseText }, { status: 500 });
    }
  } catch (error) {
    console.error('Chart API route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate chart', details: (error as Error).message },
      { status: 500 }
    );
  }
}