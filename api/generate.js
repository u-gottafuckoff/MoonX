import { MODELS, SYSTEM_PROMPTS } from './models.js';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { prompt, model = "ft1" } = req.body;
  
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "HTTP-Referer": "https://moonx.vercel.app",
        "X-Title": "MoonX AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODELS[model],
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[model] },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ code: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar código" });
  }
};
