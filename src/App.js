import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Home, NewProject } from "./container";
import { auth, db } from "./config/firebase.config";
import {
  setDoc,
  doc,
  collection,
  orderBy,
  onSnapshot,
  query,
} from "firebase/firestore";
import { Spinner } from "./components";
import { useDispatch } from "react-redux";
import { SET_USER } from "./context/actions/userActions";
import { SET_PROJECTS } from "./context/actions/projectActions";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userCred) => {
      if (userCred) {
        console.log(userCred?.providerData[0]);
        setDoc(doc(db, "users", userCred?.uid), userCred?.providerData[0]).then(
          () => {
            console.log("user added");
            dispatch(SET_USER(userCred?.providerData[0]));

            // Navigate to /home/projects only if the user is not already on another route like /newProject
            if (location.pathname === "/home/auth") {
              navigate("/home", { replace: true });
            }
          }
        );
      } else {
        navigate("/home/auth", { replace: true });
      }

      // Close the spinner after 2 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    });

    return () => unsubscribe();
  }, [navigate, location.pathname, dispatch]);

  // useEffect(() => {
  //   const projectQuery = query(
  //     collection(db, "Projects"),
  //     orderBy("id", "desc")
  //   );

  //   const unsubscribe = onSnapshot(projectQuery, (querySnaps) => {
  //     const projectList = querySnaps.docs.map((doc) => doc.data());
  //     dispatch(SET_PROJECTS(projectList));
  //     console.log("projectList", projectList);
  //   });

  //   return unsubscribe;
  // }, []);

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-start items-start overflow-hidden">
          <Routes>
            <Route path="/home/*" element={<Home />} />
            <Route path="/newProject" element={<NewProject />} />

            {/* if route not matching */}
            <Route path="*" element={<Navigate to={"/home"} />} />
          </Routes>
        </div>
      )}
    </>
  );
}
