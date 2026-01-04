export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Método não permitido');

    const { prompt } = req.body;
    
    // Geramos um número aleatório para garantir que cada imagem seja única
    const seed = Math.floor(Math.random() * 999999);
    
    // Usamos o modelo Flux Pro via Pollinations (Grátis, Rápido e Sem Token)
    // Isso ignora o problema do timeout da Vercel
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=1024&height=1024&seed=${seed}&nologo=true`;

    try {
        const response = await fetch(imageUrl);

        if (!response.ok) throw new Error('Falha ao obter imagem');

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.send(buffer);

    } catch (error) {
        return res.status(500).json({ error: "Erro ao gerar: " + error.message });
    }
}
