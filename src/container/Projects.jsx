import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { MdBookmark } from "react-icons/md";
import { MdDelete } from "react-icons/md"; // Import the delete icon
import { db } from "../config/firebase.config";
import { SET_PROJECTS } from "../context/actions/projectActions";
import {
  onSnapshot,
  collection,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Projects() {
  const projects = useSelector((state) => state.projects?.projects || []); // Fallback to an empty array
  const user = useSelector((state) => state.user?.user);
  const searchTerm = useSelector((state) =>
    state.searchTerm?.searchTerm ? state.searchTerm?.searchTerm : ""
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const projectQuery = query(
      collection(db, "Projects"),
      orderBy("id", "desc")
    );

    const unsubscribe = onSnapshot(projectQuery, (querySnaps) => {
      const projectList = querySnaps.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })); // Include document ID
      dispatch(SET_PROJECTS(projectList));
    });

    return unsubscribe;
  }, [dispatch]);

  const [filter, setFilter] = useState([]);

  useEffect(() => {
    if (searchTerm?.length > 0) {
      setFilter(
        projects?.filter((project) => {
          const lowerCaseItem = project?.title?.toLowerCase();
          return searchTerm
            .split("")
            .every((letter) => lowerCaseItem?.includes(letter));
        }) || [] // Fallback to an empty array if filtering fails
      );
    } else {
      setFilter([]);
    }
  }, [searchTerm, projects]);

  const handleDelete = async (projectId) => {
    const projectRef = doc(db, "Projects", projectId);
    await deleteDoc(projectRef);
    dispatch(
      SET_PROJECTS(projects.filter((project) => project.id !== projectId))
    ); // Update local state after deletion
  };

  return (
    <div className="mt-6 w-full px-6 flex items-center justify-center gap-6 flex-wrap">
      {user && (
        <>
          {filter.length > 0
            ? filter.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onDelete={handleDelete} // Pass delete function as prop
                />
              ))
            : projects.length > 0 &&
              projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onDelete={handleDelete} // Pass delete function as prop
                />
              ))}
        </>
      )}
    </div>
  );
}

const ProjectCard = ({ project, index, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${project.id}`); // Navigate to the project detail page
  };

  return (
    <motion.div
      key={index}
      className="w-full cursor-pointer md:w-[450px] h-[400px] bg-gradient-to-tr from-gray-800 to-gray-900 rounded-lg p-6 flex flex-col items-center justify-center gap-4 shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
      onClick={handleClick}
      whileHover={{ boxShadow: "0 0 20px 5px rgba(173, 216, 230, 0.6)" }} // Add colorful shadow on hover
    >
      <div
        className="bg-gray-700 w-full h-full rounded-lg overflow-hidden relative shadow-inner border border-gray-600"
        style={{
          overflow: "hidden",
          height: "100%",
        }}
      >
        <iframe
          title="Result"
          srcDoc={project.output}
          className="border-none w-full h-full rounded-lg"
        />
      </div>

      <div className="flex items-center justify-center gap-3 w-full">
        {/* User image or initials */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden cursor-pointer bg-gradient-to-r from-green-400 to-emerald-500 transition-transform transform hover:scale-110">
          {project?.user?.photoURL ? (
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={project?.user?.photoURL}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-xl text-white font-semibold capitalize">
              {project?.user?.email[0]}
            </p>
          )}
        </div>

        {/* Project details */}
        <div className="ml-4">
          <p className="text-white text-lg font-bold capitalize">
            {project?.title}
          </p>
          <p className="text-gray-400 text-sm">
            {project?.user?.displayName
              ? project?.user?.displayName
              : `${project?.user?.email.split("@")[0]}`}
          </p>
        </div>

        {/* Bookmark icon */}
        <motion.div
          className="cursor-pointer ml-auto p-2 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-colors duration-300 ease-in-out"
          whileTap={{ scale: 0.9 }}
          whileHover={{ color: "#FFD700" }}
        >
          <MdBookmark className="text-primaryText text-3xl text-white" />
        </motion.div>

        {/* Delete icon */}
        <motion.div
          className="cursor-pointer p-2 bg-red-500 rounded-full hover:bg-red-400 transition-colors duration-300 ease-in-out"
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click event
            onDelete(project.id); // Call the delete function
          }}
        >
          <MdDelete className="text-white text-3xl" />
        </motion.div>
      </div>
    </motion.div>
  );
};
