const firebaseConfig = {
    apiKey: "AIzaSyCk1NcBE5KSeyectLQeJevRTNkbGBe2mRQ",
    authDomain: "tales-of-the-day.firebaseapp.com",
    projectId: "tales-of-the-day",
    storageBucket: "tales-of-the-day.firebasestorage.app",
    messagingSenderId: "481240876452",
    appId: "1:481240876452:web:39ad09a78e15a5846ced31",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Listen for user authentication
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html"; // Redirect to login if not authenticated
    } else {
        loadTales(dayjs()); // Load the tales for the current date when the user is logged in
    }
});

// Handle submitting the daily tale
document
    .getElementById("dailyTaleForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const taleContent = document.getElementById("taleContent").value;
        if (!taleContent) {
            showToast("Please write something before posting!", "error");
            return;
        }

        const user = auth.currentUser;
        db.collection("tales")
            .add({
                userId: user.uid,  // Add the userId field to each tale
                taleContent: taleContent,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                showToast("Tale posted successfully!", "success");
                document.getElementById("taleContent").value = ""; // Clear the form after posting
                loadTales(dayjs()); // Reload the posted tales for the current date
            })
            .catch((error) => {
                showToast("Error posting tale: " + error.message, "error");
            });
    });

// Function to load and display posted tales for the selected date
function loadTales(selectedDate) {
    const user = auth.currentUser;
    const startOfDay = selectedDate.startOf("day").toDate(); // Start of the selected date
    const endOfDay = selectedDate.endOf("day").toDate(); // End of the selected date

    db.collection("tales")
        .where("userId", "==", user.uid)
        .where("createdAt", ">=", startOfDay)
        .where("createdAt", "<=", endOfDay)
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
            const talesContainer = document.getElementById("talesContainer");
            talesContainer.innerHTML = ''; // Clear existing tales
            querySnapshot.forEach((doc) => {
                const postData = doc.data();
                const postElement = document.createElement("div");
                postElement.classList.add("post");
                postElement.innerHTML = `
                    <p><strong>${postData.taleContent}</strong></p>
                    <p>Posted on: ${postData.createdAt.toDate().toLocaleString()}</p>
                `;
                talesContainer.appendChild(postElement);
            });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
}

// Function to show toast notifications
function showToast(message, type = "error") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden", "bg-green-500", "bg-red-500");
    toast.classList.add(type === "success" ? "bg-green-500" : "bg-red-500");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

// Calendar and date filtering
const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
let currentDate = dayjs();

// Render the calendar for the given date
function renderCalendar(date) {
    const firstDayOfMonth = date.startOf("month");
    const lastDayOfMonth = date.endOf("month");
    const firstDayWeekday = firstDayOfMonth.day();
    const lastDay = lastDayOfMonth.date();

    const monthNameElement = document.getElementById("monthName");
    const calendarDaysElement = document.getElementById("calendarDays");
    calendarDaysElement.innerHTML = "";

    monthNameElement.innerHTML = `${monthNames[date.month()]} ${date.year()}`;

    // Render empty spaces before the first day
    for (let i = 0; i < firstDayWeekday; i++) {
        calendarDaysElement.innerHTML += `<div class="py-4 bg-white border border-gray-300 rounded-lg"></div>`;
    }

    // Render the actual days
    for (let day = 1; day <= lastDay; day++) {
        const dayClass =
            day === dayjs().date() && date.month() === dayjs().month()
                ? "bg-blue-200"
                : ""; // Highlight current date
        calendarDaysElement.innerHTML += `
            <div class="relative py-4 px-2 bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-blue-200 cursor-pointer transform hover:scale-105 transition duration-300 calendar-day" 
                 data-date="${date.year()}-${(date.month() + 1)
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")}">
                <span class="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center font-bold text-lg text-gray-700">${day}</span>
            </div>`;
    }

    // Add event listener to each day
    document.querySelectorAll('.calendar-day').forEach(dayElement => {
        dayElement.addEventListener("click", function () {
            const selectedDate = dayjs(this.dataset.date); // Get the selected day
            loadTales(selectedDate); // Load tales for that specific date
        });
    });
}

// Navigation buttons for the calendar
document.getElementById("prevMonth").addEventListener("click", function () {
    currentDate = currentDate.subtract(1, "month");
    renderCalendar(currentDate);
});

document.getElementById("nextMonth").addEventListener("click", function () {
    currentDate = currentDate.add(1, "month");
    renderCalendar(currentDate);
});

// Initial render
renderCalendar(currentDate);



document.getElementById('logoutBtn').addEventListener('click', function() {
    firebase.auth().signOut().then(function() {
        window.location.href = 'login.html'; // Redirect to login page after logout
    }).catch(function(error) {
        console.error('Error logging out: ', error);
    });
});