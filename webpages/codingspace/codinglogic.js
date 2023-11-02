import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import {
    getDatabase,
    ref,
    set,
    child,
    update,
    remove,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { get } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// Import the getCookie function from the "cookie.js" module
import { getCookie } from "./cookie.js";

// Function to get a cookie
function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim().split("=");
        if (cookie[0] === name) {
            return cookie[1];
        }
    }
    return null;
}

// Access the 'username' cookie set in "currentProjects.js"
const username = getCookie("username");

if (username) {
    // Use the stored username
    console.log("Username from codinglogic.js:", username);

    // You can perform actions or logic based on the stored username
} else {
    // Handle the case where the cookie isn't set
    console.log("No username stored in the cookie");
}

// Continue with the rest of your code

const editor = ace.edit("editor");
editor.setTheme("ace/theme/cobalt");
editor.getSession().setMode("ace/mode/javascript");

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

const codeRef = ref(db, "code");

document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const codingSpace = document.getElementById("codingSpace");
    const roomName = window.location.pathname.slice(1);
    let editorChangeInProgress = false;

    socket.emit("joinRoom", roomName);

    // Initialize ACE Editor
    const editor = ace.edit("editor");
    editor.setTheme("ace/theme/cobalt");
    editor.getSession().setMode("ace/mode/javascript");

    const codeRef = ref(db, "code");

    const fetchAndDisplayInitialData = async () => {
        try {
            const dataSnapshot = await get(child(codeRef, roomName));
            if (dataSnapshot.exists()) {
                const initialCode = dataSnapshot.val();
                codingSpace.value = initialCode;
                editor.setValue(initialCode, 1);
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };
    fetchAndDisplayInitialData();

    const updateCode = (newCode) => {
        editorChangeInProgress = true;

        // Get the current cursor position
        const cursorPosition = editor.getCursorPosition();

        codingSpace.value = newCode;
        editor.setValue(newCode, -1);

        // Restore the cursor position
        editor.moveCursorToPosition(cursorPosition);

        editorChangeInProgress = false;
    };

    const onEditorChange = (event) => {
        if (!editorChangeInProgress) {
            const newCode = editor.getValue();
            updateCode(newCode);
            socket.emit("codeChange", { roomName, newCode });
            update(codeRef, { [roomName]: newCode });
        }
    };

    editor.getSession().on("change", onEditorChange);

    socket.on("codeChange", (newCode) => {
        if (!editorChangeInProgress) {
            updateCode(newCode);
        }
    });

    codingSpace.addEventListener("input", () => {
        const newCode = codingSpace.value;
        socket.emit("codeChange", { roomName, newCode });
        update(codeRef, { [roomName]: newCode });
    });

    const runButton = document.getElementById("runButton");
    const outputDiv = document.getElementById("output");

    runButton.addEventListener("click", () => {
        const codeToRun = editor.getValue();

        try {
            // Use eval to evaluate the code
            eval(codeToRun);

            // Search for console.log statements in the code and extract their outputs
            const consoleOutput = captureConsoleOutput(codeToRun);

            // Display the result in the output div
            if (consoleOutput) {
                outputDiv.innerHTML = `Result: ${consoleOutput}`;
            } else {
                outputDiv.innerHTML = "";
            }
        } catch (error) {
            // Display errors in the output div
            outputDiv.innerHTML = `Error: ${error}`;
        }
    });

    // Function to capture console.log statements
    function captureConsoleOutput(code) {
        const consoleLogMessages = [];
        const originalConsoleLog = console.log;

        // Override console.log to capture messages
        console.log = function (...args) {
            consoleLogMessages.push(
                args.map((arg) => JSON.stringify(arg)).join(" ")
            );
        };

        // Execute the code
        try {
            eval(code);
        } catch (error) {
            // Handle errors in the code
            console.log(`Error: ${error}`);
        } finally {
            // Restore the original console.log
            console.log = originalConsoleLog;
        }

        // Return the captured console output
        return consoleLogMessages.join("\n");
    }
});
