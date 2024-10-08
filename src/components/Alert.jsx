import React from "react";
import { motion } from "framer-motion";
import { SlideUpOut } from "../animations";

export default function Alert({ status, alertMsg }) {
  return (
    <motion.div
      {...SlideUpOut}
      className="fixed top-8 md:top-24 right-4 md:right-12 z-10"
    >
      {status === "Success" && (
        <div className="px-3 md:px-4 py-2 rounded-md bg-emerald-400 shadow-md shadow-emerald-500">
          <p className="text-sm md:text-lg text-primary">{alertMsg}</p>
        </div>
      )}

      {status === "Warning" && (
        <div className="px-3 md:px-4 py-2 rounded-md bg-yellow-400 shadow-md shadow-yellow-500">
          <p className="text-sm md:text-lg text-primary">{alertMsg}</p>
        </div>
      )}

      {status === "Danger" && (
        <div className="px-3 md:px-4 py-2 rounded-md bg-red-400 shadow-md shadow-red-500">
          <p className="text-sm md:text-lg text-primary">{alertMsg}</p>
        </div>
      )}
    </motion.div>
  );
}
