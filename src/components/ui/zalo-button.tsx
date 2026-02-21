import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

const ZALO_LINK = "https://zalo.me/0901234567"; // TODO: Thay bằng SĐT/link Zalo OA thực tế

const ZaloButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-foreground text-background px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium max-w-[200px]"
          >
            <p>Chat với EliteFit qua Zalo!</p>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-foreground rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        href={ZALO_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#0068FF] hover:bg-[#0055DD] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat qua Zalo"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.a>

      {/* Pulse ring animation */}
      <div className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none">
        <span className="absolute inset-0 rounded-full bg-[#0068FF]/30 animate-ping" />
      </div>
    </div>
  );
};

export default ZaloButton;
