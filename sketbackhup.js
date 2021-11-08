let obj;
//https://physics.bu.edu/~duffy/HTML5/force_motion_1D_friction.html
//https://ophysics.com/f2.html
function setup() {
  createCanvas(400, 400);
  obj = new Objeto(0,300 - 44, 22, 5)
  time_inicial = Date.now();
}

function draw() {
  background(220);
  
  frase = scoreboard(obj);

  textSize(30);
  text(frase, 10 ,30);
  textSize(20);
  text("100m", 170 ,340);
  line(0,300,width,300, 1); //100m
  

  let f1 = createVector(20,0);//newtons
  let fa = createVector(10,0);//newtons
  // line(0,0,fa.x,fa.y);


  //obj.applyForce(f1);
  sum = p5.Vector.sub(f1,fa);
  obj.applyForce(sum);

  // obj.applyForce(fa);
  // obj.applyForce(f1);
  
  //line(50,height,width,50);
  //let gravity = createVector(0, 2);
  //obj.applyForce(gravity);
  obj.update();
  obj.show();
  obj.edges();
  //obj.edges();

  //DESENHAR FORCAS PINTADAS DRAWARROW()----------------------
  // line(obj.pos.x + obj.r, 
  //   obj.pos.y + obj.r,
  //   obj.pos.x + obj.r + (f1.x * 2),
  //   obj.pos.y + obj.r); //FORCA A SER APLICADA
  // triangle(
  //   obj.pos.x + obj.r + (f1.x * 2),
  //   obj.pos.y + obj.r,
  //   obj.pos.x + obj.r + (f1.x * 2) - 5,
  //   obj.pos.y + obj.r + 5,
  //   obj.pos.x + obj.r + (f1.x * 2) - 5,
  //   obj.pos.y + obj.r - 5); //VETOR FORCA APLICADA
  //CORRIGIR O ERRO PORQUE SO VAI ATE X=356
}


class Objeto { //PROXIMO PASSO É SIMULAR CORPO EM QUEDA LIVRE http://sahyun.net/physics/html5/NGPET_freefall/
  constructor(x, y, r, m){
    this.pos = createVector(x,y);
    this.r = r;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.mass = m;
  }

  applyForce(force){
    // let realForce = p5.Vector.div(force, 1000);//1000 é coeficiente de relacao
    // let f = p5.Vector.div(realForce, this.mass);
    // this.acc = f;
    let realForce = p5.Vector.div(force, 1000);//1000 é coeficiente de relacao
    let f = p5.Vector.div(realForce, this.mass);
    this.acc = f;
  }
  
  edges(){
    if(this.pos.x >= width - 2 * this.r){
      this.pos.x = width - 2 * this.r;
      // this.vel.x *= -1;
      this.vel.x *= 0;
      return true;
    }
  }
  
  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }


  show(){
    strokeWeight(2);
    //translate(345, 43);
    //rotate(PI / 4);
    square(this.pos.x, this.pos.y, this.r * 2);
  }
}

function scoreboard(objeto){
  frase = "";
  if(objeto.acc.x < 0){
    frase_acc = "-" + str(1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2))
  }else{
    frase_acc = str(1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2))
  }

  if(!obj.edges()){
    frase_time = str((Date.now() - time_inicial) / 1000);
  }

  frase = "time: " + frase_time + " s\nacc: " + str(1000 * sqrt((objeto.acc.x)**2 + (objeto.acc.y)**2)) + " m/s²\nx: " + str(obj.pos.x);

  return frase;
}