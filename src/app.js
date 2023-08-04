const primaryContainer = document.getElementById("container");
const floors = 4;
const lifts = 3;

primaryContainer.className =
  "container w-screen h-screen bg-zinc-800 flex flex-col content-center justify-around";

for (let i = floors; i > 0; i--) {
  const floor = document.createElement("div");
  floor.id = `floor-${i}`;
  floor.className = `floor w-full h-full bg-zinc-800 flex flex-row justify-around items-center border-2 border-zinc-400`;
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
    const lift = document.createElement("div");
    lift.id = `lift-${i}-floor-${num}`;
    lift.className = `lift w-36 h-full bg-zinc-600 flex flex-col justify-around align-center border-2 border-zinc-900`;
    document.getElementById(`floor-${num}`).appendChild(lift);
  }
}

function initializeLIfts(num, lifts) {
  if (num == 1) {
    for (let i = 0; i < lifts; i++) {
      document.getElementById(
        `lift-${i}-floor-${num}`
      ).innerHTML = `<div class="gates bg-orange-400 flex flex-row h-full w-full justify-center items-center">
      <div class="gate-left duration-500 block w-18 h-full min-w-144 grow bg-zinc-300 border-r-2 border-slate-900" >&nbsp;</div>
      <div class="gate-right duration-500 block w-18 h-full min-w-144 grow bg-zinc-300 border-l-2 border-slate-900">&nbsp;</div>
      </div>`;
    }
  }
}

document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    let parent = btn.parentNode;
    let alllifts = parent.querySelectorAll(".lift");
    GateOpen(alllifts);
    setTimeout(() => {
      GateClose(alllifts);
    }, 3000);    
  });
});

// let gatesAnimation = () => {};

let GateOpen = (alllifts) => {
 alllifts[0].querySelector(".gate-right").classList.add("gate-open-right");
 alllifts[0].querySelector(".gate-left").classList.add("gate-open-left");
};
let GateClose = (alllifts) => {
  alllifts[0].querySelector(".gate-right").classList.add("gate-close-right");
  alllifts[0].querySelector(".gate-left").classList.add("gate-close-left");
};

console.log(document.querySelectorAll(".btn"));
