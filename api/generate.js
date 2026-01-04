export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    let { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    // Engenharia de Prompt Automática para Extrema Fidelidade
    const enhancement = ", masterpiece, highly detailed, photorealistic, cinematic lighting, 8k, sharp focus, professional photography";
    const finalPrompt = prompt.length < 50 ? prompt + enhancement : prompt;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
            {
                headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: finalPrompt,
                    parameters: { guidance_scale: 3.5, num_inference_steps: 4 }
                }),
            }
        );

        if (!response.ok) throw new Error('O modelo está carregando ou o limite foi atingido.');

        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/png');
        return res.send(Buffer.from(buffer));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
