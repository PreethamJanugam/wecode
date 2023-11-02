// Import the setCookie and getCookie functions from the "cookie.js" module
import {
    setCookie,
    getCookie,
    checkUsernameChange,
    updateUsername,
} from "./cookie.js";
// Function to update the username and the corresponding cookie

setInterval(checkUsernameChange, 1 * 5 * 1000); // Check every 5 seconds

// Check if the username is already stored in a cookie
const storedUsername = getCookie("username");

if (storedUsername) {
    // Use the stored username
    console.log(storedUsername);
} else {
    // Handle the case where the cookie isn't set
}
