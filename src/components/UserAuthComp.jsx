import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import React, { useState } from "react";

export default function UserAuthComp({
  label,
  isPass,
  placeholder,
  setStateFunction,
  Icon,
  setGetEmailStatus,
}) {
  const [value, setValue] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isEmailValid, setEmailValid] = useState(false);

  const handleTextChange = (e) => {
    setValue(e.target.value);
    setStateFunction(e.target.value);

    if (placeholder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(e.target.value);
      setEmailValid(status);
      setGetEmailStatus(status);
    }
  };

  return (
    <div className="flex flex-col items-start justify-start gap-1 w-full">
      <label className="text-xs md:text-sm text-gray-300">{label}</label>
      <div
        className={`flex items-center justify-center gap-3 w-full sm:w-64 md:w-80 lg:w-96 rounded-md px-2 md:px-4 py-1 bg-gray-100
        ${
          !isEmailValid &&
          placeholder === "Email" &&
          value.length > 0 &&
          "border-2 border-red-500"
        }`}
      >
        <Icon className="text-text555 text-xl md:text-2xl" />
        <input
          type={isPass && showPass ? "password" : "text"}
          placeholder={placeholder}
          className="flex-1 w-full py-2 outline-none border-none bg-transparent text-text555 text-sm md:text-lg"
          value={value}
          onChange={handleTextChange}
        />
        {isPass && (
          <motion.div
            onClick={() => setShowPass(!showPass)}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            {showPass ? (
              <FaEyeSlash className="text-text555 text-xl md:text-2xl" />
            ) : (
              <FaEye className="text-text555 text-xl md:text-2xl" />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
