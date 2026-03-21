export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { detection, weather, lang } = req.body;
        
        // Use the Vercel Environment Variable
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY || API_KEY.length < 10) {
            return res.status(500).json({ error: 'API Key is missing or too short in Vercel settings' });
        }

        // We use v1beta and gemini-flash-latest to ensure it ALWAYS finds a model
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Act as Smart Dala AI. Language: ${lang}. Plant: ${detection}. Weather: ${weather}. Give 3 quick treatment steps. Answer ONLY in ${lang}.`
                    }]
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Google Error:", data);
            return res.status(response.status).json({ 
                error: data.error?.message || "Google rejected the request",
                details: data.error
            });
        }

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: "Server crashed: " + err.message });
    }
}