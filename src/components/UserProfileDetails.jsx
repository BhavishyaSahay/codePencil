import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { signOutAction } from "../utils/helper";
import { SlideUpOut } from "../animations";
import { Menus } from "../utils/helper";

export default function UserProfileDetails() {
  const user = useSelector((state) => state.user?.user);
  const [isMenu, setIsMenu] = useState(false);

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 relative">
      {/* Profile Image or Initial */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full overflow-hidden cursor-pointer bg-emerald-500">
        {user?.photoURL ? (
          <motion.img
            whileHover={{ scale: 1.2 }}
            src={user?.photoURL}
            alt={user?.displayName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-lg sm:text-xl text-white font-semibold capitalize">
            {user?.email[0]}
          </p>
        )}
      </div>

      {/* Chevron for Dropdown */}
      <motion.div
        onClick={() => setIsMenu(!isMenu)}
        whileTap={{ scale: 0.9 }}
        className="p-2 sm:p-3 rounded-md flex items-center justify-center bg-secondary cursor-pointer"
      >
        <FaChevronDown className="text-primaryText text-sm sm:text-base" />
      </motion.div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenu && (
          <motion.div
            {...SlideUpOut}
            className="bg-secondary absolute top-12 sm:top-16 right-0 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md z-10 flex flex-col items-start justify-start gap-3 sm:gap-4 min-w-[150px] sm:min-w-[200px]"
          >
            {/* Menu Items */}
            {/* Example of mapping dynamic menus */}
            {Menus &&
              Menus.map((menu) => (
                <Link
                  to={menu.url}
                  key={menu.id}
                  className="text-primaryText text-sm sm:text-lg hover:bg-[rgba(256,256,256,0.05)] px-2 py-1 w-full rounded-md"
                >
                  {menu.name}
                </Link>
              ))}

            {/* Sign Out */}
            <motion.p
              onClick={signOutAction}
              whileTap={{ scale: 0.9 }}
              className="text-primaryText text-sm sm:text-lg hover:bg-[rgba(256,256,256,0.05)] px-2 py-1 w-full rounded-md cursor-pointer"
            >
              Sign Out
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
