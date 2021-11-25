let obj;
let sliderF;
let sliderC;
let img;
let start = false;
let time_incial;
//https://physics.bu.edu/~duffy/HTML5/force_motion_1D_friction.html
//https://ophysics.com/f2.html
var cnv = 0;

function setup() {
  
  cnv = createCanvas(400, 400);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
  cnv.parent('canvasDiv');

  img = loadImage('transferir.png'); 

  obj = new Objeto(0,299 - 44, 11, 1)//x,y,r,m
  
  sliderF = createSlider(-40, 40, 40);
  sliderF.position(x + 210, y + 10);
  sliderF.style('width', '150px');

  sliderC = createSlider(0, 1, 0.5, 0.05);
  sliderC.position(x + 210, y + 55);
  sliderC.style('width', '150px');

  sliderA = createSlider(0, 90, 0, 1);
  sliderA.position(x + 210, y + 100);
  sliderA.style('width', '150px');

  sliderM = createSlider(1, 10, 1); 
  sliderM.position(x + 210, y + 140);
  sliderM.style('width', '150px');

  buttonSTART = createButton('Testar');
  buttonSTART.position(x + 220, y + 190);
  buttonSTART.mousePressed(canStart);

  button = createButton('Reset');
  button.position(x + 300, y + 190);
  button.mousePressed(resetModel);

}

function canStart(){
  start = true;
  time_incial = Date.now();
}

function resetModel(){
  start = false;
  time_incial = 0;
  delete obj;
  obj = new Objeto(0,299 - 44, 11, sliderM.value());//x,y,r,m
}

let frase_vel_f = "m/s";

function test(objeto){
  textSize(20);
  var txt = "dPrevistos: time: " + str((sqrt(200/(1000 * sqrt((objeto.acc.x)**2)))).toFixed(2)) + " vel_f: " + str(((1000 * sqrt((objeto.acc.x)**2)) * (sqrt(200/(1000 * sqrt((objeto.acc.x)**2))))).toFixed(2)); 
  //text(txt, 0 ,395);
}

function draw() {
  let coeffStaticFriction = sliderC.value();
  let g = 9.807;
  background(220);
  obj.mass = sliderM.value();


  let alfaGRAUS = sliderA.value();
  let frase = scoreboard(obj);
  if(start == true){
    let frase = scoreboard(obj);
  }else{
    frase = "tempo: " + 0 + " s\nacc: " + 0 + " m/s²\nx: 0 m\nvel: 0 m/s\nvel_f: 0 m/s";
  }
  
  textSize(22);
  text(frase, 30 ,30);
  textSize(20);
  text("100m", 170 ,330);

  stroke("black");
  fill(color("#468fea"));
  line(0,300,width,300, 1); //100m

  noStroke();

  let rad = alfaGRAUS * 2 * Math.PI / 360;
  let fy = parseFloat(abs(sliderF.value() * Math.sin(parseFloat(rad))));
  let fx = parseFloat(sliderF.value() * Math.cos(parseFloat(rad))); 
  if(fx < 0.0000001 && fx > 0){
    fx = 0;
  }
  let f1 = createVector(fx,-fy);//newtons
  let peso = createVector(0, obj.mass * g);
  let normal = createVector(0, -(obj.mass * g - fy));
  var alfaMax = Math.asin(peso.y/((parseFloat(sqrt(f1.x** 2 + f1.y** 2))).toFixed(1)));
  alfaMax = parseFloat(alfaMax * 180 / Math.PI);
  
  if(normal.y > 0){
    sliderA.remove();
    sliderA = createSlider(0, 90, alfaMax, 1);
    sliderA.position((windowWidth - width) / 2 + 210, (windowHeight - height) / 2 + 100);
    sliderA.style('width', '150px');
    normal.y = 0;
  }

  console.log(alfaMax);

  let maxFa = createVector(abs(normal.y) * coeffStaticFriction,0);
  let fa = createVector(0,0);//newtons

  if(abs(f1.x) <= abs(maxFa.x)){
    fa.x = -f1.x;
  }else{
    if(f1.x > 0){
      fa.x = -maxFa.x;
    }else{
      fa.x = maxFa.x;
    }
  }

  sum = createVector((f1.x + fa.x + peso.x + normal.x).toFixed(10),f1.y + fa.y + peso.y + normal.y);
  //print(sum.x);
  obj.applyForce(sum);
  


  fill(color("#468fea"));

  if(start == true){
    obj.update();
    obj.show();
    obj.edges();
  }
  

  img.resize(44,44);
  image(img, obj.pos.x, obj.pos.y);

  strokeWeight(2);
  stroke("blue");
  drawForce(f1, obj, 1);
  stroke("red");
  drawForce(fa, obj, 1);
  stroke("black");
  drawForce(sum, obj, 1);
  stroke("green");
  drawForce(peso, obj, 1);
  stroke("yellow");
  drawForce(normal, obj, 1);

  //line(obj.pos.x + obj.r, obj.pos.y + obj.r, obj.pos.x + obj.r, obj.pos.y + obj.r + peso.y * 2);
  //stroke("black");
  //line(obj.pos.x + obj.r, obj.pos.y + obj.r, obj.pos.x + obj.r, obj.pos.y + obj.r + peso.y * 2);
  

  desenharponto(obj);

  textSize(16);
  let valforca = (parseFloat(sqrt(f1.x** 2 + f1.y** 2))).toFixed(1);
  if(f1.x < 0){
    valforca = "-" + valforca;
  }
  
  text("Força = " + valforca + " N", 240 ,45);
  textSize(16);
  text("C.e de fricção = " + coeffStaticFriction + "", 220 ,95);
  textSize(16);
  text("Alfa = " + alfaGRAUS + "º", 245 ,135);
  textSize(16);
  text("Massa = " + obj.mass.toFixed(1) + " kg", 235 ,175);

  test(obj);
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
    if(this.acc.x == 0 || (this.acc.x < 0.0001 && this.acc.x > 0)){
      this.vel.x = 0;
    }
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
    img.resize(44,44);
    image(img, this.pos.x, this.pos.y);
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
  let vForca = createVector(((forca.x) * coef), forca.y * coef);
  let r = createVector(objeto.pos.x + objeto.r, objeto.pos.y + objeto.r);

  // let pB = createVector(objeto.pos.x + objeto.r + ((forca.x) * coef), objeto.pos.y + objeto.r - ((abs(forca.y)) * coef));
  line(r.x, r.y, r.x + vForca.x, r.y + vForca.y);
  /* drawingContext.setLineDash([5, 5]);
  line(r.x, r.y, r.x + vForca.x, r.y);
  drawingContext.setLineDash([5, 5]);
  line(r.x + vForca.x, r.y, r.x + vForca.x, r.y + vForca.y);
  drawingContext.setLineDash([0, 0]); */

  /* if(forca.x < 0){
    drawingContext.setLineDash([5, 5]);
    line(pA.x, pA.y, pA.x, pB.y);
    drawingContext.setLineDash([0, 0]);
    line(pA.x, pA.y, pB.x, pB.y);
    //triangle(objeto.pos.x + objeto.r + (forca.x * coef) -  5, objeto.pos.y + objeto.r, objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r + 3, objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r - 3);
  }else if(forca.x > 0){
    drawingContext.setLineDash([5, 5]);
    line(pA.x, pA.y, pB.x, pB.y);
    drawingContext.setLineDash([0, 0]);
    line(pA.x, pA.y, pB.x, pA.y);
    //triangle(objeto.pos.x + objeto.r + (forca.x * coef) +  5, objeto.pos.y + objeto.r, objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r + 3,objeto.pos.x + objeto.r + (forca.x * coef), objeto.pos.y + objeto.r - 3);
  } */
  drawingContext.setLineDash([0, 0]);
}

function scoreboard(objeto){
  let frase = "";

  if(objeto.acc.x < 0){
    // print("acc negativa");
    frase_acc = "-" + str((1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2)).toFixed(2));
  }else{
    frase_acc = str((1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2)).toFixed(2));
  }
  let i = 0;
  if(!objeto.edges()){
    //frase_time = str((sqrt(2*(objeto.pos.x / 4) / (1000 * sqrt((objeto.acc.x)**2)))).toFixed(2));
    frase_time = str(((Date.now() - time_incial) / 1000).toFixed(2));
    if(((obj.pos.x / 4).toFixed(2)) >= 99.69 && i == 0 &objeto.vel.x > 0){44
      frase_vel_f = str((objeto.vel.x * 15.81).toFixed(2)) + " m/s";
      //console.log(frase_vel_f);
    }
  }else{
    i++;
    //frase_vel_f = str((1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2) * parseFloat(frase_time)).toFixed(2)) + " m/s";
  }
  //console.log(frase_vel_f);
  frase = "time: " + frase_time + " s\nacc: " + frase_acc + " m/s²\nx: " + str((obj.pos.x / 4).toFixed(2)) + " m\nvel: " + str((objeto.vel.x * 15.81).toFixed(2)) + " m/s\nvel_f: " + frase_vel_f;

  return frase;
}