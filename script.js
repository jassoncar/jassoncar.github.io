const url = "https://magicloops.dev/api/loop/d6c7f1a9-104b-4372-a9c0-09afb6186182/run?input=I+love+Magic+Loops%21";
let isEmergency = false;

async function fetchHealthData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la solicitud: " + response.status);

    const data = await response.json();
    displayHealthData(data);

    if (data.status.includes("emergencia")) {
      isEmergency = true;
      scheduleNextRequest(8000);
    } else {
      isEmergency = false;
      scheduleNextRequest(30000);
    }

  } catch (error) {
    console.error("Hubo un error:", error);
    document.getElementById("results").innerText = "Hubo un error al obtener los datos.";
    scheduleNextRequest(30000);
  }
}

function displayHealthData(data) {
  const heartRateElement = document.getElementById("heart-rate");
  const bloodPressureElement = document.getElementById("blood-pressure");
  const statusElement = document.getElementById("status");
  const timeElement = document.getElementById("time");

  const heartRate = data.heart_rate;
  heartRateElement.className = (heartRate < 60 || heartRate > 100) ? "alert" : "normal";
  heartRateElement.textContent = `Palpitaciones: ${heartRate} bpm`;

  const { systolic, diastolic } = data.blood_pressure;
  let pressureStatus = "";
  if (systolic < 90 || diastolic < 60) {
    isEmergency = true;
    bloodPressureElement.className = "alert";
    pressureStatus = "Presión baja";
  } else if (systolic > 120 || diastolic > 80) {
    isEmergency = true;
    bloodPressureElement.className = "warning";
    pressureStatus = "Presión alta";
  } else {
    isEmergency = false;
    bloodPressureElement.className = "normal";
    pressureStatus = "Normal";
  }

  bloodPressureElement.textContent = `Presión Arterial: ${systolic}/${diastolic} mmHg (${pressureStatus})`;

  if (isEmergency) {
    statusElement.className = "alert";
    statusElement.textContent = `Estado: ${data.status}`;
  } else {
    statusElement.className = "normal";
    statusElement.textContent = `Estado: ${data.status} - Todo está en niveles normales.`;
  }

  timeElement.textContent = `Hora: ${data.time}`;
}

function scheduleNextRequest(delay) {
  setTimeout(fetchHealthData, delay);
}

fetchHealthData();

