
import { useEffect, useRef, useState } from "react";
import "../style/chatbot.css";

function Chatbot() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Namaste Kisan Bhai! 👋 Main Kisan Mitra AI hoon. Aap fasal, beej, khaad, sinchai aur kheti se jude sawal mujhse pooch sakte hain."
        }
    ]);
    const [loading, setLoading] = useState(false);

    const chatEndRef = useRef(null);

    // Automatically scroll to latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages, loading]);

    // Send message to Gemini AI backend
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim() || loading) {
            return;
        }

        const userMessage = message.trim();

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: userMessage
            }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/chatbot",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        message: userMessage
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "AI response nahi mil paya."
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: data.reply
                }
            ]);

        } catch (error) {
            console.error("Chatbot Error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: "Maaf kijiye, abhi AI se connection nahi ho pa raha hai. Kripya thodi der baad dobara try karein."
                }
            ]);

        } finally {
            setLoading(false);
        }
    };

    // Quick question suggestions
    const suggestions = [
        "Gehu ki fasal mein peeli pattiyaan kyu hoti hain?",
        "Dhaan ki fasal mein kaunsi khaad daalein?",
        "Fasal mein keede lagne par kya karein?"
    ];

    return (
        <div className="chatbot-page">

            {/* Page Heading */}
            <div className="chatbot-heading">
                <span className="chatbot-tag">
                    FARMER AI ASSISTANT
                </span>

                <h1>Kisan Mitra AI 🌱</h1>

                <p>
                    Aapka smart farming assistant.
                    Kheti se jude sawal poochhein aur
                    aasaan bhasha mein jawab paayein.
                </p>
            </div>

            {/* Chat Container */}
            <div className="chatbot-container">

                {/* Chat Header */}
                <div className="chatbot-header">
                    <div className="chatbot-profile">
                        <div className="chatbot-avatar">
                            🌾
                        </div>

                        <div>
                            <h3>Kisan Mitra AI</h3>
                            <span>
                                <span className="online-dot"></span>
                                AI Assistant Online
                            </span>
                        </div>
                    </div>

                    <span className="chatbot-status">
                        Active
                    </span>
                </div>

                {/* Chat Messages */}
                <div className="chatbot-messages">

                    {messages.map((item, index) => (
                        <div
                            key={index}
                            className={`message-row ${item.role}`}
                        >
                            {item.role === "assistant" && (
                                <div className="message-avatar">
                                    🌾
                                </div>
                            )}

                            <div className="message-bubble">
                                {item.text}
                            </div>
                        </div>
                    ))}

                    {/* AI Typing Indicator */}
                    {loading && (
                        <div className="message-row assistant">
                            <div className="message-avatar">
                                🌾
                            </div>

                            <div className="message-bubble typing">
                                Kisan Mitra AI soch raha hai...
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef}></div>
                </div>

                {/* Quick Suggestions */}
                {messages.length === 1 && (
                    <div className="chatbot-suggestions">
                        <p>Try asking:</p>

                        {suggestions.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setMessage(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                )}

                {/* Message Input */}
                <form
                    className="chatbot-input-area"
                    onSubmit={sendMessage}
                >
                    <input
                        type="text"
                        placeholder="Apna kheti se juda sawal likhein..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={!message.trim() || loading}
                    >
                        Send ➤
                    </button>
                </form>

                <p className="chatbot-footer">
                    Kisan Mitra AI ke jawab salah ke liye hain.
                    Zaroorat padne par local agriculture expert se salah lein.
                </p>

            </div>
        </div>
    );
}

export default Chatbot;
