import React, { useEffect, useState } from "react";
import { FaChevronDown, FaCss3, FaHtml5, FaJs } from "react-icons/fa";
import { FcSettings } from "react-icons/fc";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { Logo } from "../assests";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MdCheck, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { Alert, UserProfileDetails } from "../components";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import Split from "react-split";
import { useLocation, useParams } from "react-router-dom";

export default function NewProject({
  initialHtml = "",
  initialCss = "",
  initialJs = "",
  initialTitle = "Untitled",
  isReadOnly = false,
}) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [output, setOutput] = useState("");
  const [isTitle, setIsTitle] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isalert, setIsAlert] = useState(false);
  const user = useSelector((state) => state?.user?.user || null);
  const location = useLocation();
  const { id: urlId } = useParams();

  useEffect(() => {
    updateOutput();
  }, [html, css, js]);

  const updateOutput = () => {
    const combinedOutput = `
    <html>
    <title>${title}</title>
      <head>
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}</script>
      </body>
    </html>
    `;
    setOutput(combinedOutput);
  };

  const saveProgram = async () => {
    const id = location.pathname === "/newProject" ? `${Date.now()}` : urlId;
    const docs = {
      id: id,
      title: title,
      html: html,
      css: css,
      js: js,
      output: output,
      user: user,
    };

    await setDoc(doc(db, "Projects", id), docs)
      .then((res) => {
        setIsAlert(true);
      })
      .catch((err) => console.log(err));

    setTimeout(() => {
      setIsAlert(false);
    }, 2000);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-start justify-start overflow-hidden">
      {/* alert */}
      <AnimatePresence>
        {isalert && <Alert status={"Success"} alertMsg={"Project Saved..."} />}
      </AnimatePresence>

      {/* header section */}
      <header className="w-full flex items-center justify-between px-12 py-4">
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col justify-start items-start">
            {/* title */}
            <div className="flex items-center justify-center gap-3">
              <AnimatePresence>
                {isTitle ? (
                  <>
                    <motion.input
                      key={"TitleInput"}
                      type="text"
                      placeholder="Your Title"
                      className="px-3 py-2 bg-transparent rounded-md text-primaryText text-base outline-none border-none"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <motion.p
                      className="px-3 py-2 text-lg text-white"
                      key={"titleLabel"}
                    >
                      {title}
                    </motion.p>
                  </>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isTitle ? (
                  <>
                    <motion.button
                      key={"Checked"}
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer"
                      onClick={() => setIsTitle(false)}
                    >
                      <MdCheck className="text-2xl text-emerald-500" />
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      key={"Edit"}
                      whileTap={{ scale: 0.9 }}
                      className="cursor-pointer"
                      onClick={() => setIsTitle(true)}
                    >
                      <MdEdit className="text-2xl text-primaryText" />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* user info */}
            <div className="flex items-center justify-center px-3 -mt-2 gap-2">
              <p className="text-primaryText text-sm">
                {user?.displayName
                  ? user?.displayName
                  : `${user?.email.split("@")[0]}`}
              </p>
            </div>
          </div>
        </div>

        {/* user section */}
        {user && (
          <div className="flex gap-2 items-center justify-center">
            <motion.button
              onClick={saveProgram}
              whileTap={{ scale: 0.9 }}
              className="px-6 py-4 bg-primaryText cursor-pointer text-base text-primary font-semibold rounded-md"
            >
              Save
            </motion.button>
            <UserProfileDetails />
          </div>
        )}
      </header>

      {/* coding section */}
      <div className="h-full flex-grow w-full">
        <Split
          direction="vertical"
          sizes={[60, 40]}
          minSize={100}
          className="flex flex-col h-full"
        >
          <Split
            direction="horizontal"
            sizes={[33, 33, 34]}
            minSize={100}
            className="flex h-full"
          >
            {/* HTML Editor */}
            <div className="w-full h-full flex flex-col items-start justify-start">
              <div className="w-full flex items-center justify-between">
                <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3  border-t-gray-500">
                  <FaHtml5 className="text-xl text-red-500" />
                  <p className="text-primaryText font-semibold">HTML</p>
                </div>
              </div>
              <div className="w-full px-2 overflow-y-scroll">
                <CodeMirror
                  value={html}
                  height="100%"
                  extensions={[javascript({ jsx: true })]}
                  theme={"dark"}
                  onChange={(value) => {
                    setHtml(value);
                  }}
                />
              </div>
            </div>

            {/* CSS Editor */}
            <div className="w-full h-full flex flex-col items-start justify-start">
              <div className="w-full flex items-center justify-between">
                <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3  border-t-gray-500">
                  <FaCss3 className="text-xl text-sky-500" />
                  <p className="text-primaryText font-semibold">CSS</p>
                </div>
              </div>
              <div className="w-full px-2 overflow-y-scroll">
                <CodeMirror
                  value={css}
                  height="100%"
                  extensions={[javascript({ jsx: true })]}
                  theme={"dark"}
                  onChange={(value) => {
                    setCss(value);
                  }}
                />
              </div>
            </div>

            {/* JS Editor */}
            <div className="w-full h-full flex flex-col items-start justify-start">
              <div className="w-full flex items-center justify-between">
                <div className="bg-secondary px-4 py-2 border-t-4 flex items-center justify-center gap-3  border-t-gray-500">
                  <FaJs className="text-xl text-yellow-500" />
                  <p className="text-primaryText font-semibold">JS</p>
                </div>
              </div>
              <div className="w-full px-2 overflow-y-scroll">
                <CodeMirror
                  value={js}
                  height="100%"
                  extensions={[javascript({ jsx: true })]}
                  theme={"dark"}
                  onChange={(value) => {
                    setJs(value);
                  }}
                />
              </div>
            </div>
          </Split>

          {/* Result Section */}
          <div
            className="bg-white"
            style={{
              overflow: "hidden",
              height: "100%",
            }}
          >
            <iframe
              title="Result"
              srcDoc={output}
              style={{
                border: "none",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </Split>
      </div>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { FaHtml5, FaCss3, FaJs } from "react-icons/fa";
// import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
// import CodeMirror from "@uiw/react-codemirror";
// import { javascript } from "@codemirror/lang-javascript";
// import { useSelector } from "react-redux";
// import { Alert, UserProfileDetails } from "../components";
// import { setDoc, doc } from "firebase/firestore";
// import { db } from "../config/firebase.config";
// import "./styles.css";

// const CodeEditor = ({
//   title,
//   language,
//   value,
//   onChange,
//   isFullscreen,
//   toggleFullscreen,
// }) => {
//   return (
//     <div className={`code-editor ${isFullscreen ? "fullscreen" : ""}`}>
//       <div className="editor-header">
//         {language === "html" && <FaHtml5 className="editor-icon" />}
//         {language === "css" && <FaCss3 className="editor-icon" />}
//         {language === "js" && <FaJs className="editor-icon" />}
//         <h3>{language.toUpperCase()}</h3>
//         <button onClick={toggleFullscreen} className="fullscreen-toggle">
//           {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
//         </button>
//       </div>
//       <CodeMirror
//         value={value}
//         height="100%"
//         extensions={[javascript({ jsx: true })]}
//         theme={"dark"}
//         onChange={onChange}
//       />
//     </div>
//   );
// };

// export default function NewProject() {
//   const [html, setHtml] = useState("");
//   const [css, setCss] = useState("");
//   const [js, setJs] = useState("");
//   const [output, setOutput] = useState("");
//   const [isTitle, setIsTitle] = useState(false);
//   const [title, setTitle] = useState("Untitled");
//   const [isAlert, setIsAlert] = useState(false);
//   const [fullscreen, setFullscreen] = useState({
//     html: false,
//     css: false,
//     js: false,
//   });
//   const user = useSelector((state) => state?.user?.user || null);

//   useEffect(() => {
//     updateOutput();
//   }, [html, css, js]);

//   const updateOutput = () => {
//     const combinedOutput = `
//       <html>
//       <head>
//         <style>${css}</style>
//       </head>
//       <body>
//         ${html}
//         <script>${js}</script>
//       </body>
//       </html>
//     `;
//     setOutput(combinedOutput);
//   };

//   const saveProgram = async () => {
//     const id = `${Date.now()}`;
//     const docs = {
//       id: id,
//       title: title,
//       html: html,
//       css: css,
//       js: js,
//       output: output,
//       user: user,
//     };

//     await setDoc(doc(db, "Projects", id), docs)
//       .then(() => setIsAlert(true))
//       .catch((err) => console.log(err));

//     setTimeout(() => {
//       setIsAlert(false);
//     }, 2000);
//   };

//   const toggleFullscreen = (lang) => {
//     setFullscreen((prev) => ({ ...prev, [lang]: !prev[lang] }));
//   };

//   return (
//     <div className="new-project">
//       {/* Alert */}
//       {isAlert && <Alert status={"Success"} alertMsg={"Project Saved..."} />}

//       {/* Header */}
//       <header className="project-header">
//         <h1>{title}</h1>
//         <UserProfileDetails />
//         <button onClick={saveProgram}>Save</button>
//       </header>

//       {/* Code Editors */}
//       <div className="code-editors">
//         <CodeEditor
//           title={title}
//           language="html"
//           value={html}
//           onChange={(value) => setHtml(value)}
//           isFullscreen={fullscreen.html}
//           toggleFullscreen={() => toggleFullscreen("html")}
//         />
//         <CodeEditor
//           language="css"
//           value={css}
//           onChange={(value) => setCss(value)}
//           isFullscreen={fullscreen.css}
//           toggleFullscreen={() => toggleFullscreen("css")}
//         />
//         <CodeEditor
//           language="js"
//           value={js}
//           onChange={(value) => setJs(value)}
//           isFullscreen={fullscreen.js}
//           toggleFullscreen={() => toggleFullscreen("js")}
//         />
//       </div>

//       {/* Result Section */}
//       <iframe title="Result" srcDoc={output} className="result-iframe" />
//     </div>
//   );
// }
