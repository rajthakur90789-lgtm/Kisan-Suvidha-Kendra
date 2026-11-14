
const { GoogleGenAI } = require("@google/genai");

// AI Crop Disease Detection Controller
const detectCropDisease = async (req, res) => {
    try {
        // Check uploaded image
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a crop leaf image."
            });
        }

        // Validate image type
        if (!req.file.mimetype.startsWith("image/")) {
            return res.status(400).json({
                success: false,
                message: "Only image files are allowed."
            });
        }

        // Check Gemini API Key
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: "Gemini API key is not configured."
            });
        }

        // Initialize Gemini AI with 120-second timeout
        const ai = new GoogleGenAI({
            apiKey: apiKey,
            httpOptions: {
                timeout: 120000,
                retryOptions: {
                    attempts: 1
                }
            }
        });

        // Convert image into Base64
        const imageBase64 = req.file.buffer.toString("base64");

        console.log("Crop Disease AI: Image analysis started.");

        // Send image to Gemini AI
        const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",

            contents: [
                {
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: imageBase64
                    }
                },
                {
                    text: `
                        You are Kisan Suvidha Kendra's
                        agricultural crop disease assistant.

                        Analyse the uploaded crop leaf image.

                        Give your answer in simple Hindi or Hinglish.

                        Include these sections:

                        1. Crop Name:
                        2. Possible Disease:
                        3. Visible Symptoms:
                        4. Possible Causes:
                        5. Suggested Treatment:
                        6. Prevention Tips:

                        Important rules:
                        - Analyse only what is visible in the image.
                        - If the image is unclear, say so.
                        - If no disease is clearly visible,
                          do not invent a disease.
                        - Mention that the result is an AI-based
                          preliminary identification, not a
                          confirmed diagnosis.
                        - Do not invent pesticide names or dosages.
                        - Recommend consulting a local agriculture
                          expert for serious crop problems.
                        - If the image is not a crop or leaf image,
                          politely explain that a crop leaf image
                          is required.
                    `
                }
            ],

            config: {
                temperature: 0.3,
                maxOutputTokens: 1200
            }
        });

        // Get AI Analysis
        const analysis = response.text;

        if (!analysis) {
            return res.status(500).json({
                success: false,
                message: "AI could not analyse this image. Please try again."
            });
        }

        console.log("Crop Disease AI: Analysis completed.");

        return res.status(200).json({
            success: true,
            message: "Crop image analysed successfully.",
            analysis: analysis
        });

    } catch (error) {
        console.error("Crop Disease AI Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to analyse the crop image. Please try again later."
        });
    }
};

module.exports = {
    detectCropDisease
};
