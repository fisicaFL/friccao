let obj;
let sliderT;
let sliderC;
//https://physics.bu.edu/~duffy/HTML5/force_motion_1D_friction.html
//https://ophysics.com/f2.html

function setup() {
  createCanvas(400, 400);

  obj = new Objeto(0,299 - 44, 11, 5)//x,y,r,m
  
  sliderT = createSlider(-40, 40, 40);
  sliderT.position(210, 10);
  sliderT.style('width', '150px');

  sliderC = createSlider(0, 1, 0.5, 0.05);
  sliderC.position(210, 60);
  sliderC.style('width', '150px');

  time_incial = Date.now();
}

let frase_vel_f = 0;

function draw() {
  let coeffStaticFriction = sliderC.value();
  let g = 9.807;

  background(220);
  
  let frase = scoreboard(obj);

  textSize(26);
  text(frase, 10 ,30);
  textSize(20);
  text("100m", 170 ,340);

  stroke("black");
  fill(color("#468fea"));
  line(0,300,width,300, 1); //100m

  noStroke();
  let maxFa = createVector(obj.mass * coeffStaticFriction * g,0);
  let fa = createVector(0,0);//newtons
  let f1 = createVector(sliderT.value(),0);//newtons
  
  if(abs(f1.x) <= abs(maxFa.x)){
    fa.x = -f1.x;
  }else{
    if(f1.x > 0){
      fa.x = -maxFa.x;
    }else{
      fa.x = maxFa.x;
    }
  }
  
  //print("f1: " + f1.x + " , fa: " + fa.x + ", maxFA: " + maxFa.x);

  sum = createVector(f1.x + fa.x,0);
  obj.applyForce(sum);

  fill(color("#468fea"));

  obj.update();
  obj.show();
  obj.edges();

  stroke("red");
  drawForce(f1, obj, 2);
  stroke("blue");
  drawForce(fa, obj, 2);
  stroke("green");
  drawForce(sum, obj, 2);

  desenharponto(obj);

  textSize(16);
  text("Força = " + f1.x + ".0 N", 240 ,45);
  textSize(16);
  text("C.e de fricção = " + coeffStaticFriction + " s", 240 ,100);
}

class Objeto {
  constructor(x, y, r, m){
    this.pos = createVector(x,y);
    this.r = 2*r;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;
  }

  applyForce(force){
    let realForce = p5.Vector.div(force, 1000);//1000 é coeficiente de relacao
    let f = p5.Vector.div(realForce, this.mass);
    this.acc = f;
  }
  
  edges(){
    if(this.pos.x >= width){
      this.pos.x = width;
      // this.vel.x *= -1;
      this.vel.x *= 0;
      return true;
    }
  }
  
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    //print("vel :" + this.vel.x);
  }


  show(){
    strokeWeight(2);
    square(this.pos.x, this.pos.y, this.r * 2);
  }
}


function desenharponto(objeto){
  //point(objeto.pos.x + objeto.pos.r, objeto.pos.y + objeto.pos.r);
  stroke("black");
  fill("black");
  ellipse(objeto.pos.x + objeto.r, objeto.pos.y + objeto.r, 5);
  noStroke();
}

function drawForce(forca,objeto, coef){
  if(forca.x < 0){
    line(objeto.pos.x + objeto.r, objeto.pos.y + objeto.r, objeto.pos.x + objeto.r + ((forca.x) * coef), objeto.pos.y + objeto.r);
    triangle(objeto.pos.x + objeto.r + (forca.x * coef) -  5, objeto.pos.y + objeto.r, objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r + 3, objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r - 3);
  }else if(forca.x > 0){
    line(objeto.pos.x + objeto.r, objeto.pos.y + objeto.r, objeto.pos.x + objeto.r + ((forca.x) * coef), objeto.pos.y + objeto.r);
    triangle(objeto.pos.x + objeto.r + (forca.x * coef) +  5, objeto.pos.y + objeto.r, objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r + 3, objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r - 3);
  }
}

function scoreboard(objeto){
  let frase = "";

  if(objeto.acc.x < 0){
    print("acc negativa");
    frase_acc = "-" + str((1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2)).toFixed(2));
  }else{
    frase_acc = str((1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2)).toFixed(2));
  }
  let i = 0;
  if(!objeto.edges()){
    //frase_time = str((sqrt(2*(objeto.pos.x / 4) / (1000 * sqrt((objeto.acc.x)**2)))).toFixed(2));
    frase_time = str(((Date.now() - time_incial) / 1000).toFixed(2));
    if(((obj.pos.x / 4).toFixed(2)) >= 99.69 && i == 0 &objeto.vel.x > 0){44
      frase_vel_f = str((objeto.vel.x * 15.81).toFixed(2));
      console.log(frase_vel_f);
    }
  }else{
    i++;
    //frase_vel_f = str((1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2) * parseFloat(frase_time)).toFixed(2)) + " m/s";
  }
  console.log(frase_vel_f);
  frase = "time: " + frase_time + " s\nacc: " + frase_acc + " m/s²\nx: " + str((obj.pos.x / 4).toFixed(2)) + " m\nvel: " + str((objeto.vel.x * 15.81).toFixed(2)) + " m/s\nvel_f: " + frase_vel_f;

  return frase;
}