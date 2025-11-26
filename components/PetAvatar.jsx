import { motion } from "framer-motion";

const PetAvatar = ({ isSpeaking }) => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-primary/20 rounded-full overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1">
                {/* Ears - Rounded and Perky */}
                <path d="M20 40 Q15 15 40 25" fill="#F13024" stroke="#F13024" strokeWidth="2" strokeLinejoin="round" />
                <path d="M80 40 Q85 15 60 25" fill="#F13024" stroke="#F13024" strokeWidth="2" strokeLinejoin="round" />

                {/* Head - Soft Rounded Square */}
                <rect x="15" y="25" width="70" height="60" rx="25" fill="#131424" stroke="#F13024" strokeWidth="2" />

                {/* Eyes Group for Blinking */}
                <motion.g
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.02, 0.05], delay: 2 }}
                    style={{ originY: "45px" }}
                >
                    {/* Left Eye */}
                    <circle cx="35" cy="45" r="10" fill="#00ffcc" />
                    <circle cx="38" cy="42" r="3" fill="white" opacity="0.9" />

                    {/* Right Eye */}
                    <circle cx="65" cy="45" r="10" fill="#00ffcc" />
                    <circle cx="68" cy="42" r="3" fill="white" opacity="0.9" />
                </motion.g>

                {/* Cheeks */}
                <circle cx="25" cy="60" r="4" fill="#F13024" opacity="0.4" />
                <circle cx="75" cy="60" r="4" fill="#F13024" opacity="0.4" />

                {/* Nose */}
                <ellipse cx="50" cy="60" rx="6" ry="4" fill="#F13024" />

                {/* Mouth Animation */}
                <motion.g
                    animate={isSpeaking ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    style={{ originX: "50px", originY: "75px" }}
                >
                    {isSpeaking ? (
                        <path d="M40 72 Q50 82 60 72 Z" fill="#333" stroke="#fff" strokeWidth="1" />
                    ) : (
                        <path d="M42 72 Q50 78 58 72" fill="transparent" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                    )}
                </motion.g>
            </svg>
        </div>
    );
};

export default PetAvatar;
