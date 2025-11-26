import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import PetAvatar from "./PetAvatar";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", text: "Hi! I'm an AI assistant. Ask me anything about the portfolio!" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const speak = (text) => {
        if (isMuted || !window.speechSynthesis) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        // Optional: Select a specific voice if desired, or let browser default
        // const voices = window.speechSynthesis.getVoices();
        // utterance.voice = voices.find(voice => voice.lang === 'en-US'); 

        window.speechSynthesis.speak(utterance);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages((prev) => [...prev, { role: "assistant", text: data.response }]);
                speak(data.response);
            } else {
                const errorMsg = data.message || "Something went wrong.";
                setMessages((prev) => [...prev, { role: "assistant", text: `Error: ${errorMsg}` }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", text: "Error: Failed to connect to server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                className="fixed bottom-8 right-8 z-50 bg-accent text-white w-16 h-16 rounded-full shadow-lg hover:bg-accent/80 transition-all flex items-center justify-center overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes size={24} /> : <div className="w-12 h-12"><PetAvatar isSpeaking={isSpeaking} /></div>}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-8 z-50 w-80 md:w-96 bg-primary/90 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-accent/20 p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <div className="w-8 h-8">
                                    <PetAvatar isSpeaking={isSpeaking} />
                                </div>
                                AI Assistant
                            </h3>
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="text-white/70 hover:text-white transition-colors"
                                title={isMuted ? "Unmute" : "Mute"}
                            >
                                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user"
                                            ? "bg-accent text-white rounded-br-none"
                                            : "bg-white/10 text-white rounded-bl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                            <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-primary/50">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about my skills..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="bg-accent p-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/80 transition-colors"
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
