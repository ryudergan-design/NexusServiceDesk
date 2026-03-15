async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();
    console.log('--- Available Models ---');
    if (data.models) {
      data.models.forEach((m: any) => console.log(m.name));
    } else {
      console.log('No models found or error:', data);
    }
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

listModels();
