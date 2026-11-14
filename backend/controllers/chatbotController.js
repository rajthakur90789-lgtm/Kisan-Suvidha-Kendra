
const { GoogleGenAI } = require("@google/genai");

// Kisan Mitra AI Chat Controller
const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        // Validate message
        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter your question."
            });
        }

        if (message.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Question must be under 2000 characters."
            });
        }

        // Check Gemini API Key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("GEMINI_API_KEY is missing.");

            return res.status(500).json({
                success: false,
                message: "Gemini API key is not configured."
            });
        }

        // Initialize Gemini AI with 60-second timeout
        const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
                timeout: 60000,
                retryOptions: {
                    attempts: 1
                }
            }
        });

        let response;
        const maxAttempts = 2;

        // Automatic Retry
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                console.log(
                    `Kisan Mitra AI: Attempt ${attempt}/${maxAttempts}`
                );

                response = await ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents: message.trim(),

                    config: {
                        systemInstruction: `
                            You are Kisan Mitra AI, a helpful
                            agricultural assistant for Indian farmers.

                            Rules:
                            1. Answer in the language used by the farmer.
                            2. Support Hindi, Hinglish and English.
                            3. Give simple beginner-friendly answers.
                            4. Help with crops, seeds, fertilizers,
                               irrigation, pests and farming equipment.
                            5. Give practical and safe farming guidance.
                            6. Never invent government schemes or facts.
                            7. For pesticide dosage, recommend following
                               the product label and local expert advice.
                            8. For serious crop diseases, recommend
                               consulting a local agriculture officer.
                            9. Keep answers clear and easy to understand.
                        `,

                        temperature: 0.7,
                        maxOutputTokens: 1000
                    }
                });

                // Successful response
                break;

            } catch (error) {
                const status = error.status || error.code;

                const isTimeout =
                    error.name === "AbortError" ||
                    error.name === "TimeoutError" ||
                    status === 20 ||
                    /aborted|timeout/i.test(error.message || "");

                console.error(
                    `Gemini attempt ${attempt} failed:`,
                    error.message
                );

                const shouldRetry =
                    status === 503 ||
                    status === 429 ||
                    isTimeout;

                if (shouldRetry && attempt < maxAttempts) {
                    console.log(
                        "Gemini temporarily unavailable. Retrying in 3 seconds..."
                    );

                    await new Promise(resolve =>
                        setTimeout(resolve, 3000)
                    );

                } else {
                    throw error;
                }
            }
        }

        // Get AI Reply
        const reply = response?.text;

        if (!reply) {
            return res.status(500).json({
                success: false,
                message: "AI could not generate a response. Please try again."
            });
        }

        console.log(
            "Kisan Mitra AI response generated successfully."
        );

        return res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error("Kisan Mitra AI Error:", error.message);

        const status = error.status || error.code;

        const isTimeout =
            error.name === "AbortError" ||
            error.name === "TimeoutError" ||
            status === 20 ||
            /aborted|timeout/i.test(error.message || "");

        if (status === 503 || status === 429 || isTimeout) {
            return res.status(503).json({
                success: false,
                message: "AI server is busy or taking too long. Please try again."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to connect with AI. Please try again later."
        });
    }
};

module.exports = {
    chatWithAI
};
