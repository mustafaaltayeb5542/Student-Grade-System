// ==========================================================================
// Student Grade Management System - Core Script
// ==========================================================================

const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const formMessage = document.getElementById("formMessage");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const submitBtn = document.getElementById("submitBtn");
const formHeading = document.getElementById("formHeading");
const formSubheading = document.getElementById("formSubheading");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");
const demoDataBtn = document.getElementById("demoDataBtn");

// Modal Elements
const reportCardModal = document.getElementById("reportCardModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const dismissModalBtn = document.getElementById("dismissModalBtn");
const printReportBtn = document.getElementById("printReportBtn");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;
let currentSort = { field: null, order: "asc" };

// ==========================================================================
// Calculations & Helpers
// ==========================================================================

function calculateAverage(math, english, computer) {
    return (math + english + computer) / 3;
}

function calculateGrade(average) {
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
}

function getAcademicStanding(average) {
    if (average >= 90) return "High Distinction";
    if (average >= 80) return "Distinction";
    if (average >= 70) return "Merit";
    if (average >= 50) return "Pass";
    return "Academic Warning";
}

function getTeacherRemark(average, student) {
    if (average >= 90) {
        return `${student.name} demonstrates exemplary academic excellence, superior problem-solving skills, and deep subject comprehension across all areas. Outstanding achievement!`;
    }
    if (average >= 80) {
        return `${student.name} displays strong academic performance and consistent dedication. With continued focus, top-tier mastery is well within reach.`;
    }
    if (average >= 70) {
        return `${student.name} has demonstrated solid competence and steady engagement in classwork. Targeted review in weaker subjects will yield even higher results.`;
    }
    if (average >= 50) {
        return `${student.name} has satisfied minimum passing requirements. Additional guided practice, tutorials, and structured study habits are strongly advised.`;
    }
    return `${student.name} is currently performing below passing standards. Immediate academic intervention and dedicated subject tutoring are required.`;
}

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function updateStatistics() {
    const total = students.length;
    const passed = students.filter(s => s.average >= 50).length;
    const failed = total - passed;
    const average = total
        ? students.reduce((sum, s) => sum + s.average, 0) / total
        : 0;

    document.getElementById("totalStudents").textContent = total;
    document.getElementById("passedStudents").textContent = passed;
    document.getElementById("failedStudents").textContent = failed;
    document.getElementById("classAverage").textContent = average.toFixed(1) + "%";
}

// ==========================================================================
// Sorting Logic
// ==========================================================================

function handleSort(field) {
    if (currentSort.field === field) {
        currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
    } else {
        currentSort.field = field;
        currentSort.order = "asc";
    }

    updateSortHeaders();
    renderStudents();
}

function updateSortHeaders() {
    document.querySelectorAll("th.sortable").forEach(th => {
        th.classList.remove("sort-asc", "sort-desc");
        if (th.getAttribute("data-sort") === currentSort.field) {
            th.classList.add(currentSort.order === "asc" ? "sort-asc" : "sort-desc");
        }
    });
}

function sortList(list) {
    if (!currentSort.field) return list;

    const { field, order } = currentSort;
    return [...list].sort((a, b) => {
        let valA = a[field];
        let valB = b[field];

        // Handling status sorting
        if (field === "status") {
            valA = a.average >= 50 ? "PASS" : "FAIL";
            valB = b.average >= 50 ? "PASS" : "FAIL";
        }

        if (typeof valA === "string") {
            const comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
            return order === "asc" ? comparison : -comparison;
        }

        return order === "asc" ? valA - valB : valB - valA;
    });
}

// ==========================================================================
// Render Students Table
// ==========================================================================

function renderStudents() {
    const search = searchInput.value.toLowerCase().trim();

    let filtered = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(search) ||
            student.studentId.toLowerCase().includes(search);

        const status = statusFilter.value;
        const matchesStatus =
            status === "all" ||
            (status === "pass" && student.average >= 50) ||
            (status === "fail" && student.average < 50);

        return matchesSearch && matchesStatus;
    });

    filtered = sortList(filtered);

    studentTable.innerHTML = "";
    document.getElementById("emptyMessage").style.display =
        filtered.length ? "none" : "block";

    filtered.forEach(student => {
        const row = document.createElement("tr");

        // 1. Name
        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;
        nameCell.style.fontWeight = "600";
        row.appendChild(nameCell);

        // 2. ID
        const idCell = document.createElement("td");
        idCell.textContent = student.studentId;
        row.appendChild(idCell);

        // 3. Math
        const mathCell = document.createElement("td");
        mathCell.textContent = Number(student.math).toFixed(2);
        row.appendChild(mathCell);

        // 4. English
        const englishCell = document.createElement("td");
        englishCell.textContent = Number(student.english).toFixed(2);
        row.appendChild(englishCell);

        // 5. Computer
        const computerCell = document.createElement("td");
        computerCell.textContent = Number(student.computer).toFixed(2);
        row.appendChild(computerCell);

        // 6. Average
        const avgCell = document.createElement("td");
        avgCell.textContent = Number(student.average).toFixed(2) + "%";
        avgCell.style.fontWeight = "600";
        row.appendChild(avgCell);

        // 7. Grade Badge
        const gradeCell = document.createElement("td");
        const gradeBadge = document.createElement("span");
        gradeBadge.className = `grade-badge grade-${student.grade.toLowerCase()}`;
        gradeBadge.textContent = student.grade;
        gradeCell.appendChild(gradeBadge);
        row.appendChild(gradeCell);

        // 8. Status Badge
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");
        const isPass = student.average >= 50;
        statusBadge.className = `status ${isPass ? "pass" : "fail"}`;
        statusBadge.textContent = isPass ? "PASS" : "FAIL";
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // 9. Actions (View Report Card, Edit, Delete)
        const actionsCell = document.createElement("td");

        const viewButton = document.createElement("button");
        viewButton.textContent = "Report";
        viewButton.className = "view-btn";
        viewButton.title = "View Official Academic Report Card";
        viewButton.addEventListener("click", () => openReportCard(student.id));

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.title = "Edit student details";
        editButton.addEventListener("click", () => editStudent(student.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.title = "Delete student record";
        deleteButton.addEventListener("click", () => deleteStudent(student.id));

        actionsCell.append(viewButton, editButton, deleteButton);
        row.appendChild(actionsCell);

        studentTable.appendChild(row);
    });

    updateStatistics();
}

// ==========================================================================
// Form Submission & Editing
// ==========================================================================

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const studentId = document.getElementById("studentId").value.trim();

    const math = Number(document.getElementById("math").value);
    const english = Number(document.getElementById("english").value);
    const computer = Number(document.getElementById("computer").value);

    if (!name || !studentId) {
        showMessage("Please enter student information.", true);
        return;
    }

    if (![math, english, computer].every(
        grade => Number.isFinite(grade) && grade >= 0 && grade <= 100
    )) {
        showMessage("Grades must be between 0 and 100.", true);
        return;
    }

    const duplicate = students.some(student =>
        student.studentId.toLowerCase() === studentId.toLowerCase() &&
        student.id !== editingId
    );

    if (duplicate) {
        showMessage("This student ID already exists.", true);
        return;
    }

    const average = calculateAverage(math, english, computer);

    const student = {
        id: editingId || Date.now().toString(),
        name,
        studentId,
        math,
        english,
        computer,
        average,
        grade: calculateGrade(average)
    };

    if (editingId) {
        students = students.map(s => s.id === editingId ? student : s);
        resetEditMode();
        showMessage("Student updated successfully.");
    } else {
        students.push(student);
        showMessage("Student added successfully.");
    }

    saveStudents();
    form.reset();
    renderStudents();
});

function editStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    document.getElementById("studentName").value = student.name;
    document.getElementById("studentId").value = student.studentId;
    document.getElementById("math").value = student.math;
    document.getElementById("english").value = student.english;
    document.getElementById("computer").value = student.computer;

    editingId = id;
    submitBtn.textContent = "Save Changes";
    cancelEditBtn.style.display = "inline-block";
    formHeading.textContent = "Edit Student Record";
    formSubheading.textContent = `Updating records for: ${student.name} (${student.studentId})`;

    document.getElementById("add-student").scrollIntoView({ behavior: "smooth" });
}

function resetEditMode() {
    editingId = null;
    form.reset();
    submitBtn.textContent = "+ Add Student";
    cancelEditBtn.style.display = "none";
    formHeading.textContent = "Add New Student";
    formSubheading.textContent = "Enter student information and subject grades";
}

cancelEditBtn.addEventListener("click", () => {
    resetEditMode();
    showMessage("Editing cancelled.");
});

function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student record?")) return;

    students = students.filter(s => s.id !== id);

    if (editingId === id) {
        resetEditMode();
    }

    saveStudents();
    renderStudents();
    showMessage("Student deleted successfully.");
}

function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#b91c1c" : "#15803d";
}

// ==========================================================================
// Report Card Modal Feature (View & Print)
// ==========================================================================

function openReportCard(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;

    const isPass = student.average >= 50;

    document.getElementById("modalStudentName").textContent = student.name;
    document.getElementById("modalStudentId").textContent = student.studentId;

    const modalStatusBadge = document.getElementById("modalStatusBadge");
    modalStatusBadge.textContent = isPass ? "PASSED" : "FAILED";
    modalStatusBadge.className = `status ${isPass ? "pass" : "fail"}`;

    document.getElementById("modalAverage").textContent = Number(student.average).toFixed(2) + "%";
    document.getElementById("modalGrade").textContent = student.grade;
    document.getElementById("modalStanding").textContent = getAcademicStanding(student.average);

    document.getElementById("modalMathScore").textContent = `${Number(student.math).toFixed(1)} / 100`;
    document.getElementById("modalEnglishScore").textContent = `${Number(student.english).toFixed(1)} / 100`;
    document.getElementById("modalComputerScore").textContent = `${Number(student.computer).toFixed(1)} / 100`;

    document.getElementById("modalMathBar").style.width = `${Math.min(100, Math.max(0, student.math))}%`;
    document.getElementById("modalEnglishBar").style.width = `${Math.min(100, Math.max(0, student.english))}%`;
    document.getElementById("modalComputerBar").style.width = `${Math.min(100, Math.max(0, student.computer))}%`;

    document.getElementById("modalRemark").textContent = getTeacherRemark(student.average, student);

    reportCardModal.style.display = "flex";
}

function closeReportCard() {
    reportCardModal.style.display = "none";
}

closeModalBtn.addEventListener("click", closeReportCard);
dismissModalBtn.addEventListener("click", closeReportCard);

reportCardModal.addEventListener("click", event => {
    if (event.target === reportCardModal) {
        closeReportCard();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && reportCardModal.style.display === "flex") {
        closeReportCard();
    }
});

printReportBtn.addEventListener("click", () => {
    window.print();
});

// ==========================================================================
// Dark / Light Theme Mode
// ==========================================================================

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sgms_theme", theme);

    if (theme === "dark") {
        themeIcon.textContent = "☀️";
        themeText.textContent = "Light Mode";
    } else {
        themeIcon.textContent = "🌙";
        themeText.textContent = "Dark Mode";
    }
}

const savedTheme = localStorage.getItem("sgms_theme") || "light";
setTheme(savedTheme);

themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
});

// ==========================================================================
// Demo Data Generator
// ==========================================================================

demoDataBtn.addEventListener("click", () => {
    if (students.length > 0) {
        const confirmReplace = confirm(
            "Do you want to append sample students to your current list?\n(Click Cancel to abort)"
        );
        if (!confirmReplace) return;
    }

    const demoStudents = [
        { name: "Sophia Martinez", studentId: "STU-1001", math: 95.0, english: 92.5, computer: 98.0 },
        { name: "Liam Chen", studentId: "STU-1002", math: 86.0, english: 84.0, computer: 89.5 },
        { name: "Amara Okafor", studentId: "STU-1003", math: 74.0, english: 78.5, computer: 71.0 },
        { name: "Noah Williams", studentId: "STU-1004", math: 62.0, english: 67.0, computer: 64.0 },
        { name: "Elena Rostova", studentId: "STU-1005", math: 44.0, english: 52.0, computer: 48.0 }
    ].map(s => {
        const average = calculateAverage(s.math, s.english, s.computer);
        return {
            id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
            name: s.name,
            studentId: s.studentId,
            math: s.math,
            english: s.english,
            computer: s.computer,
            average,
            grade: calculateGrade(average)
        };
    });

    students.push(...demoStudents);
    saveStudents();
    renderStudents();
    showMessage("Sample student records added successfully!");
});

// ==========================================================================
// Table Sorting Event Listeners
// ==========================================================================

document.querySelectorAll("th.sortable").forEach(th => {
    th.addEventListener("click", () => {
        const field = th.getAttribute("data-sort");
        handleSort(field);
    });
});

// ==========================================================================
// Search, Filter & CSV Export
// ==========================================================================

searchInput.addEventListener("input", renderStudents);
statusFilter.addEventListener("change", renderStudents);

function exportStudents() {
    if (students.length === 0) {
        alert("There are no student records to export.");
        return;
    }

    const headers = [
        "Name", "Student ID", "Math",
        "English", "Computer", "Average",
        "Grade", "Status"
    ];

    const rows = students.map(student => [
        student.name,
        student.studentId,
        student.math,
        student.english,
        student.computer,
        Number(student.average).toFixed(2),
        student.grade,
        student.average >= 50 ? "PASS" : "FAIL"
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(value =>
            `"${String(value).replace(/"/g, '""')}"`
        ).join(","))
        .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-records.csv";
    link.click();

    URL.revokeObjectURL(url);
}

document.getElementById("exportBtn").addEventListener("click", exportStudents);

// Initial Render
renderStudents();
