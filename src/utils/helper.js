import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase.config";
import { v4 as uuidv4 } from "uuid";
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, googleProvider);
};

export const signInWithGithub = () => {
  signInWithPopup(auth, githubProvider);
};

export const Menus = [
  { id: uuidv4(), name: "Projects", url: "/home/projects" },
  // { id: uuidv4(), name: "Collections", url: "/home/collections" },
  // { id: uuidv4(), name: "Profile", url: "/home/profile" },
];

export const signOutAction = async () => {
  await auth.signOut().then(() => {
    window.location.reload();
  });
};
