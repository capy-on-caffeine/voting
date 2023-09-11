import { voting_backend } from "../../declarations/voting_backend";

const pollForm = document.getElementById("radioForm");
const resultsDiv = document.getElementById('result-info');

// alert("working");

const pollResults = {
    "Anoop Saini": 0,
    "Ayush Gupta": 0,
    "Gorantla Srinivas": 0
};

const electionEndTime = new Date("2023-09-12T00:23:00");

document.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();
  // const question = await voting_backend.getQuestion();
  // document.getElementById("question").innerText = question;
  
  const voteCounts = await voting_backend.getVotes();
  updateLocalVoteCounts(voteCounts);
  // displayResults(); // delete if causes problems -----------------------------------------------------------
  // voteListUpdate();
  return false;
}, false);

pollForm.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const currentTime = new Date();
  const timeRemaining = electionEndTime - currentTime;
  if (timeRemaining > 0) {
    const formData = new FormData(radioForm);
  const checkedValue = formData.get("option");
  let email = document.getElementById('email-field').value;

  const updatedVoteCounts = await voting_backend.vote(email, checkedValue);
  console.log("Returning from await...")
  console.log(updatedVoteCounts);
  updateLocalVoteCounts(updatedVoteCounts);
  }

  
  
  // displayResults();
  return false;
}, false);

// async function vote() {
//   const formData = new FormData(radioForm);
//   const checkedValue = formData.get("option");
//   let email = document.getElementById('email-field').value;

//   const updatedVoteCounts = await voting_backend.vote(email, checkedValue);
//   console.log("Returning from await...")
//   console.log(updatedVoteCounts);
//   updateLocalVoteCounts(updatedVoteCounts);
//   // displayResults();
// }

// const btnDiv = document.querySelector('.btn');
// btnDiv.addEventListener('click', vote);






async function reset(passkey) {
  await voting_backend.resetVotes(passkey);
  const voteCounts = await voting_backend.getVotes();
  updateLocalVoteCounts(voteCounts);
  displayResults();
};

// document.getElementById('email-btn').onclick = checkEmail();

// function checkEmail() {
//   let email = document.getElementById('email-field').value;
//   console.log(email);// remove...............................................................
//   let messageElem = document.getElementById('validation-message');

//   if (email.includes('.it.23@nitj.ac.in')) {
//     messageElem.innerText = 'Invalid Email!';
//   } else {
//     messageElem.innerText = 'Validated!';
//   }
// }
// // Done-----------------------------------------------------------------

function displayResults() {
  let resultHTML = '<ul>';
  for (let key in pollResults) {
      resultHTML += '<li><strong>' + key + '</strong>: ' + pollResults[key] + '</li>';
  }
  resultHTML += '</ul>';
  resultsDiv.innerHTML = resultHTML;
};
// done------------------------------------------------------------------------

// function voteListUpdate() {

//   for (let key in pollResults) {
//     const label = document.createElement("label");

// const radioInput = document.createElement("input");
// radioInput.type = "radio";
// radioInput.name = "option";
// radioInput.value = key;

// label.textContent = " " + key;

// label.appendChild(radioInput);

// targetform = document.getElementById('radioForm');
// targetform.appendChild(label);

// targetform.appendChild(document.createElement("br"));
//   }

//   const button = document.createElement("button");

// // Set the button type attribute to "submit"
// button.setAttribute("type", "submit");

// // Set the button text content to "Vote"
// button.textContent = "Vote";

// // Append the button to the document body or another desired element
// targetform.appendChild(button);
// }
// done------------------------------------------------------------------

function updateLocalVoteCounts(arrayOfVoteArrays){

  for (let voteArray of arrayOfVoteArrays) {
    //Example voteArray -> ["Motoko","0"]
    let voteOption = voteArray[0];
    let voteCount = voteArray[1];
    pollResults[voteOption] = voteCount;
  }

};

function updateTimer() {
  const currentTime = new Date();
  const timeRemaining = electionEndTime - currentTime;

  if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const timerMessage = `Election ends in ${days}d ${hours}h ${minutes}m ${seconds}s`;
      document.getElementById("result-info").textContent = timerMessage;
  } else {
      displayResults();
  }
  console.log("done");
}

setInterval(updateTimer, 1000)