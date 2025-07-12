// Firebase σύνδεση
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
const umbrellaNames = [
  ...Array.from({ length: 25 }, (_, i) => `P${i + 1}`),
  ...Array.from({ length: 20 }, (_, i) => `PL${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `B10${i + 1}`)
];

const statuses = {
  ok: { color: "green", label: "✅ Όλα ΟΚ" },
  clean: { color: "gray", label: "🧼 Θέλει καθάρισμα" },
  trash: { color: "goldenrod", label: "🍸 Μαζέψτε ποτήρια/σκουπίδια" },
  damage: { color: "red", label: "🪑 Ζημιά στον εξοπλισμό" }
};

// Προβολή
const root = document.getElementById("root");
root.style.fontFamily = "sans-serif";
root.style.padding = "20px";
root.innerHTML = "<h2>☂️ Ibiscus Umbrella Dashboard</h2>";

// Χρήστης
let waiter = prompt("Ποιος είσαι; (Άντζελα, Λευτέρης, Αναστασία)").trim();

// Απόδοση κουμπιών και κατάστασης
umbrellaNames.forEach((name) => {
  const div = document.createElement("div");
  div.style.border = "1px solid #ccc";
  div.style.borderRadius = "12px";
  div.style.padding = "10px";
  div.style.margin = "10px 0";
  div.style.backgroundColor = "#f9f9f9";

  const title = document.createElement("h3");
  title.textContent = `☂️ Ομπρέλα ${name}`;
  div.appendChild(title);

  const statusDiv = document.createElement("div");
  statusDiv.style.marginBottom = "8px";
  div.appendChild(statusDiv);

  const btns = document.createElement("div");
  btns.style.display = "flex";
  btns.style.flexWrap = "wrap";
  btns.style.gap = "8px";

  for (const key in statuses) {
    const btn = document.createElement("button");
    btn.textContent = statuses[key].label;
    btn.style.backgroundColor = statuses[key].color;
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "8px";
    btn.style.cursor = "pointer";

    btn.onclick = () => {
      set(ref(db, `umbrellas/${name}`), {
        status: key,
        updatedBy: waiter,
        updatedAt: new Date().toLocaleString()
      });
    };

    btns.appendChild(btn);
  }

  div.appendChild(btns);
  root.appendChild(div);

  // Live ενημέρωση
  onValue(ref(db, `umbrellas/${name}`), (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const { status, updatedBy, updatedAt } = data;
      statusDiv.innerHTML = `Κατάσταση: <b style="color:${statuses[status]?.color || "black"}">${statuses[status]?.label}</b> <br> 👤 από ${updatedBy} στις ${updatedAt}`;
    } else {
      statusDiv.innerHTML = "Δεν έχει οριστεί κατάσταση ακόμα.";
    }
  });
});
