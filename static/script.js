const gradeToPoint = {
    "A+": 4.00,
    "A": 3.75,
    "A-": 3.50,
    "B+": 3.25,
    "B": 3.00,
    "B-": 2.75,
    "C+": 2.50,
    "C": 2.25,
    "D": 2.00,
    "F": 0.00,
};

document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
});

document.getElementById("resultForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const studentId = document.getElementById("studentId").value;
    const semester = document.getElementById("semester").value;
    const year = document.getElementById("year").value;
    const semesterId = `${year.slice(-2)}${semester}`;

    try {
        const response = await fetch("/get_result", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `studentId=${studentId}&semesterId=${semesterId}`,
        });
        const result = await response.json();

        if (result.success) {
            renderResults(result.data);
        } else {
            alert(result.message || "No result found.");
        }
    } catch (error) {
        console.error("Error fetching result:", error);
    }
});

function renderResults(data) {
    const table = document.getElementById("resultTable");
    const sgpa = document.getElementById("sgpaValue");
    const totalCredits = document.getElementById("totalCredits");

    let totalCreditHours = 0;
    let totalPoints = 0;
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Credit</th>
                    <th>Grade</th>
                    <th>Grade Point</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach((course) => {
        const gradePoint = gradeToPoint[course.gradeLetter];
        tableHTML += `
            <tr>
                <td>${course.customCourseId}</td>
                <td>${course.courseTitle}</td>
                <td>${course.totalCredit}</td>
                <td>${course.gradeLetter}</td>
                <td>${gradePoint.toFixed(2)}</td>
            </tr>
        `;
        totalPoints += gradePoint * course.totalCredit;
        totalCreditHours += course.totalCredit;
    });

    tableHTML += "</tbody></table>";
    sgpa.textContent = (totalPoints / totalCreditHours).toFixed(2);
    totalCredits.textContent = totalCreditHours;
    table.innerHTML = tableHTML;
    document.getElementById("resultSection").style.display = "block";
}
