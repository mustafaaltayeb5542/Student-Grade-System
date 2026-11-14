
const form = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const formMessage = document.getElementById("formMessage");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editingId = null;

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
    document.getElementById("classAverage").textContent =
        average.toFixed(1) + "%";
}

function renderStudents() {
    const search = searchInput.value.toLowerCase().trim();

    const filtered = students.filter(student => {
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

    studentTable.innerHTML = "";

    document.getElementById("emptyMessage").style.display =
        filtered.length ? "none" : "block";

    filtered.forEach(student => {
        const row = document.createElement("tr");

        const values = [
            student.name,
            student.studentId,
            student.math.toFixed(2),
            student.english.toFixed(2),
            student.computer.toFixed(2),
            student.average.toFixed(2) + "%",
            student.grade,
            student.average >= 50 ? "PASS" : "FAIL"
        ];

        values.forEach((value, index) => {
            const cell = document.createElement("td");
            cell.textContent = value;

            if (index === 7) {
                const badge = document.createElement("span");
                badge.className = "status " +
                    (student.average >= 50 ? "pass" : "fail");
                badge.textContent = value;
                cell.textContent = "";
                cell.appendChild(badge);
            }

            row.appendChild(cell);
        });

        const actions = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editStudent(student.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteStudent(student.id));

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        studentTable.appendChild(row);
    });

    updateStatistics();
}

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
        editingId = null;
        form.querySelector("button[type='submit']").textContent = "+ Add Student";
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
    form.querySelector("button[type='submit']").textContent = "Save Changes";
    document.getElementById("add-student").scrollIntoView({ behavior: "smooth" });
}

function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    students = students.filter(s => s.id !== id);

    if (editingId === id) {
        editingId = null;
        form.reset();
        form.querySelector("button[type='submit']").textContent = "+ Add Student";
    }

    saveStudents();
    renderStudents();
    showMessage("Student deleted successfully.");
}

function showMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#b91c1c" : "#15803d";
}

searchInput.addEventListener("input", renderStudents);

renderStudents();
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
        student.average.toFixed(2),
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

document.getElementById("exportBtn")
    .addEventListener("click", exportStudents);
