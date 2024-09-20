let currentCnicToDelete = '';

// Event listener for adding a student
document.getElementById('addStudentForm').addEventListener('submit', function (e) {
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
    if (!validateEmail(email)) errors.push("Invalid Email.");
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
    localStorage.setItem('student_' + student.cnic, JSON.stringify(student));
    addStudentToTable(student);
    this.reset();
});

// Function to validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Function to show error messages
function showError(message, type) {
    const alertPlaceholder = document.createElement('div');
    alertPlaceholder.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.body.insertBefore(alertPlaceholder, document.body.firstChild);
    
    setTimeout(() => {
        alertPlaceholder.remove();
    }, 2000); // Show error for 2 seconds
}

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
            <button class="btn btn-danger btn-sm" onclick="confirmDelete('${student.cnic}')"><i class="fas fa-trash"></i></button>
        </td>
    `;
}

// Confirm deletion of a student
function confirmDelete(cnic) {
    currentCnicToDelete = cnic;
    const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    modal.show();
}

// Delete student and update localStorage
document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    localStorage.removeItem('student_' + currentCnicToDelete);
    const row = [...document.querySelectorAll('#studentTable tbody tr')].find(tr => tr.cells[0].textContent === currentCnicToDelete);
    if (row) row.remove();
    showAlert('Student deleted successfully!', 'success');
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
    modal.hide();
});

// Function to open the add marks modal
function openAddMarksModal(cnic, name) {
    document.getElementById('studentNameMarks').innerText = name;
    const student = JSON.parse(localStorage.getItem('student_' + cnic));
    document.getElementById('addMarksForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addMarksModal'));
    modal.show();

    document.getElementById('addMarksForm').onsubmit = function (e) {
        e.preventDefault();
        for (const subject of ['html', 'css', 'js', 'advJs', 'react', 'typescript', 'nextJs', 'firebase', 'nestJs']) {
            const marks = document.getElementById(subject + 'Marks').value;
            if (marks) {
                student.marks[subject] = parseInt(marks, 10);
            }
        }
        localStorage.setItem('student_' + cnic, JSON.stringify(student));
        showAlert('Marks added successfully!', 'success');
        modal.hide();
    };
}

// Function to view student results
function viewResult(cnic) {
    const student = JSON.parse(localStorage.getItem('student_' + cnic));
    let totalMarks = 0;
    let obtainedMarks = 0;
    let resultHtml = `<h4>${student.firstName} ${student.lastName}</h4><br>CNIC: ${student.cnic}<br><strong>Marks:</strong><br>`;
    for (const [subject, marks] of Object.entries(student.marks)) {
        resultHtml += `${subject.charAt(0).toUpperCase() + subject.slice(1)}: ${marks}<br>`;
        obtainedMarks += marks;
        totalMarks += 100;
    }
    const percentage = (obtainedMarks / totalMarks) * 100;
    const grade = getGrade(percentage);
    resultHtml += `<br><strong>Total Marks: ${obtainedMarks}/${totalMarks}</strong><br>`;
    resultHtml += `<strong>Percentage: ${percentage.toFixed(2)}%</strong><br>`;
    resultHtml += `<strong>Grade: ${grade}</strong><br>`;
    
    document.getElementById('resultContent').innerHTML = resultHtml;
    const modal = new bootstrap.Modal(document.getElementById('viewResultModal'));
    modal.show();
}

// Function to get grade based on percentage
function getGrade(percentage) {
    if (percentage >= 75) return 'A';
    if (percentage >= 50) return 'B';
    if (percentage >= 40) return 'C';
    return 'F';
}

// Function to show alert messages
function showAlert(message, type) {
    const alertPlaceholder = document.createElement('div');
    alertPlaceholder.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.body.insertBefore(alertPlaceholder, document.body.firstChild);
    setTimeout(() => {
        alertPlaceholder.remove();
    }, 3000);
}

// Load students from localStorage on window load
window.onload = function () {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('student_')) {
            const student = JSON.parse(localStorage.getItem(key));
            addStudentToTable(student);
        }
    }
};