const vWidth = 1200;
const vHeight = 600;
const lineStroke = 200;
let middle = { x: vWidth / 2, y: vHeight / 2 };
let speed = 15;
const MAX_SPEED = 50;
const MIN_SPEED = 1;
let forceRender = false;
//Get all elements
const information = document.querySelector('.info');
const container = document.querySelector('.container');
const controlButtons = document.querySelector('.control-buttons');
const taskContainer = document.querySelector('.taskqueue');
function setup() {
  const canvas = createCanvas(vWidth, vHeight);
  canvas.parent(container);
  btnSpeedUp = createButton('Speed up');
  btnSpeedUp.mousePressed(speedUp);
  btnSpeedDown = createButton('Speed down');
  btnSpeedDown.mousePressed(speedDown);
  btnStop = createButton('Stop');
  btnStop.mousePressed(stop);
  btnAddTask = createButton('Task queue');
  btnAddTask.mousePressed(addTask);
  btnReset = createButton('Reset');
  btnReset.mousePressed(reset);
  btnLOOP = createButton('While loop');
  btnLOOP.mousePressed(() => addTask('LOOP'));
  btnTimeout = createButton('Timeout');
  btnTimeout.mousePressed(() => addTask('TIMEOUT'));
  //create a button name btnForceRender
  btnForceRender = createButton('Force render');
  btnForceRender.mousePressed(() => {
    forceRender = true;
  });
  [
    { name: 'btn-light', btn: btnReset },
    { name: 'btn-success', btn: btnForceRender },
    { name: 'btn-primary', btn: btnSpeedDown },
    { name: 'btn-primary', btn: btnSpeedUp },
    { name: 'btn-danger', btn: btnStop },
    { name: 'btn-warning', btn: btnAddTask },
    { name: 'btn-warning', btn: btnLOOP },
    { name: 'btn-warning', btn: btnTimeout },
  ].forEach((button) => {
    button.btn.addClass(`btn ml-2 ${button.name}`);
    button.btn.parent(controlButtons);
  });
  information.innerHTML = `SPEED: <br/> ${speed}`;
}
let xDirection = 1;
let yDirection = 0;
let xSpeed = 1;
let ySpeed = 1;
let x = vWidth / 2,
  y = 100;
let xEndpoint = vWidth / 2 + 200;
let yEndpoint = vHeight - 100;
let taskQueue = [];
let renderTask = true;
const checkEndpoint = (x, endpoint, speed) => {
  if (x === 1) return x === endpoint;
  return x <= endpoint + speed / 2 && x >= endpoint - speed / 2;
};

function draw() {
  //draw path
  strokeWeight(100);
  stroke('rgb(217,217,217)');
  fill('rgba(0,0,0,0)');
  rect(100, 100, vWidth - lineStroke, vHeight - lineStroke, 25, 25);
  rect(400, 100, vHeight - lineStroke, vHeight - lineStroke);

  //draw taskqueue
  strokeWeight(1);
  fill(
    `${taskQueue?.length && x < 400 ? 'rgb(255,255,0)' : 'rgb(127,130,140)'}`
  );
  stroke(255, 255, taskQueue?.length ? 0 : 0);
  rect(50, vHeight / 2 - 50, 100);

  //draw render task
  strokeWeight(1);
  fill(`rgb(100,0,100)`);
  stroke(255, 255, renderTask ? 0 : 0, 0);
  rect(vWidth - 150, vHeight / 2 - 50, 100, 200);
  fill(`rgb(255,0,100)`);
  rect(vWidth - 150, vHeight / 2 - 150, 100);
  if (taskQueue?.length && xSpeed === -1) {
    xEndpoint = 100;
  } else if ((renderTask || forceRender) && xSpeed === 1)
    xEndpoint = vWidth - 100;
  else xEndpoint = vWidth / 2 + xSpeed * 200;
  if (checkEndpoint(x, xEndpoint, speed) && yDirection === 0) {
    xDirection = 0;
    yDirection = 1;
    xSpeed *= -1;
  }
  if (
    checkEndpoint(x, vWidth - 100, speed) &&
    checkEndpoint(y, vHeight / 2 - 50, speed)
  ) {
    renderTask = false;
    forceRender = false;
  }
  if (
    checkEndpoint(x, 100, speed) &&
    checkEndpoint(y, vHeight / 2 - 50, speed)
  ) {
    excuteTask();
  }

  yEndpoint = ySpeed === -1 ? 100 : vHeight - 100;
  if (checkEndpoint(y, yEndpoint, speed) && xDirection === 0) {
    xDirection = 1;
    yDirection = 0;
    ySpeed *= -1;
    renderTask = Math.random() >= 0.7;
  }
  x += speed * xDirection * xSpeed;
  y += speed * yDirection * ySpeed;
  stroke(0);
  fill(255);
  strokeWeight(2);
  rect(x, y, 25, 25);
}

const speedUp = () => {
  if (speed === MAX_SPEED) return;
  speed += speed === 1 ? 4 : 5;

  information.innerHTML = `SPEED: <br/>${speed}`;
};

const speedDown = () => {
  if (speed === MIN_SPEED) return;
  speed -= speed === 5 ? 4 : 5;
  information.innerHTML = `SPEED: <br/> ${speed}`;
};
let oldSpeed;
const stop = () => {
  if (speed === 0) {
    speed = oldSpeed;
    information.innerHTML = `SPEED: <br/> ${speed}`;
    return;
  }
  oldSpeed = speed;
  speed = 0;
  information.innerHTML = `STOP`;
};

const updateTaskQueueHtml = () => {
  taskContainer.innerHTML = ``;
  for (let i = 0; i < taskQueue.length; i++) {
    taskContainer.innerHTML += `<li>${taskQueue[i]}</li>`;
  }
};

const addTask = (task = 'TASK') => {
  taskQueue.push(task);
  updateTaskQueueHtml();
};

const excuteTask = () => {
  if (taskQueue.length === 0) return;
  switch (taskQueue[0]) {
    case 'LOOP':
      speed = 0;
      break;
    case 'TIMEOUT':
      taskQueue.shift();
      updateTaskQueueHtml();
      setTimeout(() => {
        taskQueue.push('TIMEOUT');
        updateTaskQueueHtml();
      }, 1000);
      break;
    default:
      taskQueue.shift();
      updateTaskQueueHtml();
  }
};

const reset = () => {
  speed = 15;
  xDirection = 1;
  yDirection = 0;
  xSpeed = 1;
  ySpeed = 1;
  (x = vWidth / 2), (y = 100);
  xEndpoint = vWidth / 2 + 200;
  yEndpoint = vHeight - 100;
  information.innerHTML = `SPEED: <br/>${speed}`;
  taskQueue = [];
  updateTaskQueueHtml();
};

function keyPressed() {
  const left = 37;
  const up = 38;
  const right = 39;
  const down = 40;
  const space = 32;
  switch (keyCode) {
    case space:
      stop();
      break;
    case up:
      speedUp();
      break;
    //if left, add a task to taskQueue
    case left:
      addTask();
      break;
    case down:
      speedDown();
      break;
    case right:
      forceRender = true;
      break;
    default:
      break;
  }
}
