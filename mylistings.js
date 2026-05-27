// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDsmzCtW5ADthBJv_PNdz_trDb8BSn8WL0",
    authDomain: "campus-marketplace-70b95.firebaseapp.com",
    projectId: "campus-marketplace-70b95",
    storageBucket: "campus-marketplace-70b95.firebasestorage.app",
    messagingSenderId: "1017814633308",
    appId: "1:1017814633308:web:25463e96717e7e024fcf99"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// HTML elements
const listingsContainer = document.getElementById("listingsContainer");

const emptyMessage = document.getElementById("emptyMessage");

const signOutBtn = document.getElementById("signOutBtn");


// Authentication check
onAuthStateChanged(auth, async (user) => {

    // Redirect if not signed in
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Load listings
    loadMyListings(user);
});


// Load current user's items
async function loadMyListings(user) {

    listingsContainer.innerHTML = "";

    try {

        // Reference to items collection
        const itemsRef = collection(db, "items");

        // Query only current user's listings
        const q = query(
            itemsRef,
            where("sellerId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);

        // No items
        if (querySnapshot.empty) {
            emptyMessage.textContent =
                "You have not listed any items yet.";
            return;
        }

        // Display items
        querySnapshot.forEach((doc) => {

            const item = doc.data();

            // Price display
            const price =
                item.trade === true
                    ? "Trade"
                    : `$${item.price}`;

            // Card
            const card = document.createElement("div");

            card.className = "col-md-4 mb-4";

            card.innerHTML = `
                <div class="card h-100">

                    <img 
                        src="${item.image}" 
                        class="card-img-top"
                        alt="${item.name}"
                        style="height:250px; object-fit:cover;"
                    >

                    <div class="card-body">

                        <h5 class="card-title">
                            ${item.name}
                        </h5>

                        <p class="card-text">
                            ${item.description}
                        </p>

                        <p>
                            <strong>Price:</strong>
                            ${price}
                        </p>

                        <p>
                            <strong>Category:</strong>
                            ${item.category}
                        </p>

                        <p>
                            <strong>Seller:</strong>
                            ${user.email}
                        </p>

                    </div>
                </div>
            `;

            listingsContainer.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        emptyMessage.textContent =
            "Failed to load listings.";
    }
}


// Sign out
signOutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error("Sign out error:", error);
    }
});