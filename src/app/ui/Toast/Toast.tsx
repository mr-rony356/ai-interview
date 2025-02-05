"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -5 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, y: -30, scale: 0.7, rotate: 5 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          type: "spring",
          stiffness: 120,
        }}
        className={`fixed z-50 bottom-6 right-6 w-80 p-5 rounded-xl border shadow-xl flex items-center gap-4 
          ${
            type === "success"
              ? "bg-green-100 border-green-400 shadow-green-200/50"
              : "bg-red-100 border-red-400 shadow-red-200/50"
          }`}
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 8,
            delay: 0.1,
          }}
        >
          {type === "success" ? (
            <motion.div
              animate={{
                rotate: [0, 10, -10, 5, -5, 0],
                transition: { duration: 0.6, ease: "easeInOut" },
              }}
            >
              ✅
            </motion.div>
          ) : (
            <motion.div
              animate={{
                rotate: [0, 15, -15, 7, -7, 0],
                transition: { duration: 0.6, ease: "easeInOut" },
              }}
            >
              ❌
            </motion.div>
          )}
        </motion.div>

        {/* Message */}
        <div className="text-gray-800 font-medium flex-1">{message}</div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 transition-transform active:scale-90"
        >
          <X size={20} strokeWidth={1} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
