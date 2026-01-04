export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método não permitido');

    const { prompt } = req.body;
    const HF_TOKEN = process.env.HF_TOKEN;

    try {
        // Usando o SDXL-Lightning (gera em ~1.5 segundos)
        const response = await fetch(
            "https://api-inference.huggingface.co/models/ByteDance/SDXL-Lightning",
            {
                headers: {
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ 
                    inputs: prompt + ", high quality, detailed, masterpiece, 8k",
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.text();
            // Se o modelo estiver carregando, o status será 503
            return res.status(response.status).json({ error: "HF_ERROR", details: errorData });
        }

        const arrayBuffer = await response.arrayBuffer();
        res.setHeader('Content-Type', 'image/png');
        return res.send(Buffer.from(arrayBuffer));

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
