import { getAuth, signInWithEmailAndPassword } from "./firebase.js";

const auth = getAuth();  // Initialize Firebase authentication

// Add event listener for login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
  
  // Get the values from the input fields
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  // Sign in using Firebase Authentication
  signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Redirect to index.html on successful login
      // window.location.href = 'index.html';
    })
    .catch((error) => {
      // Show error message if authentication fails
      document.getElementById('loginError').classList.remove('d-none');
    });
});

// Hide the error message when the user starts typing
document.getElementById('loginUsername').addEventListener('input', hideError);
document.getElementById('loginPassword').addEventListener('input', hideError);

function hideError() {
  document.getElementById('loginError').classList.add('d-none');
}
const defaultUsername = 'admin';
const defaultPassword = 'admin123';

// Add event listener for login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission
  
  // Get the values from the input fields
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  // Check if the entered username and password match the default credentials
  if (username === defaultUsername && password === defaultPassword) {
    // Redirect to index.html page on successful login
    window.location.href = 'index.html';
  } else {
    // Show error message if credentials are incorrect
    document.getElementById('loginError').classList.remove('d-none');
  }
});


// const log = document.getElementById("loginUsername")
// const pass = document.getElementById("loginPassword")

// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// const auth = getAuth();
// createUserWithEmailAndPassword(auth, log.value, pass.value)
//   .then((userCredential) => {
//     // Signed up 
//     const user = userCredential.user;
//     // ...
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // ..
//   });