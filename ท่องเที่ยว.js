
/* ============================================
   THAI TRAVEL PATH FINDER
   SVG MAP + GRAPH THEORY
   ============================================ */

// 1. ข้อมูลสถานที่ (Vertices)

const places = {
  bangkok: {
    name: "กรุงเทพมหานคร",
    short: "กรุงเทพฯ",
    x: 285, y: 390,
    desc: "เมืองหลวงของประเทศไทย"
  },
  ayutthaya: {
    name: "พระนครศรีอยุธยา",
    short: "อยุธยา",
    x: 280, y: 330,
    desc: "เมืองมรดกโลกและอุทยานประวัติศาสตร์"
  },
  kanchanaburi: {
    name: "กาญจนบุรี",
    short: "กาญจนบุรี",
    x: 190, y: 365,
    desc: "สะพานข้ามแม่น้ำแควและธรรมชาติ"
  },
  chiangmai: {
    name: "เชียงใหม่",
    short: "เชียงใหม่",
    x: 255, y: 115,
    desc: "ดอยสุเทพและวัฒนธรรมล้านนา"
  },
  chiangrai: {
    name: "เชียงราย",
    short: "เชียงราย",
    x: 345, y: 65,
    desc: "วัดร่องขุ่นและสามเหลี่ยมทองคำ"
  },
  sukhothai: {
    name: "สุโขทัย",
    short: "สุโขทัย",
    x: 330, y: 235,
    desc: "อุทยานประวัติศาสตร์สุโขทัย"
  },
  khonkaen: {
    name: "ขอนแก่น",
    short: "ขอนแก่น",
    x: 465, y: 260,
    desc: "ศูนย์กลางการท่องเที่ยวภาคอีสาน"
  },
  korat: {
    name: "นครราชสีมา",
    short: "โคราช",
    x: 435, y: 350,
    desc: "ประตูสู่ภาคตะวันออกเฉียงเหนือ"
  },
  pattaya: {
    name: "พัทยา",
    short: "พัทยา",
    x: 390, y: 445,
    desc: "เมืองท่องเที่ยวชายทะเล"
  },
  rayong: {
    name: "ระยอง",
    short: "ระยอง",
    x: 465, y: 470,
    desc: "ชายหาดและเกาะเสม็ด"
  },
  phuket: {
    name: "ภูเก็ต",
    short: "ภูเก็ต",
    x: 260, y: 690,
    desc: "ชายหาดและทะเลอันดามัน"
  },
  surat: {
    name: "สุราษฎร์ธานี",
    short: "สุราษฎร์ฯ",
    x: 315, y: 570,
    desc: "ประตูสู่เกาะสมุยและเกาะพะงัน"
  }
};


// 2. ข้อมูลเส้นทาง (Weighted Edges)
// รูปแบบ [ต้นทาง, ปลายทาง, ระยะทาง, เวลา, ค่าใช้จ่าย]
// ค่าทั้งหมดเป็นข้อมูลจำลองเพื่อการศึกษา

const roads = [
  ["bangkok", "ayutthaya", 80, 1.5, 300],
  ["bangkok", "kanchanaburi", 130, 2.5, 500],
  ["bangkok", "pattaya", 150, 2.5, 600],
  ["bangkok", "korat", 260, 4, 900],
  ["bangkok", "sukhothai", 430, 6, 1200],

  ["ayutthaya", "sukhothai", 350, 5, 1000],
  ["ayutthaya", "korat", 240, 4, 800],

  ["kanchanaburi", "sukhothai", 350, 5, 1100],

  ["sukhothai", "chiangmai", 300, 4.5, 1000],
  ["sukhothai", "khonkaen", 400, 6, 1300],

  ["chiangmai", "chiangrai", 190, 3.5, 700],
  ["chiangrai", "khonkaen", 500, 7, 1500],

  ["khonkaen", "korat", 200, 3, 700],

  ["korat", "pattaya", 300, 5, 1000],
  ["pattaya", "rayong", 60, 1.5, 300],

  ["rayong", "surat", 650, 9, 2000],
  ["bangkok", "surat", 650, 9, 2200],

  ["surat", "phuket", 240, 4, 900]
];


// 3. สร้างกราฟแบบ Adjacency List

const graph = {};

function createGraph() {
  Object.keys(places).forEach(id => {
    graph[id] = [];
  });

  roads.forEach(road => {
    const [from, to, distance, time, cost] = road;

    graph[from].push({
      to,
      distance,
      time,
      cost
    });

    // กราฟไม่มีทิศทาง
    graph[to].push({
      to: from,
      distance,
      time,
      cost
    });
  });

  document.getElementById("edgeCount").textContent =
    roads.length;

  document.getElementById("placeCount").textContent =
    Object.keys(places).length;
}


// 4. วาดแผนที่ SVG

function createMap() {
  const edgeLayer = document.getElementById("edgeLayer");
  const placeLayer = document.getElementById("placeLayer");

  edgeLayer.innerHTML = "";
  placeLayer.innerHTML = "";

  // วาดเส้นเชื่อม
  roads.forEach(road => {
    const [from, to] = road;

    const p1 = places[from];
    const p2 = places[to];

    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);
    line.setAttribute("class", "road-line");

    edgeLayer.appendChild(line);
  });

  // วาดจุดสถานที่
  Object.keys(places).forEach(id => {
    const p = places[id];

    const group = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    group.setAttribute("class", "place-point");
    group.setAttribute(
      "transform",
      `translate(${p.x},${p.y})`
    );

    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", p.name);

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("r", "9");
    circle.setAttribute("class", "place-circle");

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    label.setAttribute("x", "13");
    label.setAttribute("y", "-12");
    label.setAttribute("class", "place-label");
    label.textContent = p.short;

    group.appendChild(circle);
    group.appendChild(label);

    group.addEventListener("click", () => {
      selectPlace(id);
    });

    group.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectPlace(id);
      }
    });

    placeLayer.appendChild(group);
  });
}


// 5. สร้างตัวเลือกต้นทางและปลายทาง

function createSelectOptions() {
  const startSelect = document.getElementById("startPlace");
  const endSelect = document.getElementById("endPlace");

  startSelect.innerHTML = "";
  endSelect.innerHTML = "";

  Object.keys(places).forEach(id => {
    const option1 = document.createElement("option");

    option1.value = id;
    option1.textContent = places[id].name;

    const option2 = option1.cloneNode(true);

    startSelect.appendChild(option1);
    endSelect.appendChild(option2);
  });

  startSelect.value = "bangkok";
  endSelect.value = "chiangmai";
}


// 6. เลือกสถานที่จากการคลิกแผนที่

let selectingStart = true;

function selectPlace(id) {
  const startSelect = document.getElementById("startPlace");
  const endSelect = document.getElementById("endPlace");

  if (selectingStart) {
    startSelect.value = id;
  } else {
    endSelect.value = id;
  }

  selectingStart = !selectingStart;

  document.getElementById("routeResult").innerHTML = `
    <p>เลือกสถานที่: <strong>${places[id].name}</strong></p>
    <p class="muted">
      คลิกจุดถัดไปเพื่อเลือก${selectingStart ? "ต้นทาง" : "ปลายทาง"}
    </p>
  `;

  highlightSelectedPlaces();
}


// 7. เน้นสีต้นทางและปลายทาง

function highlightSelectedPlaces() {
  const start = document.getElementById("startPlace").value;
  const end = document.getElementById("endPlace").value;

  document.querySelectorAll(".place-point").forEach(el => {
    el.classList.remove("start-point", "end-point");

    const id = Object.keys(places).find(key => {
      const p = places[key];

      return el.getAttribute("transform") ===
        `translate(${p.x},${p.y})`;
    });

    if (id === start) {
      el.classList.add("start-point");
    }

    if (id === end) {
      el.classList.add("end-point");
    }
  });
}


// 8. BFS - Breadth First Search

function bfs(start, end) {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];

    if (current === end) {
      return path;
    }

    graph[current].forEach(edge => {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push([...path, edge.to]);
      }
    });
  }

  return null;
}


// 9. DFS - Depth First Search

function dfs(start, end) {
  const stack = [[start]];
  const visited = new Set();

  while (stack.length > 0) {
    const path = stack.pop();
    const current = path[path.length - 1];

    if (current === end) {
      return path;
    }

    if (!visited.has(current)) {
      visited.add(current);

      graph[current].slice().reverse().forEach(edge => {
        if (!visited.has(edge.to)) {
          stack.push([...path, edge.to]);
        }
      });
    }
  }

  return null;
}


// 10. Dijkstra - เส้นทางระยะทางต่ำสุด

function dijkstra(start, end) {
  const distances = {};
  const previous = {};
  const unvisited = new Set(Object.keys(places));

  Object.keys(places).forEach(id => {
    distances[id] = Infinity;
    previous[id] = null;
  });

  distances[start] = 0;

  while (unvisited.size > 0) {
    let current = null;
    let minDistance = Infinity;

    unvisited.forEach(id => {
      if (distances[id] < minDistance) {
        minDistance = distances[id];
        current = id;
      }
    });

    if (current === null) break;
    if (current === end) break;

    unvisited.delete(current);

    graph[current].forEach(edge => {
      if (!unvisited.has(edge.to)) return;

      const newDistance =
        distances[current] + edge.distance;

      if (newDistance < distances[edge.to]) {
        distances[edge.to] = newDistance;
        previous[edge.to] = current;
      }
    });
  }

  if (distances[end] === Infinity) {
    return null;
  }

  const path = [];
  let current = end;

  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}


// 11. คำนวณระยะทาง เวลา และค่าใช้จ่าย

function calculateRoute(path) {
  let distance = 0;
  let time = 0;
  let cost = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i];
    const to = path[i + 1];

    const edge = graph[from].find(e => e.to === to);

    if (edge) {
      distance += edge.distance;
      time += edge.time;
      cost += edge.cost;
    }
  }

  return {
    distance,
    time,
    cost
  };
}


// 12. วาดเส้นทางบนแผนที่

function displayRouteOnMap(path) {
  const routeLayer = document.getElementById("routeLayer");

  routeLayer.innerHTML = "";

  if (!path || path.length === 0) return;

  // วาดเส้นทางที่เลือก
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = places[path[i]];
    const p2 = places[path[i + 1]];

    const line = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );

    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);
    line.setAttribute("class", "route-line");

    routeLayer.appendChild(line);
  }

  // วาดหมายเลขลำดับเส้นทาง
  path.forEach((id, index) => {
    const p = places[id];

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", "14");
    circle.setAttribute("class", "route-circle");

    routeLayer.appendChild(circle);

    const text = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    text.setAttribute("x", p.x);
    text.setAttribute("y", p.y + 4);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("class", "route-number");
    text.textContent = index + 1;

    routeLayer.appendChild(text);
  });
}


// 13. ค้นหาเส้นทาง

function findRoute() {
  const start = document.getElementById("startPlace").value;
  const end = document.getElementById("endPlace").value;

  const algorithm =
    document.getElementById("algorithmSelect").value;

  if (start === end) {
    alert("กรุณาเลือกต้นทางและปลายทางให้แตกต่างกัน");
    return;
  }

  let path = null;

  if (algorithm === "bfs") {
    path = bfs(start, end);
  } else if (algorithm === "dfs") {
    path = dfs(start, end);
  } else {
    path = dijkstra(start, end);
  }

  if (!path) {
    document.getElementById("routeResult").innerHTML =
      "<p>ไม่พบเส้นทางระหว่างสถานที่ที่เลือก</p>";

    return;
  }

  const totals = calculateRoute(path);

  displayRouteOnMap(path);
  displayResult(path, totals, algorithm);
  displayTree(path);

  document.getElementById("distanceTotal").textContent =
    totals.distance.toLocaleString();

  document.getElementById("timeTotal").textContent =
    totals.time.toFixed(1) + " ชม.";

  highlightSelectedPlaces();
}


// 14. แสดงผลการค้นหา

function displayResult(path, totals, algorithm) {
  const result = document.getElementById("routeResult");

  const algorithmNames = {
    bfs: "BFS (ค้นหาแบบกว้าง)",
    dfs: "DFS (ค้นหาแบบลึก)",
    dijkstra: "Dijkstra (ระยะทางต่ำสุด)"
  };

  result.innerHTML = `
    <div class="result-success">
      ✓ พบเส้นทางแล้ว
    </div>

    <p><strong>อัลกอริทึม:</strong><br>
      ${algorithmNames[algorithm]}
    </p>

    <p><strong>เส้นทาง:</strong></p>

    <div class="route-list">
      ${path.map((id, i) => `
        <div class="route-item">
          <span class="route-badge">${i + 1}</span>
          <span>${places[id].name}</span>
        </div>
      `).join("")}
    </div>

    <hr>

    <p>📏 ระยะทางรวม:
      <strong>${totals.distance.toLocaleString()} กม.</strong>
    </p>

    <p>⏱️ เวลาเดินทาง:
      <strong>${totals.time.toFixed(1)} ชั่วโมง</strong>
    </p>

    <p>💰 ค่าใช้จ่าย:
      <strong>${totals.cost.toLocaleString()} บาท</strong>
    </p>

    <p class="muted">
      * เป็นข้อมูลจำลองเพื่อการศึกษา ไม่ใช่ระยะทางจริง
      หรือเวลาจากระบบนำทาง
    </p>
  `;
}


// 15. แสดง Tree จากเส้นทาง

function displayTree(path) {
  const treeView = document.getElementById("treeView");

  if (!path || path.length === 0) {
    treeView.innerHTML = "<p>ไม่พบเส้นทาง</p>";
    return;
  }

  treeView.innerHTML = `
    <div class="tree-root">
      ${places[path[0]].name}
    </div>

    <div class="tree-branch">
      ${path.slice(1).map((id, index) => `
        <div class="tree-node">
          <div class="tree-line"></div>

          <div class="tree-node-card">
            <span>ระดับ ${index + 1}</span>
            <strong>${places[id].name}</strong>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}


// 16. แสดงการ์ดสถานที่ท่องเที่ยว

function showAllPlaces() {
  const container = document.getElementById("placeCards");

  container.innerHTML = "";

  Object.keys(places).forEach(id => {
    const p = places[id];

    const card = document.createElement("div");
    card.className = "place-card";

    card.innerHTML = `
      <div class="place-card-icon">📍</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>

      <div class="place-card-buttons">
        <button data-action="start">
          กำหนดเป็นต้นทาง
        </button>

        <button data-action="end">
          กำหนดเป็นปลายทาง
        </button>
      </div>
    `;

    card.querySelector('[data-action="start"]')
      .addEventListener("click", () => {
        document.getElementById("startPlace").value = id;
        highlightSelectedPlaces();
      });

    card.querySelector('[data-action="end"]')
      .addEventListener("click", () => {
        document.getElementById("endPlace").value = id;
        highlightSelectedPlaces();
      });

    container.appendChild(card);
  });
}


// 17. ล้างเส้นทาง

function resetMap() {
  document.getElementById("routeLayer").innerHTML = "";

  document.getElementById("routeResult").innerHTML =
    "เลือกต้นทางและปลายทางเพื่อเริ่มต้น";

  document.getElementById("distanceTotal").textContent = "-";
  document.getElementById("timeTotal").textContent = "-";

  document.getElementById("treeView").innerHTML =
    '<p class="muted">ค้นหาเส้นทางเพื่อแสดงโครงสร้าง Tree</p>';

  highlightSelectedPlaces();
}


// 18. เริ่มต้นเว็บไซต์

document.addEventListener("DOMContentLoaded", () => {
  createGraph();
  createMap();
  createSelectOptions();
  showAllPlaces();
  highlightSelectedPlaces();

  document.getElementById("startPlace")
    .addEventListener("change", highlightSelectedPlaces);

  document.getElementById("endPlace")
    .addEventListener("change", highlightSelectedPlaces);
});