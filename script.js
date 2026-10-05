// get all needed for DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const maxCount = 50;
const storageKey = "eventAttendance";
const teams = ["water", "zero", "power"];
let attendance = {
  count: 0,
  teams: {
    water: 0,
    zero: 0,
    power: 0,
  },
  attendees: {
    water: [],
    zero: [],
    power: [],
  },
};

function isValidAttendance(data) {
  return (
    Number.isInteger(data.count) &&
    data.count >= 0 &&
    data.teams &&
    Number.isInteger(data.teams.water) &&
    Number.isInteger(data.teams.zero) &&
    Number.isInteger(data.teams.power) &&
    data.attendees &&
    Array.isArray(data.attendees.water) &&
    Array.isArray(data.attendees.zero) &&
    Array.isArray(data.attendees.power)
  );
}

function updateAttendanceDisplay() {
  attendeeCount.textContent = attendance.count;
  progressBar.style.width =
    Math.round((attendance.count / maxCount) * 100) + "%";

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    const teamCounter = document.getElementById(team + "Count");
    const attendeeList = document.getElementById(team + "Attendees");

    teamCounter.textContent = attendance.teams[team];
    attendeeList.textContent = "";

    for (let j = 0; j < attendance.attendees[team].length; j++) {
      const attendee = document.createElement("li");
      attendee.textContent = attendance.attendees[team][j];
      attendeeList.appendChild(attendee);
    }
  }
}

function saveAttendance() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(attendance));
  } catch (error) {
    console.error("Could not save attendance to local storage:", error);
    alert("Attendance could not be saved in this browser.");
  }
}

const savedAttendance = localStorage.getItem(storageKey);
if (savedAttendance !== null) {
  try {
    const parsedAttendance = JSON.parse(savedAttendance);
    if (isValidAttendance(parsedAttendance)) {
      attendance = parsedAttendance;
    } else {
      throw new Error("Saved attendance data has an invalid format.");
    }
  } catch (error) {
    console.error("Could not load attendance from local storage:", error);
    alert("Saved attendance could not be loaded. Starting with zero counts.");
  }
}

updateAttendanceDisplay();

// form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  //get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName);

  // increment
  attendance.count++;
  attendance.teams[team]++;
  console.log("Total check ins", attendance.count);

  // add attendee to the selected team's list
  attendance.attendees[team].push(`${name} - ${teamName}`);

  updateAttendanceDisplay();
  saveAttendance();

  //show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  form.reset();
});