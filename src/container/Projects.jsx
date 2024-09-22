import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MdBookmark } from "react-icons/md";
import { db } from "../config/firebase.config";
import { useDispatch } from "react-redux";
import { SET_PROJECTS } from "../context/actions/projectActions";
import {
  setDoc,
  doc,
  collection,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore";

export default function Projects() {
  const projects = useSelector((state) => state.projects?.projects);
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
      const projectList = querySnaps.docs.map((doc) => doc.data());
      dispatch(SET_PROJECTS(projectList));
    });

    return unsubscribe;
  }, []);

  const [filter, setFilter] = useState(null);

  useEffect(() => {
    if (searchTerm?.length > 0) {
      setFilter(
        projects?.filter((project) => {
          const lowerCaseItem = project?.title?.toLowerCase();
          return searchTerm
            .split("")
            .every((letter) => lowerCaseItem?.includes(letter));
        })
      );
    } else {
      setFilter(null);
    }
  }, [searchTerm, projects]);

  return (
    <div className="mt-6 w-full px-6 flex items-center justify-center gap-6 flex-wrap ">
      {user && (
        <>
          {filter ? (
            <>
              {filter &&
                filter.map((project, index) => {
                  return (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  );
                })}
            </>
          ) : (
            <>
              {projects &&
                projects.map((project, index) => {
                  return (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                    />
                  );
                })}
            </>
          )}
        </>
      )}
    </div>
  );
}

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      key={index}
      className="w-full cursor-pointer md:w-[450px] h-[375px] bg-secondary rounded-md p-4 flex flex-col items-center justify-center gap-4"
    >
      <div
        className="bg-primary w-full h-full rounded-md overflow-hidden"
        style={{
          overflow: "hidden",
          height: "100%",
        }}
      >
        <iframe
          title="Result"
          srcDoc={project.output}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
          }}
        />
      </div>

      <div className="flex items-center justify-center gap-3 w-full">
        {/* image */}
        <div className="w-14 h-14 flex items-center justify-center rounded-xl overflow-hidden cursor-pointer bg-emerald-500">
          {project?.user?.photoURL ? (
            <>
              <motion.img
                whileHover={{ scale: 1.2 }}
                src={project?.user?.photoURL}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </>
          ) : (
            <p className="text-xl text-white font-semibold capitalize">
              {project?.user?.email[0]}
            </p>
          )}
        </div>
        {/* name */}
        <div>
          <p className=" text-white text-lg font-bold capitalize">
            {project?.title}
          </p>
          <p className="text-primaryText text-sm">
            {project?.user?.displayName
              ? project?.user?.displayName
              : `${project?.user?.email.split("@")[0]}`}
          </p>
        </div>

        {/* collection */}
        <motion.div
          className="cursor-pointer ml-auto"
          whileTap={{ scale: 0.9 }}
        >
          <MdBookmark className="text-primaryText text-3xl" />
        </motion.div>
      </div>
    </motion.div>
  );
};
