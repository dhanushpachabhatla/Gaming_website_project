//background
let board;
let boardwidth = 360;
let boardheight = 640;
let context;
//bird
// let birdwidth = 34;
// let birdheight = 24;
let birdwidth = 40;
let birdheight = 30;
let birdX = boardwidth/8;
let birdY = boardheight/2;

let bird={
    x: birdX,
    y: birdY,
    width: birdwidth,
    height: birdheight
}

//pipes
let pipeArray= [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX=boardwidth;
let pipeY=0;
let score =0;
let toppipeImg;
let bottompipeImg;

//physics
let velocityX = -2;//pipes moving in left direction
let velocityY = 0;//bird jump speed
let gravity = 0.2;
let gameOver = false;

window.onload = function(){//this entire js code will be executed only after all images and styleshets are loaded
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");
    //The getContext("2d") method is typically called on an HTML <canvas> element.
    //The <canvas> element provides a container for graphics, allowing you to draw and manipulate graphics dynamically using JavaScript.
    context.fillStyle = "green";
    context.fillRect(bird.x,bird.y,bird.width,bird.height);

    //load images
    birdImage = new Image();
    // birdImage.src = "./redangrybird.png";
    birdImage.src = "./redangrybird.png";
    birdImage.onload = function(){//once birdimage load then this call back function will execute
        context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);
    }
    toppipeImg = new Image();
    toppipeImg.src = "./toppipe.png";
    bottompipeImg = new Image();
    bottompipeImg.src = "./bottompipe.png";
    requestAnimationFrame(update);
    setInterval(placePipes,800);//inbuild function which will call the placepipes function automatically for every 1.5 second
    document.addEventListener("keydown",moveBird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,board.width,board.height);
    //bird
    // bird.y += velocityY; 
    velocityY+= gravity;
    bird.y = Math.max(bird.y + velocityY,0);//apply gravity to current bird.y, limit bird.y
    context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);
    if(bird.y>boardheight){
        gameOver= true;
    }
    //pipes
    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x+= velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if( !pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5;
            pipe.passed = true;
        }
        if(detectcollission(bird,pipe)){
            gameOver= true;
        }
    }
    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift();//remove first element of array
    }
    //score
    context.fillStyle = "black";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,7,45);

    if(gameOver){
    context.fillStyle = "white";
    context.font = "45px sans-serif";
        context.fillText("GAME OVER",50,290);
    context.fillStyle = "black";
    context.font = "45px sans-serif";
        context.fillText("GAME OVER",52,290);
    context.fillStyle = "white";
    context.font = "45px sans-serif";
        context.fillText("space to restart",28,340);
    context.fillStyle = "black";
    context.font = "45px sans-serif";
        context.fillText("space to restart",30,340);
    }
}
function placePipes(){
    if(gameOver){
        return;
    }
    let randompipeY = pipeY- pipeHeight/4- Math.random()*(pipeHeight/2);
    let openingspace = board.height/4+15
    ;
    let toppipe ={
        img: toppipeImg,
        x: pipeX,
        y: randompipeY,
        width:pipeWidth,
        height:pipeHeight,
        passed : false
    }
    pipeArray.push(toppipe);
    
    let bottompipe = {
        img: bottompipeImg,
        x: pipeX,
        y: randompipeY + pipeHeight + openingspace,
        width:pipeWidth,
        height:pipeHeight,
        passed : false
    }
    pipeArray.push(bottompipe);
}

function moveBird(e){
    if(e.code == "Space" ||e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        velocityY = -6;
    }
    //reset game
    if(e.code == "Space" ){
        if(gameOver){
            bird.y = birdY;
            pipeArray=[];
            score=0;
            gameOver=false;
        }
    }

}

function detectcollission(a,b){
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y + a.height > b.y && a.y < b.height + b.y ;
}