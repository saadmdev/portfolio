"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CopyEmailButtonProps {
  email?: string;
}

const CopyEmailButton = ({ email = "devsaadm@gmail.com" }: CopyEmailButtonProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <motion.button
      onClick={copyToClipboard}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 1.02 }}
      className="relative px-4 py-3 text-sm text-center rounded-full font-medium bg-white/20 border border-white/30 backdrop-blur-sm w-[14rem] cursor-pointer overflow-hidden hover:bg-white/30 transition-colors"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.p
            className="flex items-center justify-center gap-2 text-white"
            key="copied"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
          >
            <img src="/copy-done.svg" className="w-5" alt="Copied" />
            Email Copied!
          </motion.p>
        ) : (
          <motion.p
            className="flex items-center justify-center gap-2 text-white"
            key="copy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <img src="/copy.svg" className="w-5" alt="Copy" />
            Copy Email Address
          </motion.p>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyEmailButton;
