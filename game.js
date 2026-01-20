/* =====================
   CẤU HÌNH CHUNG
===================== */
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let soundOn = true;
let isAdmin = false;
let gameStarted = false;

/* =====================
   ÂM THANH
===================== */
const bgm = new Audio("assets/sound/bgm.mp3");
bgm.loop = true;

function toggleSound(){
  soundOn = !soundOn;
  bgm.muted = !soundOn;
}

/* =====================
   INTRO + LOGIN
===================== */
function startGame(){
  document.getElementById("intro").style.display = "none";
  document.getElementById("login").style.display = "flex";
}

function login(){
  const e = document.getElementById("email").value;
  const p = document.getElementById("password").value;

  if(e === "Anhtuan2708@" && p === "tuan2708@"){
    isAdmin = true;
    alert("Đăng nhập ADMIN");
  }

  document.getElementById("login").style.display = "none";
  canvas.style.display = "block";
  bgm.play();
  gameStarted = true;
}

/* =====================
   TÀI NGUYÊN
===================== */
let resource = {
  wood: 500,
  stone: 300,
  gold: 100,
  gem: 5
};

function updateUI(){
  wood.innerText = resource.wood;
  stone.innerText = resource.stone;
  gold.innerText = resource.gold;
  gem.innerText = resource.gem;
}

/* =====================
   MAP + TILE
===================== */
const TILE = 64;

const map = [
 [0,0,1,1,2,2,0,0],
 [0,1,1,2,2,0,0,3],
 [0,0,0,1,0,3,3,3],
 [4,4,0,0,0,0,3,3],
 [4,4,0,1,1,0,0,0],
];

const tiles = [];
function load(src){
  const i = new Image();
  i.src = src;
  return i;
}

tiles[0] = load("assets/tiles/ground.png");
tiles[1] = load("assets/tiles/forest.png");
tiles[2] = load("assets/tiles/stone.png");
tiles[3] = load("assets/tiles/gold.png");
tiles[4] = load("assets/tiles/water.png");

/* =====================
   CAMERA + ZOOM (MOBILE)
===================== */
let camX = 0, camY = 0, scale = 1;

canvas.addEventListener("touchmove", e=>{
  if(e.touches.length === 2){
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    scale = Math.min(2, Math.max(0.6, Math.hypot(dx,dy)/200));
  }
});

/* =====================
   CÔNG TRÌNH
===================== */
const buildings = [];
const buildCost = {
  house: {wood:50, stone:20},
  barracks: {wood:120, stone:80}
};

function build(type, x, y){
  if(!isAdmin){
    const cost = buildCost[type];
    if(resource.wood < cost.wood || resource.stone < cost.stone) return;
    resource.wood -= cost.wood;
    resource.stone -= cost.stone;
  }
  buildings.push({type, x, y});
  updateUI();
}

/* =====================
   LÍNH
===================== */
const units = [];
const unitImg = load("assets/units/soldier.png");

class Soldier{
  constructor(x,y){
    this.x=x; this.y=y;
    this.frame=0;
  }
  update(){
    this.frame = (this.frame+1)%4;
  }
  draw(){
    ctx.drawImage(
      unitImg,
      this.frame*64,0,64,64,
      this.x,this.y,64,64
    );
  }
}

/* =====================
   HIỆU ỨNG LỬA
===================== */
const effects = [];
const fireImg = load("assets/effects/fire.png");

class Fire{
  constructor(x,y){
    this.x=x; this.y=y; this.f=0;
  }
  update(){ this.f=(this.f+1)%6; }
  draw(){
    ctx.drawImage(
      fireImg,
      this.f*64,0,64,64,
      this.x,this.y,64,64
    );
  }
}

/* =====================
   VẼ MAP
===================== */
function drawMap(){
  for(let y=0;y<map.length;y++){
    for(let x=0;x<map[y].length;x++){
      ctx.drawImage(
        tiles[map[y][x]],
        x*TILE, y*TILE, TILE, TILE
      );
    }
  }
}

/* =====================
   GAME LOOP
===================== */
function loop(){
  if(!gameStarted) return;

  ctx.setTransform(scale,0,0,scale,camX,camY);
  ctx.clearRect(-camX,-camY,canvas.width,canvas.height);

  drawMap();

  buildings.forEach(b=>{
    ctx.fillStyle="brown";
    ctx.fillRect(b.x,b.y,64,64);
  });

  units.forEach(u=>{
    u.update();
    u.draw();
  });

  effects.forEach(e=>{
    e.update();
    e.draw();
  });

  requestAnimationFrame(loop);
}

updateUI();
loop();

/* =====================
   ADMIN BUFF
===================== */
document.addEventListener("keydown", e=>{
  if(isAdmin && e.key==="b"){
    resource.wood+=1000;
    resource.stone+=1000;
    resource.gold+=1000;
    resource.gem+=100;
    updateUI();
  }
});