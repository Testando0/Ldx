export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                headers: { 
                    Authorization: `Bearer ${HF_TOKEN}`, 
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: prompt + ", cinematic, 8k, highly detailed, masterpiece",
                    parameters: {
                        negative_prompt: "blurry, distorted, low quality, bad anatomy",
                        num_inference_steps: 30
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: "Hugging Face ocupado ou carregando." });
        }

        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/png');
        return res.send(Buffer.from(buffer));

    } catch (error) {
        return res.status(500).json({ error: "Erro de conexão com o servidor." });
    }
}
