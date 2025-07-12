
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDtI4hKyZHEm5RrfrN50b1U7a0QcMy7zgk",
  authDomain: "ibiscus-dashboard.firebaseapp.com",
  projectId: "ibiscus-dashboard",
  databaseURL: "https://ibiscus-dashboard-default-rtdb.firebaseio.com",
  storageBucket: "ibiscus-dashboard.appspot.com",
  messagingSenderId: "627165396165",
  appId: "1:627165396165:web:b873652110014e218904ac"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const umbrellas = [
  ...Array.from({ length: 25 }, (_, i) => `P${i + 1}`),
  ...Array.from({ length: 20 }, (_, i) => `PL${i + 1}`),
  ...Array.from({ length: 8 }, (_, i) => `B10${i + 1}`.slice(0, 4))
];

const statusOptions = [
  { key: "ok", label: "Όλα ΟΚ", emoji: "✅" },
  { key: "clean", label: "Θέλει καθάρισμα", emoji: "🧼" },
  { key: "glasses", label: "Μαζέψτε ποτήρια", emoji: "🍸" },
  { key: "broken", label: "Ζημιά στον εξοπλισμό", emoji: "🪑" },
  { key: "other", label: "Άλλο", emoji: "📝" }
];

function App() {
  const [states, setStates] = useState({});

  useEffect(() => {
    const statesRef = ref(db, "umbrellas");
    onValue(statesRef, (snapshot) => {
      setStates(snapshot.val() || {});
    });
  }, []);

  const updateStatus = (id, status) => {
    set(ref(db, "umbrellas/" + id), {
      status,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h2>🏖 Κατάσταση Ομπρελών</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {umbrellas.map((id) => (
          <div
            key={id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 10,
              width: 130,
              background: "#f9f9f9"
            }}
          >
            <strong>{id}</strong>
            <div style={{ marginTop: 5 }}>
              {statusOptions.map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => updateStatus(id, key)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 5,
                    padding: "5px",
                    fontSize: "0.9em",
                    background:
                      states[id]?.status === key ? "#a3e4a7" : "#eee",
                    border: "1px solid #ccc",
                    borderRadius: 5
                  }}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
