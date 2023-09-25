import { voting_backend } from "../../declarations/voting_backend";

const pollForm = document.getElementById("radioForm");
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

pollForm.addEventListener(
  "submit",
  async (e) => {
    e.preventDefault();

    const currentTime = new Date();
    const timeRemaining = electionEndTime - currentTime;
    if (timeRemaining > 0) {
      const formData = new FormData(radioForm);
      const checkedValue = formData.get("option");
      let email = document.getElementById("email-field").value;
      if (email.includes(".it.23@nitj.ac.in")) {
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
}

function setElectionStartTime(time) {
  // time is a string of format "{YYYY-MM-DD}T{HH:MM:SS}"
  electionStartTime = new Date(time);
  updateElectionStatus();
}

function setElectionEndTime(time) {
  // time is a string of format "{YYYY-MM-DD}T{HH:MM:SS}"
  electionEndTime = new Date(time);
  updateElectionStatus();
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

function updateTimer() {
  const currentTime = new Date();
  const timeRemaining = electionEndTime - currentTime;

  if (timeRemaining > 0) {
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const timerMessage = `Election ends in ${days}d ${hours}h ${minutes}m ${seconds}s`;
    document.getElementById("result-info").textContent = timerMessage;
  } else {
    displayResults();
  }
  console.log("done");
}

setInterval(updateTimer, 1000);

// can someone use canister fn if id is knows
// internet identity
// define project - others should understand

// projct scope - kya karega
// scope of work docs
// research