import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To access project ID from URL
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../config/firebase.config"; // Firestore configuration
import { Spinner } from "../components"; // Loading spinner
import NewProject from "./NewProject"; // Import the NewProject component

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from URL parameters
  const [project, setProject] = useState(null); // State to hold the project data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch the document from Firestore
        const projectDoc = await getDoc(doc(db, "Projects", id));
        if (projectDoc.exists()) {
          // Set the project data to the state if document exists
          setProject(projectDoc.data());
        } else {
          console.log("No such project!");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setIsLoading(false); // Stop loading when fetch is complete
      }
    };

    fetchProject();
  }, [id]); // Dependency array includes `id` so the effect runs when `id` changes

  if (isLoading) {
    // Show a spinner while loading the project data
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-start justify-start p-4">
      {project ? (
        // Pass project data as props to NewProject component
        <NewProject
          initialHtml={project.html}
          initialCss={project.css}
          initialJs={project.js}
          initialTitle={project.title}
          isReadOnly={true} // If you want to make the fields read-only
        />
      ) : (
        <p>No project found</p>
      )}
    </div>
  );
};

export default ProjectDetails;
