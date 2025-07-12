document.addEventListener("DOMContentLoaded", () => {
  const umbrellaIds = [
    ...Array.from({ length: 25 }, (_, i) => `P${i + 1}`),
    ...Array.from({ length: 20 }, (_, i) => `PL${i + 1}`),
    ...Array.from({ length: 8 }, (_, i) => `B10${i + 1}`)
  ];

  const statusColors = {
    none: "#cccccc",
    ok: "#4CAF50",
    clean: "#F44336",
    glasses: "#FFEB3B",
    damage: "#FF9800"
  };

  const statusOrder = ["none", "ok", "clean", "glasses", "damage"];

  function getNextStatus(current) {
    const i = statusOrder.indexOf(current);
    return statusOrder[(i + 1) % statusOrder.length];
  }

  function saveStatus(id, status) {
    const all = JSON.parse(localStorage.getItem("umbrellaStatus") || "{}");
    all[id] = status;
    localStorage.setItem("umbrellaStatus", JSON.stringify(all));
  }

  function loadStatus(id) {
    const all = JSON.parse(localStorage.getItem("umbrellaStatus") || "{}");
    return all[id] || "none";
  }

  const container = document.createElement("div");
  container.style.display = "grid";
  container.style.gridTemplateColumns = "repeat(6, 1fr)";
  container.style.gap = "10px";
  container.style.maxWidth = "600px";
  container.style.margin = "20px auto";
  container.style.textAlign = "center";

  umbrellaIds.forEach(id => {
    const div = document.createElement("div");
    div.textContent = id;
    div.style.padding = "20px";
    div.style.borderRadius = "12px";
    div.style.color = "#000";
    div.style.cursor = "pointer";
    div.style.fontWeight = "bold";

    const currentStatus = loadStatus(id);
    div.dataset.status = currentStatus;
    div.style.backgroundColor = statusColors[currentStatus];

    div.addEventListener("click", () => {
      const next = getNextStatus(div.dataset.status);
      div.dataset.status = next;
      div.style.backgroundColor = statusColors[next];
      saveStatus(id, next);
    });

    container.appendChild(div);
  });

  document.body.innerHTML = `
    <h2 style="text-align:center;font-family:sans-serif;">Ibiscus Pool Bar – Πλάνο Ομπρελών</h2>
    <p style="text-align:center;font-family:sans-serif;">🟩 ΟΚ | 🟥 Καθάρισμα | 🟨 Ποτήρια | 🟧 Ζημιά | ⬜ Καμία ένδειξη</p>
  `;
  document.body.appendChild(container);
});// Placeholder – actual React app will be uploaded via GitHub
