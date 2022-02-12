let video;
let poseNet;
let pose;
let skeleton;
let thirtysecs;
let posesArray = ['Dancer', 'Tree', 'Triangle', 'Plank', 'Warrior I'];

let yogi;
let q;
let pose_score;
let poseLabel;
let x= true;
let s="";
let i=0;
let iteration;
let posename=" ";

//console.log(x);
showDiv('hidden_div',x);

function Buttontoggle()
{
  var t = document.getElementById("123");
  if(t.innerHTML=="practice session"){
      t.innerHTML="Modules";x=false;i=0;iteration=0}
  else{
      t.innerHTML="practice session";
    x=true;posename=" ";}
    //console.log(x);
    showDiv('hidden_div',x);
}
function showDiv(divId, element)
{
    document.getElementById(divId).style.display = element == true ? 'block' : 'none';
}

function update() {
  var select = document.getElementById('poses');
  s = select.options[select.selectedIndex].value;
console.log(s); 

}


function setup() {
  var canvas = createCanvas(640, 480);
  canvas.position(130, 210);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  
  let options = {
    inputs: 34,
    outputs: 5,
    task: 'classification',
    debug: true
  }
  
  yogi = ml5.neuralNetwork(options);
  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  };
  yogi.load(modelInfo, yogiLoaded);

  iteration=0;
}

function yogiLoaded(){
  console.log("Model ready!");
  classifyPose();
}


function classifyPose(){
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    yogi.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 1000);
  }
}

function gotResult(error, results) {
    
    //console.log(x);
  if(x==false){

    var pose_key="dtapw";
    console.log(pose_key[i]);
    posename=posesArray[i];
    if(results[0].label == pose_key[i] ){
      pose_score=results[0].confidence;
      if(pose_score>0.90 ){
       poseLabel="Great!!";
       iteration += 1;
       console.log(iteration);
       if (iteration == 40) {
        // console.log("30!")
         iteration = 0;
         nextPose();}}
      else if(pose_score>0.70)
       poseLabel="try harder!";
      else
       poseLabel="try again";
    
    }
    else{
      pose_score=0;
      poseLabel="wrong";
    }
  }
        else{
          if(results[0].label == s){
            pose_score=results[0].confidence;
            if(pose_score>0.90)
             poseLabel="Great!!";
            else if(pose_score>0.70)
             poseLabel="try harder!";
            else
             poseLabel="try again";
          }
          else{
            pose_score=0;
            poseLabel="wrong";
          }
        }
  //startTimer(thirtysecs, display);
  classifyPose();
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  translate(video.width, 0);
  scale(-1,1);
  image(video, 0, 0, video.width, video.height);
  
  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(3);
      stroke(0);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        fill(0);
        stroke(255);
        ellipse(x, y, 16, 16);
      }
  }
  pop();
  if(pose_score>0.70 && poseLabel!="wrong")
  fill(0, 100, 0);
  else
   fill(255,0,0);
  noStroke();
  textSize(60);//}
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 16);
  q=Math.round(pose_score*100);
  textSize(60);
  textAlign(CENTER, CENTER);
  text(q, 500, 200);
  text(posename,100,200);
}

function nextPose(){
if(i>=5){
  console.log("well done");
}
else{
  i+=1;
  //setTimeout(classifyPose,5000);
}
}