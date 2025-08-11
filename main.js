const completed = document.querySelector(".completed");
const questNum = document.querySelector(".question-num");
const prog = document.querySelector(".prog");
const points = document.querySelector(".points");
const timer = document.querySelector(".timer");
const level = document.querySelector(".level");
const quest = document.querySelector(".quest");
const answersContainer = document.querySelector(".answers");
const check = document.querySelector(".check");
const next = document.querySelector(".next");
const showScore = document.querySelector(".show-score");

const finalPoints = document.querySelector(".final-points");

let counter;
let i = 0;
let allChosenAnswers = [];
let allScore = 0;
let allPoints = [];

getData();

async function getData() {
  try {
    const response = await fetch("./quest.json");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    setupQuestions(result);
  } catch (error) {
    console.error(error.message);
  }
}

function setupQuestions(result) {
  add(result);

  setInterval(() => {
    let minutes = Math.floor(counter / 60);
    let sec = Math.floor(counter - 60 * minutes);
    if (counter <= 0 && minutes <= 0) {
      timer.innerText = `00:00`;

      if (i < result.length) {
        add(result);
        timer.classList.remove("finishes");
      } else {
        timer.classList.add("finishes");
        if (i >= result.length) {
          finished(result);
        }
      }
    } else {
      if (counter >= 60) {
        if (minutes >= 10) {
          sec >= 10
            ? (timer.innerText = `${minutes}:${sec}`)
            : (timer.innerText = `${minutes}:0${sec}`);
        } else {
          sec >= 10
            ? (timer.innerText = `${minutes}:${sec}`)
            : (timer.innerText = `0${minutes}:0${sec}`);
        }
      } else {
        sec >= 10
          ? (timer.innerText = `00:${sec}`)
          : (timer.innerText = `00:0${sec}`);
      }
    }
    counter--;
  }, 1000);

  next.addEventListener("click", () => {
    if (i < result.length) {
      add(result);
    } else {
      finished(result);
    }
  });
  check.addEventListener("click", () => {
    let chosen = answersContainer.querySelector(".pressed");
    if (!chosen) return;

    // check.disabled = true;
    if (allChosenAnswers[i - 1] == result[i - 1].right_answer) {
      chosen.classList.add("right");
      chosen.classList.remove("wrong");
      chosen.classList.remove("pressed");
    } else {
      chosen.classList.add("wrong");
      chosen.classList.remove("pressed");
      chosen.classList.remove("right");
      answersContainer.querySelector(".right_answer").classList.add("right");
    }
  });
}

function setDataOnThePage(result, length) {
  // Infos
  questNum.innerText = `Questions ${i + 1} of ${length}`;
  const percentage = Math.floor(((i + 1) / length) * 100);
  completed.innerText = `${percentage}% Complete`;
  prog.style.width = `${percentage}%`;
  // Questions
  quest.innerText = result.title;
  counter = result.timeLimit * 60;
  points.innerText = `${result.points} points`;
  level.innerText = result.difficulty;
  // Answers
  let ans = [
    result.answer_1,
    result.answer_2,
    result.answer_3,
    result.answer_4,
  ];

  ans = shuffle(ans);
  answersContainer.innerText = "";
  for (let j = 0; j < 4; j++) {
    const answer = document.createElement("button");
    const questOrder = document.createElement("span");
    const answerText = document.createElement("span");

    answer.classList.add("answer");
    questOrder.classList.add("quest-num");
    answerText.classList.add("answer-text");

    questOrder.innerText = String.fromCharCode(97 + j);
    answerText.innerText = ans[j];
    if (answerText.innerText == result.right_answer) {
      answer.classList.add("right_answer");
    }

    answer.appendChild(questOrder);
    answer.appendChild(answerText);
    answersContainer.appendChild(answer);
  }

  // check bostons
  const btns = [...answersContainer.children];
  let chosenAnswer;
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.map((e) => e.classList.remove("pressed"));
      btns.map((e) => e.classList.remove("right"));
      btns.map((e) => e.classList.remove("wrong"));
      btn.classList.add("pressed");
      chosenAnswer = document.querySelector(
        ".answer.pressed .answer-text"
      ).innerText;

      allChosenAnswers[i - 1] = chosenAnswer;
      if (chosenAnswer == result.right_answer) {
        allPoints[i - 1] = result.points;
      } else {
        allPoints[i - 1] = 0;
      }
    });
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function add(result) {
  setDataOnThePage(result[i], result.length);
  i++;
}

function finished(result) {
  let res = 0;
  for (let i = 0; i < result.length; i++) {
    res += result[i].points;
  }
  showScore.style.opacity = 1;
  showScore.style.pointerEvents = "unset";
  finalPoints.innerText = `Points: ${allPoints.reduce(
    (a, e) => a + e
  )} from ${res}`;
}
