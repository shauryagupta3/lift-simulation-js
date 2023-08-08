const primaryContainer = document.getElementById("container");
const floors = 5;
const lifts = 3;

class liftState {
  constructor() {
    this.busy = false;
    this.currentFloor = 1;
  }
}

primaryContainer.className =
  "container w-screen h-screen bg-zinc-800  flex flex-col content-center justify-around";

let totallifts = [];

for (let index = 0; index < lifts; index++) {
  totallifts.push(index);
}

for (let index = 0; index < totallifts.length; index++) {
  totallifts[index] = new liftState();
}
console.log(totallifts);

for (let i = floors; i > 0; i--) {
  const floor = document.createElement("div");
  floor.id = `floor-${i}`;
  floor.className = `floor w-full h-full bg-zinc-800 flex flex-row justify-around items-center  border-zinc-400`;
  primaryContainer.appendChild(floor);
  createbuttons(i);
  createlifts(i, lifts);
  initializeLIfts(i, lifts);
}

function createbuttons(num) {
  document.getElementById(
    `floor-${num}`
  ).innerHTML += `<button class="btn btn-blue border-2 w-max h-max text-white px-4 py-2 self-center" ">Call Lift</button>`;
}

function createlifts(num, lifts) {
  for (let i = 0; i < lifts; i++) {
    let lift = document.createElement("div");
    lift.id = `lift-${i}-floor-${num}`;
    lift.className = `lift w-36 h-full bg-zinc-600 flex flex-col justify-around align-center border-zinc-900`;
    document.getElementById(`floor-${num}`).appendChild(lift);
  }
}

function initializeLIfts(num, lifts) {
  if (num == 1) {
    for (let i = 0; i < lifts; i++) {
      document.getElementById(
        `lift-${i}-floor-${num}`
      ).innerHTML = `<div class="gates bg-transparent flex flex-row h-full w-full justify-center items-center">
      <div class="gate-left block w-18 h-full min-w-144 grow bg-zinc-300 border-r-2 border-slate-900" >&nbsp;</div>
      <div class="gate-right block w-18 h-full min-w-144 grow bg-zinc-300 border-l-2 border-slate-900">&nbsp;</div>
      </div>`;
    }
  }
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    let parent = btn.parentNode;
    let floor = parent.id.split("-")[1];
    let alllifts = document.getElementById("floor-1").querySelectorAll(".lift");

    for (let i = 0; i < totallifts.length; i++) {
      if (totallifts[i].busy == false) {
        const diff = Math.abs( floor - totallifts[i].currentFloor);
        if (diff) {
          totallifts[i].busy = true;
          const previousFloor = totallifts[i].currentFloor;
          totallifts[i].currentFloor = floor;
          let distance = Math.abs(previousFloor - floor);
          gatesAnimation(alllifts, i, floor, distance);
          break;
        }
      }
    }
  });
});

let GateOpen = (alllifts, index) => {
  alllifts[index].querySelector(".gate-right").classList.add("gate-open-right");
  alllifts[index].querySelector(".gate-left").classList.add("gate-open-left");

  alllifts[index]
    .querySelector(".gate-right")
    .classList.remove("gate-close-right");
  alllifts[index]
    .querySelector(".gate-left")
    .classList.remove("gate-close-left");
};
let GateClose = (alllifts, index) => {
  alllifts[index]
    .querySelector(".gate-right")
    .classList.add("gate-close-right");
  alllifts[index].querySelector(".gate-left").classList.add("gate-close-left");

  alllifts[index]
    .querySelector(".gate-right")
    .classList.remove("gate-open-right");
  alllifts[index]
    .querySelector(".gate-left")
    .classList.remove("gate-open-left");
};

async function gatesAnimation(alllifts, index, floor, distance) {
  await moveLift(alllifts, index, floor, distance);
  GateOpen(alllifts, index);
  setTimeout(() => {
    GateClose(alllifts, index);
  }, 1000);

  setTimeout(() => {
    totallifts[index].busy = false;
  }, 3000);
}

async function moveLift(alllifts, i, floor, distance) {
  var delayTime = distance * 1000;
  alllifts[i].querySelector(".gates").style.transform = `translateY(-${
    (floor - 1) * 100
  }%)`;
  alllifts[i].querySelector(
    ".gates"
  ).style.transition = `transform ${distance}s ease-in-out`;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayTime);
  });
}
