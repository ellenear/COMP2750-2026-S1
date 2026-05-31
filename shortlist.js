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
  deleteDoc,
  doc,
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

  loadShortlist(user);
});

// SIGN OUT
document.getElementById("signOutBtn").addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});

// LOAD SHORTLIST
async function loadShortlist(user) {
  const container = document.getElementById("shortlist-container");
  container.innerHTML = "";

  const shortlistRef = collection(db, "users", user.uid, "shortlist");
  const shortlistSnap = await getDocs(shortlistRef);

  if (shortlistSnap.empty) {
    container.innerHTML = `<p class="text-muted">You have no shortlisted items.</p>`;
    return;
  }

  for (const docSnap of shortlistSnap.docs) {
    const itemId = docSnap.id;

    // FIXED: Load from correct collection name "Items"
    const itemRef = doc(db, "Items", itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) continue;

    const item = itemSnap.data();

    container.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm h-100">
          <img src="${item.image}" class="card-img-top" alt="${
      item.name
    }" style="height:250px; object-fit:cover;" />

          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">${item.description || ""}</p>

            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Category:</strong> ${item.category}</p>
            <p><strong>Seller:</strong> ${item.seller}</p>

            <button class="btn btn-danger w-100 remove-btn" data-id="${itemId}">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachRemoveHandlers(user.uid);
}

// REMOVE ITEM
function attachRemoveHandlers(uid) {
  const buttons = document.querySelectorAll(".remove-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const itemId = btn.dataset.id;

      await deleteDoc(doc(db, "users", uid, "shortlist", itemId));

      btn.closest(".col-md-4").remove();
    });
  });
}
