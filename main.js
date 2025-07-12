// Firebase σύνδεση
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

// Ομπρέλες
const umbrellas = [
  ...Array.from({ length: 25 }, (_, i) => `P${i + 1}`),
  ...Array.from({ length: 20 }, (_, i) => `PL${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `B10${i + 1}`)
];

// Καταστάσεις με emoji και χρώματα
const statuses = [
  { id: "ok", label: "✅ Όλα OK", class: "ok" },
  { id: "cleaning", label: "🧼 Καθάρισμα", class: "cleaning" },
  { id: "trash", label: "🧃 Ποτήρια / Σκουπίδια", class: "trash" },
  { id: "damage", label: "🪑 Ζημιά", class: "damage" }
];

// Επιλογή χρήστη
let selectedUser = "";
document.getElementById("userSelect").addEventListener("change", (e) => {
  selectedUser = e.target.value;
  renderGrid();
});

// Δημιουργία καρτών
function renderGrid() {
  const container = document.getElementById("grid");
  container.innerHTML = "";
  if (!selectedUser) return;

  umbrellas.forEach((id) => {
    const card = document.createElement("div");
    card.className = "umbrella";
    card.innerHTML = `<h3>${id}</h3>`;

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
  });
}

// Ζωντανή ενημέρωση
onValue(ref(db, "umbrellas"), (snapshot) => {
  const data = snapshot.val();
  document.querySelectorAll(".umbrella").forEach((card) => {
    const id = card.querySelector("h3").textContent;
    const umbrella = data?.[id];
    if (umbrella) {
      card.querySelectorAll(".status-btn").forEach((btn) => {
        if (btn.textContent.includes("OK")) btn.style.opacity = "0.4";
        if (btn.textContent.includes("Καθάρισμα")) btn.style.opacity = "0.4";
        if (btn.textContent.includes("Ποτήρια")) btn.style.opacity = "0.4";
        if (btn.textContent.includes("Ζημιά")) btn.style.opacity = "0.4";

        if (btn.textContent.includes(statusLabel(umbrella.status))) {
          btn.style.opacity = "1";
        }
      });
    }
  });
});

function statusLabel(id) {
  return statuses.find((s) => s.id === id)?.label.split(" ")[1];
}
