import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsmzCtW5ADthBJv_PNdz_trDb8BSn8WL0",
  authDomain: "campus-marketplace-70b95.firebaseapp.com",
  projectId: "campus-marketplace-70b95",
  storageBucket: "campus-marketplace-70b95.firebasestorage.app",
  messagingSenderId: "1017814633308",
  appId: "1:1017814633308:web:25463e96717e7e024fcf99",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.getElementById("signInButton");
const messageArea = document.getElementById("messageArea");

signInButton.addEventListener("click", async function (event) {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    messageArea.textContent =
      "Sign in successful. Welcome, " + user.email + ".";
    messageArea.style.color = "green";

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1500);
  } catch (error) {
    messageArea.textContent =
      "Sign in failed. Please check your email and password.";
    messageArea.style.color = "red";
  }
});

const signOutBtn = document.getElementById("signOutBtn");
if (signOutBtn) {
  signOutBtn.addEventListener("click", async function () {
    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  });
}
