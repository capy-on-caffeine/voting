import { voting_backend } from "../../declarations/voting_backend";

const pollForm = document.getElementById("radioForm");
const mailForm = document.getElementById("email-form");
const resultsDiv = document.getElementById("result-info");

const pollResults = {
  // Change before elections dapp is deployed
  "Anoop Saini": 0,
  "Ayush Gupta": 0,
  "Gorantla Srinivas": 0,
};

const electionStartTime = new Date("2023-09-12T14:30:00");
const electionEndTime = new Date("2023-09-12T14:30:00");
let electionOngoing = false;
let emailVerified = false;
let verifiedEmailValue = "";

document.addEventListener(
  "DOMContentLoaded",
  async (e) => {
    e.preventDefault();

    const voteCounts = await voting_backend.getVotes(); // Try to do this in the timer thing
    updateLocalVoteCounts(voteCounts);
    return false;
  },
  false
);

mailForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();

    // const formData = new FormData(mailForm);
    let email = document.getElementById("email-field").value;
    emailVerified = await voting_backend.verify(email);
    if (emailVerified) verifiedEmailValue = email;
    else verifiedEmailValue = "";

    popup(emailVerified);
  },
  false
);

pollForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();

    const currentTime = new Date();
    const timeRemaining = electionEndTime - currentTime;
    if (timeRemaining > 0) {
      const formData = new FormData(radioForm);
      const checkedValue = formData.get("option");
      let email = verifiedEmailValue;
      if (emailVerified) {
        const updatedVoteCounts = await voting_backend.vote(
          email,
          checkedValue
        );
        console.log("Returning from await...");
        console.log(updatedVoteCounts);
        updateLocalVoteCounts(updatedVoteCounts);
      }
    }
    return false;
  },
  false
);

async function reset(passkey) {
  await voting_backend.resetVotes(passkey);
  const voteCounts = await voting_backend.getVotes();
  updateLocalVoteCounts(voteCounts);
  displayResults();
}

function updateElectionStatus() {
  let currentTime = new Date();
  if (currentTime - electionStartTime > 0 && electionEndTime - currentTime > 0) electionOngoing = true;
  else electionOngoing = false;
  return electionEndTime - currentTime; // Useful for result function
}

function setElectionStartTime(time) {
  // time is a string of format "{YYYY-MM-DD}T{HH:MM:SS}"
  electionStartTime = new Date(time);
  updateElectionStatus(); // potentially erraneous
}

function setElectionEndTime(time) {
  // time is a string of format "{YYYY-MM-DD}T{HH:MM:SS}"
  electionEndTime = new Date(time);
  updateElectionStatus(); // potentially erraneous
}

function popup(message) {
  // replace with an actual div
  alert(message);
}


function displayResults() {
  let resultHTML = "<ul>";
  for (let key in pollResults) {
    resultHTML +=
      "<li><strong>" + key + "</strong>: " + pollResults[key] + "</li>";
  }
  resultHTML += "</ul>";
  resultsDiv.innerHTML = resultHTML;
}

function updateLocalVoteCounts(arrayOfVoteArrays) {
  for (let voteArray of arrayOfVoteArrays) {
    let voteOption = voteArray[0];
    let voteCount = voteArray[1];
    pollResults[voteOption] = voteCount;
  }
}

// function updateTimer() {
//   const currentTime = new Date();
//   const timeRemaining = electionEndTime - currentTime;

//   if (timeRemaining > 0) {
//     const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(
//       (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//     );
//     const minutes = Math.floor(
//       (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
//     );
//     const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

//     const timerMessage = `Election ends in ${days}d ${hours}h ${minutes}m ${seconds}s`;
//     document.getElementById("result-info").textContent = timerMessage;
//   } else {
//     displayResults();
//   }
//   console.log("done");
// }

function results() {
  let timeRemaining = updateElectionStatus();
  if (electionOngoing) {
    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const timerMessage = `Election ends in ${hours}h ${minutes}m ${seconds}s`;
    document.getElementById("result-info").textContent = timerMessage;
  } else {
    displayResults();
  }
}

setInterval(results, 1000);