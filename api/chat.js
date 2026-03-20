export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { detection, weather, lang } = req.body;
    
    // We get the key from Vercel's environment variables (System Settings)
    const API_KEY = process.env.GEMINI_API_KEY; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `Act as Smart Dala AI. Language: ${lang}. Detection: ${detection}. Weather: ${weather}. Provide 3 quick treatment steps for a farmer in Uzbekistan. Answer ONLY in ${lang}.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to connect to Gemini API" });
    }
}