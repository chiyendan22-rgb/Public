// ====== AUTH ======
let isAdmin = false;

function register(){
  const u = user.value.trim();
  const p = pass.value.trim();
  if(!u || !p) return alert("Thiếu thông tin");
  localStorage.setItem("acc_"+u, p);
  alert("Đăng ký thành công");
}

function login(){
  const u = user.value.trim();
  const p = pass.value.trim();

  if(u==="Anhtuan2708@" && p==="tuan2708@"){
    isAdmin = true;
    startGame();
    return;
  }

  const saved = localStorage.getItem("acc_"+u);
  if(saved === p){
    startGame();
  }else{
    alert("Sai tài khoản hoặc mật khẩu");
  }
}

// ====== GAME CORE ======
const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

const TILE_W = 64, TILE_H = 32;

function loadImg(src){
  const i = new Image();
  i.src = src;
  return i;
}

// ====== MAP ======
const map = [
 [0,0,0,1,1,1],
 [0,0,1,1,1,1],
 [0,1,1,2,2,1],
 [1,1,2,2,2,1],
 [1,1,1,2,1,1]
];

const tiles = {
  0: loadImg("assets/tiles/grass.png"),
  1: loadImg("assets/tiles/sand.png"),
  2: loadImg("assets/tiles/stone.png")
};

function iso(x,y){
  return {
    x:(x-y)*TILE_W/2 + canvas.width/2,
    y:(x+y)*TILE_H/2 + 50
  };
}

// ====== DATA ======
let resources = { wood:200, stone:100, gold:100 };
let age = 1;

let buildings = [
  {type:"townhall",x:2,y:2,img:loadImg("assets/buildings/townhall.png")}
];

let units = [
  {type:"villager",x:3,y:2,hp:50,atk:2,img:loadImg("assets/units/villager.png")}
];

// ====== DRAW ======
function drawMap(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<map.length;y++){
    for(let x=0;x<map[y].length;x++){
      const p = iso(x,y);
      ctx.drawImage(tiles[map[y][x]], p.x, p.y);
    }
  }
}

function drawBuildings(){
  buildings.forEach(b=>{
    const p = iso(b.x,b.y);
    ctx.drawImage(b.img,p.x-32,p.y-64);
  });
}

function drawUnits(){
  units.forEach(u=>{
    const p = iso(u.x,u.y);
    ctx.drawImage(u.img,p.x-16,p.y-32);
  });
}

function redraw(){
  drawMap();
  drawBuildings();
  drawUnits();
}

// ====== MOVE UNIT ======
canvas.addEventListener("click",e=>{
  const r = canvas.getBoundingClientRect();
  const mx = e.clientX-r.left;
  const my = e.clientY-r.top;

  const ty = Math.floor(((my-50)/(TILE_H/2)-(mx-canvas.width/2)/(TILE_W/2))/2);
  const tx = Math.floor(((mx-canvas.width/2)/(TILE_W/2)+(my-50)/(TILE_H/2))/2);

  units[0].x = tx;
  units[0].y = ty;
  redraw();
});

// ====== ADMIN BUFF ======
document.addEventListener("keydown",e=>{
  if(isAdmin && e.key==="`"){
    resources.wood+=1000;
    resources.gold+=1000;
    units.push({
      type:"infantry",x:2,y:3,hp:150,atk:20,
      img:loadImg("assets/units/infantry.png")
    });
    alert("ADMIN BUFF!");
    redraw();
  }
});

// ====== START ======
function startGame(){
  document.getElementById("auth").style.display="none";
  canvas.style.display="block";
  redraw();
}