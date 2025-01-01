const firebaseConfig = {
    apiKey: "AIzaSyCk1NcBE5KSeyectLQeJevRTNkbGBe2mRQ",
    authDomain: "tales-of-the-day.firebaseapp.com",
    projectId: "tales-of-the-day",
    storageBucket: "tales-of-the-day.firebasestorage.app",
    messagingSenderId: "481240876452",
    appId: "1:481240876452:web:39ad09a78e15a5846ced31"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sign Up Function
function signUp() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('full').value;

    // Input validation
    if (!email || !password || !fullName) {
        showToast("Please fill in all the fields", "error");
        return;
    }

    // Create user with email and password
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showToast("Sign Up successful!", "success");

            const user = userCredential.user; // Get the user info (UID)

            // Store additional user information in Firestore
            db.collection("users").doc(user.uid).set({
                fullName: fullName,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                window.location.href = "home.html"; // Redirect to home page
            })
            .catch((error) => {
                showToast("Error saving user data: " + error.message, "error"); // Handle Firestore error
            });
        })
        .catch((error) => {
            showToast(error.message, "error"); // Show Firebase authentication error
        });
}

// Sign In Function
function signIn() {
    const email = document.getElementById('l-email').value;
    const password = document.getElementById('l-password').value;

    // Input validation
    if (!email || !password) {
        showToast("Please fill in both email and password", "error");
        return;
    }

    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showToast("Login successful!", "success");
            window.location.href = "home.html"; // Redirect to home page after login
        })
        .catch((error) => {
            showToast(error.message, "error"); // Show authentication error
        });
}

// Show Toast Notifications
function showToast(message, type = "error") {
    const toast = document.getElementById("toast");

    // Set the message and styling based on type
    toast.textContent = message;
    toast.classList.remove("hidden", "bg-green-500", "bg-red-500");
    toast.classList.add(type === "success" ? "bg-green-500" : "bg-red-500");

    // Show toast and auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

// Optional: Automatically redirect to login page if user is not authenticated
// auth.onAuthStateChanged(user => {
//     if (!user) {
//         window.location.href = "login.html"; // Redirect to login page if not authenticated
//     }
// });

