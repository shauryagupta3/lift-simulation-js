let primaryForm = document.getElementById("prim-form");
let liftList = [];
let numOfFloors = 0;
let numOfLifts = 0;

class queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    this.items.shift();
  }

  peek() {
    return this.items[0];
  }
}

let liftCallQueue = new queue();
class Lift {
  constructor(id) {
    this.id = id;
    this.direction = null;
    this.status = "idle";
    this.currentFloor = 0;
  }
}

primaryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let checkInput = false;
  numOfFloors = parseInt(document.getElementById("floors").value);
  numOfLifts = parseInt(document.getElementById("lifts").value);

  if (numOfFloors > 1 && numOfLifts > 1) {
    checkInput = true;
    document.getElementById("container-primary").style.display = "none";
    document.getElementById("container-secondary").style.display = "flex";

    createElements(numOfFloors, numOfLifts);
  }

  if (!checkInput) {
    alert("Please enter a valid number");
  }
});
function createElements(numOfFloors = 1, numOfLifts = 1) {
  for (let i = numOfFloors - 1; i >= 0; i--) {
    let floor = document.createElement("div");
    floor.classList.add("floor");
    floor.setAttribute("id", "floor-" + i);
    floor.style.height = "calc(100% / " + numOfFloors + ")";
    document.getElementById("container-secondary").appendChild(floor);
  }
  createButtons(numOfFloors);
  for (let i = 0; i < numOfLifts; i++) {
    let lift = new Lift(i);
    liftList.push(lift);
    console.log(i);
    createLiftElement(i, numOfLifts);
  }

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      let floor = this.parentElement.parentElement
        .getAttribute("id")
        .split("-")[1];
      let direction = this.getAttribute("id");
      liftCallQueue.enqueue({ floor, direction });
      console.log("working" + floor + direction);
      console.log(liftCallQueue.peek());
      callLift();
    });
  });
}

function createButtons(numOfFloors) {
  for (let i = 0; i < numOfFloors; i++) {
    let buttons = document.createElement("div");
    let upbutton = document.createElement("button");
    upbutton.setAttribute("id", "up");
    upbutton.classList.add("btn");
    upbutton.innerText = "Up";
    let downbutton = document.createElement("button");
    downbutton.innerText = "Down";
    downbutton.setAttribute("id", "down");
    downbutton.classList.add("btn");
    if (i === 0) {
      downbutton.disabled = true;
    } else if (i === numOfFloors - 1) {
      upbutton.disabled = true;
    }
    buttons.appendChild(upbutton);
    buttons.appendChild(downbutton);
    buttons.classList.add("buttons");
    document.getElementById("floor-" + i).appendChild(buttons);
  }
}

function createLiftElement(id, numLifts) {
  let lift = document.createElement("div");
  let gates = document.createElement("div");
  gates.classList.add("gates");
  lift.setAttribute("id", "lift-" + id);
  lift.classList.add("lift");
  lift.style.width = "calc(90% / " + numLifts + ")";
  document.getElementById("floor-0").appendChild(lift);
  let gateLeft = document.createElement("div");
  gateLeft.innerHTML = "&nbsp;";
  gateLeft.classList.add("gateLeft");
  let gateRight = document.createElement("div");
  gateRight.innerHTML = "&nbsp;";
  gateRight.classList.add("gateRight");
  gates.appendChild(gateLeft);
  gates.appendChild(gateRight);
  lift.appendChild(gates);
}

function callLift() {
  while (liftCallQueue.peek() != undefined) {
    console.log(liftCallQueue.peek());
    let { floor, direction } = liftCallQueue.peek();
    let CallFloor = floor;
    let CallDirection = direction;
    console.log(liftList)
    let availableLifts = [];
    for (let i = 0; i < liftList.length; i++) {
      if (
        liftList[i].direction === direction ||
        liftList[i].direction === null
      ) {
        if (liftList[i].status === "idle") {
          availableLifts.push(liftList[i]);
        }
      }
    }
    console.log(availableLifts);
    console.log(availableLifts.length);
    let closestLift = availableLifts[0];
    let closestLiftDistance = Math.abs(CallFloor);
    function findclosestLiftDistance() {
      for (let i = 0; i < availableLifts.length; i++) {
        if (
          Math.abs(availableLifts[i].currentFloor - CallFloor) <
          closestLiftDistance
        ) {
          closestLift = availableLifts[i];
          closestLiftDistance = Math.abs(
            availableLifts[i].currentFloor - CallFloor
          );
          console.log(closestLiftDistance);
        }
        availableLifts.splice(i, 1);
      }
    }
    findclosestLiftDistance();

    console.log(closestLiftDistance);

    moveLift(closestLift, CallDirection, CallFloor, closestLiftDistance);

    console.log(availableLifts);
    console.log(closestLift);
    liftCallQueue.dequeue();
  }
}

async function moveLift(lift, direction, targetFloor, minDistance) {
  document.getElementById(`lift-${lift.id}`).style.transform = `translateY(-${
    (100 / numOfFloors) * targetFloor
  }vh)`;
  lift.status = "moving";
  lift.currentFloor = targetFloor;

  console.log(lift);
  console.time("timer");
  await openLiftGates(lift).then((resolve) => {
    console.log("open");
    setTimeout(() => {
      closeLiftGates(lift).then(() => {
        console.log("close");
        lift.status = "idle";
        console.timeLog("timer");
        if(targetFloor === 0){
          lift.direction = "up";
        }
        else if(targetFloor === numOfFloors - 1){
          lift.direction = "down";
        }
        else{}
        lift.direction = direction;
      });
    }, 1000);
  });
}

function openLiftGates(lift) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(
        `lift-${lift.id}`
      ).children[0].children[0].style.transform = "translateX(-100%)";
      document.getElementById(
        `lift-${lift.id}`
      ).children[0].children[1].style.transform = "translateX(100%)";
      resolve();
    }, 1500);
  });
}

function closeLiftGates(lift) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById(
        `lift-${lift.id}`
      ).children[0].children[0].style.transform = "translateX(0)";
      document.getElementById(
        `lift-${lift.id}`
      ).children[0].children[1].style.transform = "translateX(0)";
      resolve();
    }, 500);
  });
}
