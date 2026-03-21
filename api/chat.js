export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { detection, weather, lang } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API Key is missing in Vercel settings' });
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        // THIS IS THE EXACT STRUCTURE GOOGLE REQUIRES
        const payload = {
            contents: [{
                parts: [{
                    text: `Act as Smart Dala AI. Language: ${lang}. Plant Status: ${detection}. Weather: ${weather}. Give 3 specific treatment steps for an Uzbek farmer. Answer ONLY in ${lang}.`
                }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Google Error Details:", data);
            return res.status(response.status).json({ error: data.error?.message || "Google rejected the request" });
        }

        // Return the clean data to the frontend
        return res.status(200).json(data);

    } catch (err) {
        console.error("Server Crash:", err);
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
}