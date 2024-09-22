import {
    db,
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
}
from "./firebase.js";

const studentCollectionRef = collection(db, 'students');  // Firestore collection reference
let currentDocIdToDelete = '';  // Firestore document ID for deletion

// Event listener for adding a student
document.getElementById('addStudentForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    // Validate fields
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const cnic = document.getElementById('cnic').value.trim();

    const errors = [];

    if (!firstName) errors.push("First Name is required.");
    if (!lastName) errors.push("Last Name is required.");
    // if (!validateEmail(email)) errors.push("Invalid Email.");
    if (!password) errors.push("Password is required.");
    if (!cnic) errors.push("CNIC is required.");

    if (errors.length > 0) {
        showError(errors.join(" "), 'danger');
        return;
    }

    const student = {
        firstName,
        lastName,
        email,
        password,
        cnic,
        marks: {}
    };
    
    try {
        // Add student to Firestore and get the document ID
        const docRef = await addDoc(studentCollectionRef, student);
        student.id = docRef.id;  // Store Firestore document ID in the student object

        addStudentToTable(student);
        showAlert('Student added successfully!', 'success');
        this.reset();
    } catch (error) {
        showError('Failed to add student: ' + error.message, 'danger');
    }
});

// Function to add a student to the table
function addStudentToTable(student) {
    const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.innerHTML = `
        <td>${student.cnic}</td>
        <td>${student.firstName} ${student.lastName}</td>
        <td>${student.email}</td>
        <td>
            <button class="btn btn-info btn-sm" onclick="openAddMarksModal('${student.cnic}', '${student.firstName} ${student.lastName}')"><i class="fas fa-plus"></i></button>
            <button class="btn btn-success btn-sm" onclick="viewResult('${student.cnic}')"><i class="fas fa-eye"></i></button>
            <button class="btn btn-warning btn-sm" onclick="openEditProfile('${student.cnic}')"><i class="fas fa-pencil-alt"></i></button>
            <button class="btn btn-danger btn-sm" onclick="confirmDelete('${student.id}')"><i class="fas fa-trash"></i></button>
        </td>
    `;
}

// Confirm deletion of a student
function confirmDelete(docId) {
    currentDocIdToDelete = docId;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

// Delete student from Firestore
document.getElementById('confirmDeleteBtn').addEventListener('click', async function () {
    try {
        if (currentDocIdToDelete) {
            await deleteDoc(doc(db, 'students', currentDocIdToDelete));
            const row = [...document.querySelectorAll('#studentTable tbody tr')].find(tr => tr.cells[0].getAttribute('data-doc-id') === currentDocIdToDelete);
            if (row) row.remove();
            showAlert('Student deleted successfully!', 'success');
        }
    } catch (error) {
        showError('Failed to delete student: ' + error.message, 'danger');
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    modal.hide();
});

// Load students from Firestore on window load
window.onload = async function () {
    try {
        const querySnapshot = await getDocs(studentCollectionRef);
        querySnapshot.forEach((doc) => {
            const student = doc.data();
            student.id = doc.id;  // Store document ID in the student object
            addStudentToTable(student);
        });
    } catch (error) {
        showError('Failed to load students: ' + error.message, 'danger');
    }
};

// Other functions (validateEmail, showError, openAddMarksModal, viewResult, etc.) remain unchanged


// import { db } from './firebase.js'; // Import Firebase services
// import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// Reference to the 'students' collection in Firestore
// const studentsRef = collection(db, 'students');

// Handle Add Student form submission

// document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
//     e.preventDefault(); // Prevent form from refreshing the page
    
//     const firstName = document.getElementById('firstName').value;
//     const lastName = document.getElementById('lastName').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     const cnic = document.getElementById('cnic').value;

//     try {
//         // Add a new document in the 'students' collection
//         await addDoc(studentsRef, {
//             firstName,
//             lastName,
//             email,
//             password,  // For real systems, passwords shouldn't be stored in plain text
//             cnic,
//         });
//         alert('Student added successfully!');
//     } catch (error) {
//         console.error('Error adding student: ', error);
//     }

//     // Optionally reset the form after submission
//     e.target.reset();
// });

// Fetch and display students


// const loadStudents = async () => {
//     const querySnapshot = await getDocs(studentsRef);
//     const tableBody = document.querySelector('#studentTable tbody');
//     tableBody.innerHTML = '';  // Clear table before appending new rows

//     querySnapshot.forEach((doc) => {
//         const student = doc.data();
//         const row = `<tr>
//                         <td>${student.cnic}</td>
//                         <td>${student.firstName} ${student.lastName}</td>
//                         <td>${student.email}</td>
//                         <td>
//                             <button class="btn btn-sm btn-primary" onclick="openAddMarksModal('${doc.id}', '${student.firstName} ${student.lastName}')">Add Marks</button>
//                             <button class="btn btn-sm btn-danger" onclick="openDeleteModal('${doc.id}')">Delete</button>
//                         </td>
//                     </tr>`;
//         tableBody.insertAdjacentHTML('beforeend', row);
//     });
// };

// Call loadStudents to display the list when the page loads
loadStudents();

// Handle Deletion
const openDeleteModal = (studentId) => {
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    confirmDeleteBtn.onclick = async () => {
        await deleteDoc(doc(db, 'students', studentId));
        alert('Student deleted successfully!');
        loadStudents();  // Refresh student list
    };
};

// Add marks functionality
const openAddMarksModal = (studentId, studentName) => {
    document.getElementById('studentNameMarks').innerText = studentName;
    
    // Handle marks submission
    document.getElementById('addMarksForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const htmlMarks = document.getElementById('htmlMarks').value;
        // Add other marks fields as needed
        
        try {
            const studentDoc = doc(db, 'students', studentId);
            await updateDoc(studentDoc, { htmlMarks });  // Update student with marks
            alert('Marks added successfully!');
        } catch (error) {
            console.error('Error updating marks: ', error);
        }

        // Reset form and close modal
        e.target.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addMarksModal'));
        modal.hide();
    });
};
