let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let W = canvas.width/5;
let H = canvas.height/5;

ctx.strokeStyle = 'black';
ctx.fillStyle = 'black';

function drawPoint(x, y) {
  //console.log(x + ";" + y);
  ctx.fillRect(x, y, 5, 5);
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < W; i++) {
    for (let j = 0; j < H; j++) {
      let count = 0;
      if (u[i][j]) count++;
      if (d[i][j]) count++;
      if (l[i][j]) count++;
      if (r[i][j]) count++;
      if (count > 0) {
        switch(count){
          case 1:
            ctx.fillStyle = "#404040";
            break;
          case 2:
            ctx.fillStyle = "#808080";
            break;
          case 3:
            ctx.fillStyle = "#bfbfbf";
            break;
          case 4:
            ctx.fillStyle = "#ffffff";
            break;
        }
        drawPoint(i*5, j*5);
      }
    }
  }
}

function createMatrix(){
  let m = [];
  for (let i = 0; i < W; i++) {
    m[i] = [];
    for (let j = 0; j < H; j++) {
      m[i][j] = false;
    }
  }
  return m;
}

let u = createMatrix();
let d = createMatrix();
let l = createMatrix();
let r = createMatrix();

// collision matrix
let K_u = createMatrix();
let K_d = createMatrix();
let K_l = createMatrix();
let K_r = createMatrix();

// initialisation
/*
d[1][2] = true;
d[3][2] = true;
d[5][2] = true;

r[4][6] = true;
r[4][7] = true;
r[4][8] = true;
r[4][9] = true;

l[8][6] = true;
l[9][7] = true;
*/
/*
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) {
    u[x][y] = Math.random() >= 0.5;
    d[x][y] = Math.random() >= 0.5;
    l[x][y] = Math.random() >= 0.5;
    r[x][y] = Math.random() >= 0.5;
  }
}

for (let x = 5; x < 15; x++) {
  for (let y = 10; y < 20; y++) {
    u[x][y] = false;
    d[x][y] = false;
    l[x][y] = false;
    r[x][y] = false;
  }
}
*/

for (let x = 0; x < W/2; x++) {
  for (let y = 0; y < H/1.5; y++) {
    u[x][y] = Math.random() >= 0.5;
    d[x][y] = Math.random() >= 0.5;
    l[x][y] = Math.random() >= 0.5;
    r[x][y] = Math.random() >= 0.5;
  }
}


//console.log(W + ";" + H);

draw();

function step() {

  // collision between particules
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
        change = (u[x][y] & d[x][y] & ~(l[x][y] | r[x][y])) |
                (l[x][y] & r[x][y] & ~(u[x][y] | d[x][y]));

        K_u[x][y] = u[x][y] ^ change;
        K_l[x][y] = l[x][y] ^ change;
        K_d[x][y] = d[x][y] ^ change;
        K_r[x][y] = r[x][y] ^ change;
    }
  }

  // collison on borders
  for (let y = 0; y < H; y++) {
    if (K_l[0][y]) {
      K_l[0][y] = false;
      K_r[0][y] = true;
    }
    if (K_r[W-1][y]) {
      K_r[W-1][y] = false;
      K_l[W-1][y] = true;
    }
  }
  for (let x = 0; x < W; x++) {
    if (K_u[x][0]) {
      K_u[x][0] = false;
      K_d[x][0] = true;
    }
    if (K_d[x][H-1]) {
      K_d[x][H-1] = false;
      K_u[x][H-1] = true;
    }
  }

  // propagation
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      if (y+1 < H) {
        u[x][y] = K_u[x][y+1];
      } else {
        u[x][y] = false;
      }
      if (y-1 >= 0){
        d[x][y] = K_d[x][y-1];
      } else {
        d[x][y] = false;
      }
      if (x+1 < W) {
        l[x][y] = K_l[x+1][y];
      } else {
        l[x][y] = false;
      }
      if (x-1 >= 0) {
        r[x][y] = K_r[x-1][y];
      } else {
        r[x][y] = false
      }
    }
  }

  // draw
  draw();

}

