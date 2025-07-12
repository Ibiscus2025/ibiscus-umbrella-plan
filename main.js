// main.js import { initializeApp } from "firebase/app"; import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = { apiKey: "AIzaSyDtI4hKyZHEm5RrfrN50b1U7a0QcMy7zgk", authDomain: "ibiscus-dashboard.firebaseapp.com", projectId: "ibiscus-dashboard", storageBucket: "ibiscus-dashboard.appspot.com", messagingSenderId: "627165396165", appId: "1:627165396165:web:b873652110014e218904ac", databaseURL: "https://ibiscus-dashboard-default-rtdb.europe-west1.firebasedatabase.app" };

const app = initializeApp(firebaseConfig); const db = getDatabase(app);

const umbrellas = [ ...Array.from({ length: 25 }, (, i) => P${i + 1}), ...Array.from({ length: 20 }, (, i) => PL${i + 1}), ...Array.from({ length: 8 }, (_, i) => B10${i + 1}.replace('010', '10')) ];

const statuses = [ { key: "ok", label: "✅ Όλα ΟΚ", color: "#4CAF50" }, { key: "cleaning", label: "🧼 Καθάρισμα", color: "#9E9E9E" }, { key: "trash", label: "🧴 Ποτήρια / Σκουπίδια", color: "#FFEB3B" }, { key: "damage", label: "🪑 Ζημιά", color: "#F44336" } ];

const container = document.getElementById("root"); let currentUser = "";

const createDropdown = () => { const div = document.createElement("div"); div.innerHTML = <h1 style="text-align:center; font-size: 28px">Κατάσταση Ομπρελών <br>⛱️</h1> <label style="font-size: 18px">👤 Ποιος είσαι; </label> <select id="userSelect"> <option>--</option> <option>Άντζελα</option> <option>Λευτέρης</option> <option>Αναστασία</option> </select> <div id="umbrellas" style="margin-top: 20px; display: flex; flex-wrap: wrap; justify-content: center; gap: 10px"></div>; container.appendChild(div);

document.getElementById("userSelect").addEventListener("change", (e) => { currentUser = e.target.value; if (currentUser !== "--") renderUmbrellas(); }); };

const renderUmbrellas = () => { const umbrellaContainer = document.getElementById("umbrellas"); umbrellaContainer.innerHTML = ""; umbrellas.forEach((id) => { const box = document.createElement("div"); box.style.border = "1px solid #ccc"; box.style.borderRadius = "10px"; box.style.padding = "10px"; box.style.width = "110px"; box.style.textAlign = "center"; box.style.backgroundColor = "#fff";

const title = document.createElement("h3");
title.innerText = id;
box.appendChild(title);

statuses.forEach((status) => {
  const btn = document.createElement("button");
  btn.innerText = status.label;
  btn.style.background = status.color;
  btn.style.border = "none";
  btn.style.color = "#000";
  btn.style.padding = "5px";
  btn.style.margin = "3px 0";
  btn.style.borderRadius = "5px";
  btn.style.width = "100%";
  btn.style.fontWeight = "bold";
  btn.onclick = () => {
    if (!currentUser) return alert("Διάλεξε σερβιτόρο πρώτα");
    set(ref(db, `umbrellas/${id}`), {
      status: status.key,
      updatedBy: currentUser
    });
  };
  box.appendChild(btn);
});

const statusTag = document.createElement("div");
statusTag.id = `status-${id}`;
statusTag.style.marginTop = "5px";
box.appendChild(statusTag);

umbrellaContainer.appendChild(box);

onValue(ref(db, `umbrellas/${id}`), (snapshot) => {
  const data = snapshot.val();
  if (data && data.status) {
    const active = statuses.find((s) => s.key === data.status);
    statusTag.innerText = `📝 ${active.label}\n👤 ${data.updatedBy}`;
    statusTag.style.backgroundColor = active.color;
    statusTag.style.padding = "4px";
    statusTag.style.borderRadius = "5px";
    statusTag.style.whiteSpace = "pre-wrap";
  } else {
    statusTag.innerText = "";
    statusTag.style.backgroundColor = "transparent";
  }
});

}); };

createDropdown();

