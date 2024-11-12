const url = "https://magicloops.dev/api/loop/d6c7f1a9-104b-4372-a9c0-09afb6186182/run";
let isEmergency = false;
let correctDataDuration = 0;

async function fetchHealthData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la solicitud: " + response.status);

    const data = await response.json();
    const healthData = data[0];
    displayHealthData(healthData);

    if (healthData.status === "emergencia") {
      isEmergency = true;
      correctDataDuration = 0;
      scheduleNextRequest(5000);
    } else {
      isEmergency = false;
      correctDataDuration += 5;
      if (correctDataDuration >= 30) {
        simulateEmergency();
      } else {
        scheduleNextRequest(10000);
      }
    }

  } catch (error) {
    console.error("Hubo un error:", error);
    document.getElementById("results").innerText = "Hubo un error al obtener los datos.";
    scheduleNextRequest(isEmergency ? 5000 : 10000);
  }
}

function simulateEmergency() {
  displayHealthData({
    status: "emergencia",
    problem: "presión arterial",
    heart_rate: 72,
    blood_pressure: { systolic: 200, diastolic: 139 },
    timestamp: new Date().toLocaleString()
  });
  isEmergency = true;
  correctDataDuration = 0;
}

function displayHealthData(data) {
  const heartRateElement = document.getElementById("heart-rate");
  const bloodPressureElement = document.getElementById("blood-pressure");
  const statusElement = document.getElementById("status");
  const timeElement = document.getElementById("time");
  const attendButton = document.getElementById("attend-button");

  heartRateElement.className = (data.heart_rate < 60 || data.heart_rate > 100) ? "alert" : "normal";
  heartRateElement.textContent = `Palpitaciones: ${data.heart_rate} bpm`;

  const { systolic, diastolic } = data.blood_pressure;
  bloodPressureElement.className = (systolic < 90 || systolic > 120 || diastolic < 60 || diastolic > 80) ? "alert" : "normal";
  bloodPressureElement.textContent = `Presión Arterial: ${systolic}/${diastolic} mmHg`;

  if (data.status === "emergencia") {
    statusElement.className = "alert";
    statusElement.textContent = `Estado: ${data.status} - ${data.problem}.`;
    attendButton.style.display = "inline";
  } else {
    statusElement.className = "normal";
    statusElement.textContent = `Estado: ${data.status} - Todo está en niveles normales.`;
    attendButton.style.display = "none";
  }

  timeElement.textContent = `Hora: ${data.timestamp}`;
}

function markAsAttended() {
  isEmergency = false;
  correctDataDuration = 0;
  fetchHealthData();
}

function scheduleNextRequest(delay) {
  setTimeout(fetchHealthData, delay);
}

fetchHealthData();
