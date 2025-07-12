import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtI4hKyZHEm5RrfrN50b1U7a0QcMy7zgk",
  authDomain: "ibiscus-dashboard.firebaseapp.com",
  projectId: "ibiscus-dashboard",
  storageBucket: "ibiscus-dashboard.appspot.com",
  messagingSenderId: "627165396165",
  appId: "1:627165396165:web:b873652110014e218904ac",
  databaseURL: "https://ibiscus-dashboard-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const umbrellas = [
  ...Array.from({ length: 25 }, (_, i) => `P${i + 1}`),
  ...Array.from({ length: 20 }, (_, i) => `PL${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `B10${i + 1}`)
];

const statuses = [
  { id: "ok", label: "✅ Όλα OK", class: "ok", color: "#4caf50" },
  { id: "cleaning", label: "🧼 Καθάρισμα", class: "cleaning", color: "#9e9e9e" },
  { id: "trash", label: "🧃 Ποτήρια / Σκουπίδια", class: "trash", color: "#fdd835" },
  { id: "damage", label: "🪑 Ζημιά", class: "damage", color: "#f44336" }
];

let selectedUser = "";
document.getElementById("userSelect").addEventListener("change", (e) => {
  selectedUser = e.target.value;
  renderGrid();
});

function renderGrid() {
  const container = document.getElementById("grid");
  container.innerHTML = "";
  if (!selectedUser) return;

  umbrellas.forEach((id) => {
    const card = document.createElement("div");
    card.className = "umbrella";
    card.setAttribute("id", `card-${id}`);
    card.innerHTML = `<h3>${id}</h3><div class="current-status" id="status-${id}">Καμία ενημέρωση</div>`;

    statuses.forEach((status) => {
      const btn = document.createElement("button");
      btn.textContent = status.label;
      btn.className = `status-btn ${status.class}`;
      btn.onclick = () => {
        set(ref(db, `umbrellas/${id}`), {
          status: status.id,
          updatedBy: selectedUser
        });
      };
      card.appendChild(btn);
    });

    container.appendChild(card);

    // Live ενημέρωση εμφάνισης
    onValue(ref(db, `umb
