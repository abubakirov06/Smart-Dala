export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { detection, weather, lang } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Act as Smart Dala AI. Language: ${lang}. Detection: ${detection}. Weather: ${weather}. Give 3 treatment steps. Answer ONLY in ${lang}.` }] }]
            })
        });

        const data = await response.json();
        
        // If Google sends back an error, we need to know
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to reach Gemini API' });
    }
}