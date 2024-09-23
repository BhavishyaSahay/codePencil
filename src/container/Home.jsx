import React, { useState } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { motion } from "framer-motion";
import { Link, Route, Routes } from "react-router-dom";
import { Logo } from "../assests";
import { Projects, SignUp } from "../container";
import { useDispatch, useSelector } from "react-redux";
import { UserProfileDetails } from "../components";
import { SET_SEARCH_TERM } from "../context/actions/searchActions";

export default function Home() {
  const [isSideMenu, setIsSideMenu] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const searchTerm = useSelector((state) =>
    state.searchTerm?.searchTerm ? state.searchTerm?.searchTerm : ""
  );
  const dispatch = useDispatch();

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isSideMenu ? "w-16" : "w-16 sm:w-20 md:w-1/4 xl:w-1/5"
        } min-h-screen max-h-screen relative bg-secondary px-3 py-6 flex flex-col items-center justify-start gap-4 transition-all duration-200 ease-in-out`}
      >
        <div className="w-full flex flex-col gap-4">
          {/* Logo */}
          <Link to={"/home"}>
            <img
              src={Logo}
              alt="Logo"
              className="object-contain w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40"
            />
          </Link>

          {/* Start Coding Button */}
          <Link to={"/newProject"}>
            <div className="px-6 py-3 flex items-center justify-center rounded-xl border border-gray-400 cursor-pointer group hover:border-gray-200">
              <p className="text-gray-400 group-hover:text-gray-200 capitalize text-sm md:text-base">
                Start Coding
              </p>
            </div>
          </Link>

          {/* Home Nav */}
          {user && (
            <Link
              to={"/home/projects"}
              className="flex items-center justify-center gap-2 sm:gap-4"
            >
              <MdHome className="text-primaryText text-xl" />
              <p className="hidden sm:block text-primaryText text-sm md:text-base">
                Home
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen max-h-screen overflow-y-scroll h-full flex flex-col items-start justify-start px-2 sm:px-6 lg:px-12 py-4 md:py-8">
        {/* Top Section */}
        <div className="w-full flex items-center justify-between gap-3">
          {/* Search Bar */}
          {user && (
            <div className="bg-secondary w-full px-4 py-3 rounded-md flex items-center gap-3">
              <FaSearch className="text-lg md:text-xl text-primaryText" />
              <input
                type="text"
                value={searchTerm}
                className="flex-1 text-sm md:text-base lg:text-lg bg-transparent outline-none border-none text-primaryText placeholder:text-gray-600"
                placeholder="Search here..."
                onChange={(e) => dispatch(SET_SEARCH_TERM(e.target.value))}
              />
            </div>
          )}

          {/* Profile Section */}
          {user && <UserProfileDetails />}
        </div>

        {/* Bottom Section (Routes) */}
        <div className="w-full">
          <Routes>
            <Route path="/*" element={<Projects />} />
            <Route path="/auth" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
