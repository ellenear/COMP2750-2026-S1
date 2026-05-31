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
  doc,
  setDoc,
  getDoc,
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

// Redirect if not logged in
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadMarketplace(user);
});

// SIGN OUT
document.getElementById("signOutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// --------------------------------------------------
// LOAD ALL ITEMS EXCEPT CURRENT USER'S
// --------------------------------------------------
async function loadMarketplace(user) {
  const container = document.getElementById("items-container");
  container.innerHTML = "";

  const itemsRef = collection(db, "Items");
  const snapshot = await getDocs(itemsRef);

  // FIXED: Use for...of so async calls finish BEFORE attaching handlers
  for (const docSnap of snapshot.docs) {
    const item = docSnap.data();
    const itemId = docSnap.id;

    // Skip items listed by the current user
    if (item.seller === user.email) continue;

    // Check if item is already shortlisted
    const shortlistRef = doc(db, "users", user.uid, "shortlist", itemId);
    const shortlistSnap = await getDoc(shortlistRef);
    const isShortlisted = shortlistSnap.exists();

    container.innerHTML += renderItemCard(item, itemId, isShortlisted);
  }

  // NOW that all cards exist, attach handlers
  attachShortlistHandlers(user);
}

// --------------------------------------------------
// RENDER ITEM CARD
// --------------------------------------------------
function renderItemCard(item, itemId, isShortlisted) {
  return `
    <div class="col-md-4">
      <div class="card shadow-sm">
        <img src="${item.image}" class="card-img-top" alt="Item Image" />

        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-text">${item.description || ""}</p>

          <p class="card-text"><strong>Price:</strong> ${item.price}</p>
          <p class="card-text"><strong>Category:</strong> ${item.category}</p>
          <p class="card-text"><strong>Seller:</strong> ${item.seller}</p>

          <button
            class="btn ${
              isShortlisted ? "btn-secondary" : "btn-primary"
            } w-100 shortlist-btn"
            data-item-id="${itemId}"
            ${isShortlisted ? "disabled" : ""}
          >
            ${isShortlisted ? "Shortlisted" : "Shortlist"}
          </button>
        </div>
      </div>
    </div>
  `;
}

// --------------------------------------------------
// SHORTLIST BUTTON LOGIC
// --------------------------------------------------
function attachShortlistHandlers(user) {
  const buttons = document.querySelectorAll(".shortlist-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemId = btn.dataset.itemId;

      await setDoc(doc(db, "users", user.uid, "shortlist", itemId), {
        addedAt: new Date(),
      });

      // Update button UI
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-secondary");
      btn.innerText = "Shortlisted";
      btn.disabled = true;
    });
  });
}
