
const umbrellas = [
    "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10",
    "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20", "P21", "P22", "P23", "P24", "P25",
    "PL1", "PL2", "PL3", "PL4", "PL5", "PL6", "PL7", "PL8", "PL9", "PL10",
    "PL11", "PL12", "PL13", "PL14", "PL15", "PL16", "PL17", "PL18", "PL19", "PL20",
    "B101", "B102", "B103", "B104", "B105", "B106", "B107", "B108"
];

const grid = document.getElementById("grid");

umbrellas.forEach(name => {
    const div = document.createElement("div");
    div.className = "umbrella";
    div.textContent = `⛱️ ${name}`;
    div.addEventListener("click", () => {
        if (div.classList.contains("empty")) {
            div.className = "umbrella needs-clear";
            div.textContent = `🍹 ${name}`;
        } else if (div.classList.contains("needs-clear")) {
            div.className = "umbrella cleaning";
            div.textContent = `🧼 ${name}`;
        } else {
            div.className = "umbrella empty";
            div.textContent = `✅ ${name}`;
        }
    });
    grid.appendChild(div);
});
