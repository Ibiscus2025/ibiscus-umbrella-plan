import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDtI4hKyZHEm5RrfrN50b1U7a0QcMy7zgk",
  authDomain: "ibiscus-dashboard.firebaseapp.com",
  databaseURL: "https://ibiscus-dashboard-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ibiscus-dashboard",
  storageBucket: "ibiscus-dashboard.appspot.com",
  messagingSenderId: "627165396165",
  appId: "1:627165396165:web:b873652110014e218904ac"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Όλα τα ονόματα
const names = ["Αναστασία", "Άντζελα", "Λευτέρης"];
const umbrellas = [
  ...Array.from({ length: 25 }, (_, i) => `P${i + 1}`),
  ...Array.from({ length: 20 }, (_, i) => `PL${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `B10${i + 1}`)
];

// Καταστάσεις και emoji
const statuses = [
  { label: "✅ Όλα ΟΚ", value: "ok", color: "#4CAF50" },
  { label: "🧼 Καθάρισμα", value: "clean", color: "#9E9E9E" },
  { label: "🧃 Ποτήρια / Σκουπίδια", value: "trash", color: "#FFEB3B" },
  { label: "🪑 Ζημιά", value: "broken", color: "#F44336" }
];

// App state
let currentUser = null;

// Setup UI
document.body.innerHTML = `
  <h1 style="text-align:center;">Κατάσταση Ομπρελών <br>⛱️</h1>
  <div style="text-align:center; margin-bottom: 20px;">
    <label>👤 Ποιος είσαι;
      <select id="userSelect">
        <option value="">Επέλεξε όνομα</option>
        ${names.map(n => `<option value="${n}">${n}</option>`).join("")}
      </select>
    </label>
  </div>
  <div id="grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; padding: 10px;"></div>
`;

document.getElementById("userSelect").addEventListener("change", e => {
  currentUser = e.target.value;
  renderGrid();
});

// Render κουμπιά ομπρελών
function renderGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  umbrellas.forEach(id => {
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.borderRadius = "12px";
    div.style.textAlign = "center";
    div.style.background = "#f9f9f9";
    div.style.boxShadow = "2px 2px 6px rgba(0,0,0,0.1)";
    div.innerHTML = `<strong>${id}</strong><br>`;

    statuses.forEach(status => {
      const btn = document.createElement("button");
      btn.innerText = status.label;
      btn.style.background = status.color;
      btn.style.color = "#fff";
      btn.style.border = "none";
      btn.style.margin = "4px";
      btn.style.padding = "5px";
      btn.style.borderRadius = "6px";
      btn.style.fontSize = "12px";
      btn.onclick = () => {
        if (!currentUser) return alert("Επέλεξε όνομα!");
        set(ref(db, `umbrellas/${id}`), {
          by: currentUser,
          status: status.value
        });
      };
      div.appendChild(btn);
    });

    const statusDiv = document.createElement("div");
    statusDiv.id = `status-${id}`;
    statusDiv.style.marginTop = "5px";
    statusDiv.style.fontSize = "12px";
    div.appendChild(statusDiv);

    grid.appendChild(div);
  });
}

// Live ενημέρωση
onValue(ref(db, "umbrellas"), snapshot => {
  const data = snapshot.val() || {};
  Object.keys(data).forEach(id => {
    const info = data[id];
    const el = document.getElementById(`status-${id}`);
    const s = statuses.find(s => s.value === info.status);
    if (el && s) {
      el.innerHTML = `🕒 Τελευταίο: <strong>${s.label}</strong><br>👤 ${info.by}`;
    }
  });
});
