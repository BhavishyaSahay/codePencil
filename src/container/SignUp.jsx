import React, { useState } from "react";
import { UserAuthComp } from "../components";
import { FaEnvelope, FaEye } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signInWithGoogle, signInWithGithub } from "../utils/helper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { fadeOut } from "../animations";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailStatus, setGetEmailStatus] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const createNewUser = async () => {
    if (getEmailStatus) {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const loginWithEmailPassword = async () => {
    if (getEmailStatus) {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log(userCred);
          }
        })
        .catch((err) => {
          console.log(err.message);
          if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMsg("User not found");
          } else if (err.message.includes("invalid-credential")) {
            setAlert(true);
            setAlertMsg("Invalid credential");
          } else {
            setAlert(true);
            setAlertMsg("Failed due to many logins");
          }

          setInterval(() => {
            setAlert(false);
          }, 4000);
        });
    }
  };

  return (
    <div className="w-full py-6">
      <div className="w-full flex flex-col items-center justify-center py-6 md:py-8">
        <p className="py-6 md:py-12 text-xl md:text-2xl text-primaryText">
          Join With Us!
        </p>

        <div className="px-4 md:px-8 w-full md:w-auto py-4 rounded-xl bg-secondary shadow-md flex flex-col items-center justify-center gap-6 md:gap-8">
          {/* email */}
          <UserAuthComp
            label="Email"
            key="Email"
            placeholder="Email"
            isPass={false}
            setStateFunction={setEmail}
            Icon={FaEnvelope}
            setGetEmailStatus={setGetEmailStatus}
          />
          {/* password */}
          <UserAuthComp
            label="Password"
            key="Password"
            placeholder="Password"
            isPass={true}
            setStateFunction={setPassword}
            Icon={MdPassword}
          />

          {/* alert */}
          <AnimatePresence>
            {alert && (
              <motion.p
                key={"Alert Message"}
                {...fadeOut}
                className="text-red-500 text-sm md:text-base"
              >
                {alertMsg}
              </motion.p>
            )}
          </AnimatePresence>

          {/* login/signup button */}
          {!isLogin ? (
            <motion.div
              onClick={createNewUser}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-full py-2 md:py-3 rounded-xl hover:bg-emerald-400 cursor-pointer bg-emerald-500"
            >
              <p className="text-lg md:text-xl text-white">Sign Up</p>
            </motion.div>
          ) : (
            <motion.div
              onClick={loginWithEmailPassword}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center w-full py-2 md:py-3 rounded-xl hover:bg-emerald-400 cursor-pointer bg-emerald-500"
            >
              <p className="text-lg md:text-xl text-white">Login</p>
            </motion.div>
          )}

          {/* account text section */}
          {!isLogin ? (
            <p className="text-xs md:text-sm text-primaryText flex items-center justify-center gap-1 md:gap-3">
              Already Have an account?
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-500 cursor-pointer"
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-xs md:text-sm text-primaryText flex items-center justify-center gap-1 md:gap-3">
              Don't have an account?
              <span
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-500 cursor-pointer"
              >
                Create Here
              </span>
            </p>
          )}

          {/* or section */}
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-12 md:w-24"></div>
            <p className="text-xs md:text-sm text-[rgba(256,256,256,0.2)]">
              OR
            </p>
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-12 md:w-24"></div>
          </div>

          {/* sign in with google */}
          <motion.div
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-2 md:gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-2 md:py-3 rounded-xl hover: bg-[rgba(256,256,256,0.4)] cursor-pointer"
            whileTap={{ scale: 0.9 }}
          >
            <FcGoogle className="text-2xl md:text-3xl" />
            <p className="text-white text-lg md:text-xl">Sign In with Google</p>
          </motion.div>

          {/* or section */}
          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-12 md:w-24"></div>
            <p className="text-xs md:text-sm text-[rgba(256,256,256,0.2)]">
              OR
            </p>
            <div className="h-[1px] bg-[rgba(256,256,256,0.2)] rounded-md w-12 md:w-24"></div>
          </div>

          {/* sign in with github */}
          <motion.div
            onClick={signInWithGithub}
            className="flex items-center justify-center gap-2 md:gap-3 bg-[rgba(256,256,256,0.2)] backdrop-blur-md w-full py-2 md:py-3 rounded-xl hover:bg-[rgba(256,256,256,0.4)] cursor-pointer"
            whileTap={{ scale: 0.9 }}
          >
            <FaGithub className="text-2xl md:text-3xl" />
            <p className="text-white text-lg md:text-xl">Sign In with Github</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
