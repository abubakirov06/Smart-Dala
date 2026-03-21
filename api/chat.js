export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { detection, weather, lang } = req.body;
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API Key missing in Vercel' });
        }

        // UPDATED TO GEMINI 3 FLASH (The 2026 Stable Model)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=${API_KEY}`;

        const payload = {
            contents: [{
                parts: [{
                    text: `Act as Smart Dala AI. Language: ${lang}. Plant Status: ${detection}. Weather: ${weather}. Provide 3 quick, practical treatment steps for a farmer in Uzbekistan. Answer ONLY in ${lang}.`
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
            console.error("Google API Response Error:", data);
            // If Gemini 3 isn't available on your specific key yet, we try a fallback alias
            if (data.error?.code === 404) {
                return res.status(404).json({ error: "Model Not Found. Try updating the model alias to 'gemini-flash-latest'." });
            }
            return res.status(response.status).json({ error: data.error?.message || "Google API Error" });
        }

        return res.status(200).json(data);

    } catch (err) {
        console.error("Server Crash:", err);
        return res.status(500).json({ error: "Server Error: " + err.message });
    }
}