import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import {
    getDatabase,
    ref,
    set,
    get,
    child,
    update,
    remove,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import {
    setCookie,
    getCookie,
    checkUsernameChange,
    updateUsername,
} from "../../cookie.js";

setInterval(checkUsernameChange, 10 * 60 * 1000); // Check username Change every 10 mins

// Get username from cookie stored in browser
const username = getCookie("username");

//Firebase Setup
const firebaseConfig = {
    apiKey: "AIzaSyANafOMY9kojKKxBa9hwKrXAH6u4uTXhcU",
    authDomain: "wecode-91084.firebaseapp.com",
    databaseURL:
        "https://wecode-91084-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wecode-91084",
    storageBucket: "wecode-91084.appspot.com",
    messagingSenderId: "107117565088",
    appId: "1:107117565088:web:7c3d73d23bf094ecdca5c5",
    measurementId: "G-S8SGHVTC2Z",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();

document.addEventListener("DOMContentLoaded", async () => {
    const projectsContainer = document.getElementById("projects-container");

    if (username) {
        console.log(username);
        try {
            const userProjectsRef = ref(db, `users/${username}`);
            const userProjectsSnapshot = await get(userProjectsRef);
            if (userProjectsSnapshot.exists()) {
                const userProjects = userProjectsSnapshot.val();
                const userProjectsData = userProjects.projects;
                console.log("User Projects Data:", userProjectsData);
                Object.values(userProjectsData).forEach((valuePair) => {
                    console.log(valuePair);
                });
            } else {
                console.log("No projects found for the user");
            }
        } catch (error) {
            console.error("Error fetching user projects:", error);
        }
    } else {
        console.error("No username stored in cookie");
    }
});

export { db };
