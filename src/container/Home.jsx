import React, { useState } from "react";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { motion } from "framer-motion";
import { Logo } from "../assests";
import { Link, Route, Routes } from "react-router-dom";
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
        } min-h-screen max-h-screen relative bg-gradient-to-b from-gray-800 to-gray-900 px-3 py-6 flex flex-col items-center justify-start gap-4 transition-all duration-300 ease-in-out shadow-lg`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSideMenu(!isSideMenu)}
          className="text-gray-400 hover:text-white"
        >
          <HiChevronDoubleLeft
            className={`transform transition-transform ${
              isSideMenu ? "rotate-180" : ""
            }`}
          />
        </button>

        <div className="w-full flex flex-col gap-4 items-center">
          {/* Logo */}
          <Link to={"/home"}>
            <img
              src={Logo}
              alt="Logo"
              className="object-contain w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 transition-transform transform hover:scale-105"
            />
          </Link>

          {/* Start Coding Button */}
          {!isSideMenu && ( // Only show button when sidebar is expanded
            <Link to={"/newProject"}>
              <div className="w-full px-2">
                {" "}
                {/* Added w-full and px-2 */}
                <div className="flex items-center justify-center rounded-md border border-gray-600 cursor-pointer group hover:border-gray-400 transition-colors hover:bg-indigo-500">
                  <p className="text-gray-400 group-hover:text-white capitalize text-sm md:text-base transition-colors p-2 text-center">
                    {" "}
                    {/* Added p-2 and text-center */}
                    Start Coding
                  </p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen max-h-screen overflow-y-scroll h-full flex flex-col items-start justify-start px-2 sm:px-6 lg:px-12 py-4 md:py-8 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200">
        {/* Top Section */}
        <div className="w-full flex items-center justify-between gap-3">
          {/* Search Bar */}
          {user && (
            <div className="bg-gray-700 w-full px-4 py-3 rounded-md flex items-center gap-3 shadow-md">
              <FaSearch className="text-lg md:text-xl text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                className="flex-1 text-sm md:text-base lg:text-lg bg-transparent outline-none border-none text-gray-300 placeholder:text-gray-500"
                placeholder="Search here..."
                onChange={(e) => dispatch(SET_SEARCH_TERM(e.target.value))}
              />
            </div>
          )}

          {/* Profile Section */}
          {user && <UserProfileDetails />}
        </div>

        {/* Bottom Section (Routes) */}
        <div className="w-full mt-6">
          <Routes>
            <Route path="/*" element={<Projects />} />
            <Route path="/auth" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
