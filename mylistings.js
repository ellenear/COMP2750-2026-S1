import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsmzCtW5ADthBJv_PNdz_trDb8BSn8WL0",
  authDomain: "campus-marketplace-70b95.firebaseapp.com",
  projectId: "campus-marketplace-70b95",
  storageBucket: "campus-marketplace-70b95.appspot.com",
  messagingSenderId: "1017814633308",
  appId: "1:1017814633308:web:25463e96717e7e024fcf99",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const listingsContainer = document.getElementById("listingsContainer");
const emptyMessage = document.getElementById("emptyMessage");

// Redirect if not logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadMyListings(user);
});

// Load only current user's listings
async function loadMyListings(user) {
  listingsContainer.innerHTML = "";
  emptyMessage.textContent = "";

  const itemsRef = collection(db, "Items");
  const snapshot = await getDocs(itemsRef);

  let found = false;

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();

    // Only show items where seller matches current user
    if (item.seller !== user.email) return;

    found = true;

    // FIXED: Price already includes "$"
    const price = item.price;

    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";

    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img 
          src="${item.image}" 
          class="card-img-top"
          alt="${item.name}"
          style="height:250px; object-fit:cover;"
        >

        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">${item.description || ""}</p>

          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Category:</strong> ${item.category}</p>
          <p><strong>Seller:</strong> ${user.email}</p>
        </div>
      </div>
    `;

    listingsContainer.appendChild(card);
  });

  if (!found) {
    emptyMessage.textContent = "You have not listed any items yet.";
  }
}

// Sign out
document.getElementById("signOutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
