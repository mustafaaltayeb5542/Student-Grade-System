# Student Grade Management System

## Project Overview
A modern web-based application for managing student academic records, evaluating performance, and generating student reports.

## Project Purpose
The system helps administrators and educators manage student information, monitor academic performance, and generate academic evaluations.

## Key Features
- **Student Records Management**: Add, edit, cancel edits, and delete student records with instant validation.
- **Academic Performance Calculations**: Automated calculation of subject averages, letter grades (A, B, C, D, F), and Pass/Fail standings.
- **Official Student Report Card**: Interactive modal displaying detailed course progress bars, performance standing, and automated advisor remarks.
- **Print / PDF Export**: One-click print-ready student report cards optimized for paper or PDF export (`Ctrl+P` / `window.print`).
- **Interactive Multi-Column Sorting**: Sort students by Name, ID, Mathematics, English, Computer Science, Average, Grade, or Status (Ascending / Descending).
- **Search & Filter**: Real-time search by student name or student ID, combined with status filtering (Passed / Failed / All).
- **Dark Mode Support**: Seamless toggle between Dark and Light themes with persistent preference storage.
- **Demo Data Generator**: Quick one-click sample records generator for rapid demonstration and testing.
- **Data Export**: Export student records directly to a formatted CSV file.
- **Local Storage Persistence**: All records and preferences are saved locally in the browser.
- **Responsive Design**: Mobile-friendly layout adapting smoothly across all device sizes.

## Technologies
- HTML5
- CSS3 (Custom properties, dark mode, print media stylesheet, flexbox & grid)
- JavaScript (ES6+, DOM manipulation, dynamic sorting, modals, event listeners)
- Browser Local Storage

## How to Run
1. Clone or download the repository.
2. Open the project folder.
3. Open `index.html` in any modern web browser (Google Chrome, Edge, Firefox, Safari).

## Project Structure
- `index.html`: Application structure, modal dialogs, and navigation.
- `style.css`: Application styling, color schemes, dark mode variables, animations, and print media rules.
- `script.js`: Core application logic, calculations, sorting, filtering, report card generator, and storage handlers.
- `README.md`: Project documentation and feature overview.
- `.gitignore`: Git ignored files.

## Git Workflow
This project follows Feature Branch Workflow.
Changes are developed in separate branches, committed, pushed, reviewed through Pull Requests, and merged into the main branch.

## Data Storage
Student records and user preferences are stored locally in the browser using `localStorage`.

## Contributors
- Mustafa Al-Tayeb - ID: 202011236916 
- Ahmed Alfrzdag    - ID: 202021023554

## Future Improvements
- User authentication & role-based permissions (Teacher, Student, Admin).
- Cloud database integration (Firebase / PostgreSQL).
- Custom grading scales and additional dynamic subjects.
