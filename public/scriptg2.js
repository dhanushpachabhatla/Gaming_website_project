window.addEventListener('load',function(){ //load event waits for all assets such as spritesheets and images to be fully loaded before it executes code in it's callback function
    const canvas= document.getElementById("canvas1");
    const ctx= canvas.getContext('2d');
    canvas.width=1400;
    canvas.height=720;
    let score=0;
    let enemies=[];
    let gameOver =false;
    const fullscreenbutton= document.getElementById('fullscreenButton');
    //all active keys to play
    class InputHandler{
        constructor(){
            this.keys=[];
            this.touchY='';
            this.touhthreshold=30;
            window.addEventListener('keydown',e =>{
                if((e.key==="ArrowDown"||e.key==="ArrowUp"||e.key==="ArrowLeft"||e.key==="ArrowRight") && this.keys.indexOf(e.key)===-1){//if the key is Arrow____ and if the key'Arrow___' is already not inside the array then e.key will be pushed to the keys array so that no repeatation occurs 
                    this.keys.push(e.key);
                }
                else if(e.key==='Enter' && gameOver){
                    restartGame();
                }
            });
            window.addEventListener('keyup',e =>{
                if(e.key==="ArrowDown"||e.key==="ArrowUp"||e.key==="ArrowLeft"||e.key==="ArrowRight"){
                    this.keys.splice(this.keys.indexOf(e.key),1);//if the key is "Arrow____" then we remove it from array using splice function
                }
            });
            window.addEventListener('touchstart',e =>{
                this.touchY =e.changedTouches[0].pageY;
            });
            window.addEventListener('touchmove',e =>{
                const swipeDistance = e.changedTouches[0].pageY-this.touchY;
                if(swipeDistance< -this.touhthreshold && this.keys.indexOf('swipe up')===-1) this.keys.push('swipe up');
                else if(swipeDistance>this.touhthreshold && this.keys.indexOf('swipe down')===-1){ 
                    this.keys.push('swipe down');
                    if(gameOver) restartGame();
            }
            });
            window.addEventListener('touchend',e =>{
                this.keys.splice(this.keys.indexOf('swipe down'),1);
                this.keys.splice(this.keys.indexOf('swipe up') ,1);
            });
        }
    }
    
    //player of the game
    
    class Player{//react to keys and update
        constructor(gameWidth,gameHeight){
            this.gamewidth=gameWidth;
            this.gameheight=gameHeight;
            this.width=200;
            this.height=200;
            this.x=0;
            this.y=gameHeight-this.height;
            this.image=document.getElementById('playerImage');
            this.frameX=0;
            this.frameY=0;
            this.maxframe=8;
            this.fps=20;
            this.frameTimer=0;
            this.frameInterval=1000/this.fps;
            this.speed=0;
            this.vy=0;//speed of y axis
            this.weight=1;
        }
        restart(){
            this.x=0;
            this.y=this.gameheight-this.height;
            this.frameY=0;
            this.maxframe=8;
        
        }
        draw(context){
            // context.strokeStyle='white';
            // context.strokeRect(this.x,this.y,this.width,this.height);
            // context.beginPath();
            // context.arc(this.x+this.width/3,this.y+this.height/3,this.width/3,0,Math.PI*2);
            // context.stroke();
            context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height);
        }
        update(input,deltatime,enemies){
            //collision
            enemies.forEach(enemy=>{
                const dx= (enemy.x+ enemy.width/5) -(this.x+this.width/5);
                const dy= (enemy.y+ enemy.height/5)-(this.y+this.height/5);
                const distance = Math.sqrt(dx*dx + dy*dy);
                if(distance<enemy.width/6+this.width/6){
                    gameOver=true;
                }
            });
            
            //sprite animation
            // if(this.frameX>=this.maxframe) this.frameX=0;
            // else this.frameX++;
            if(this.frameTimer>this.frameInterval){
                if(this.frameX>=this.maxframe) this.frameX=0;
                else this.frameX++;
                this.frameTimer=0;
            }
            else{
                this.frameTimer+=deltatime;
            }
            //controls
            if(input.keys.indexOf('ArrowRight')>-1){
                this.speed=5;
            }
            else if(input.keys.indexOf('ArrowLeft')>-1){
                this.speed=-5;
            }
            else if(((input.keys.indexOf('ArrowUp')>-1||input.keys.indexOf('swipe up')>-1 ) && this.onGround() ) ){
                // this.vy=-10;
                this.vy=-24;

            }
            else {
                this.speed=0;//it stops if you dont press anything
            }
            //horizontal movement
            this.x+=this.speed;
            if(this.x<0) this.x=0;
            else if(this.x>this.gamewidth-this.width) this.x= this.gamewidth-this.width;//so that rabbit dont escape the canvas
            //vertical movement
            this.y+=this.vy;
            if(this.y<this.height) this.y = this.height;
            if(!this.onGround()){
                this.vy+=this.weight;//to jump
                this.maxframe=5;
                this.frameY=1;
            }
            else{
                this.vy=0;
                this.maxframe=8;
                this.frameY=0;
            }
            if(this.y>this.gameheight-this.height){
                this.y=this.gameheight-this.height;
        }
    }
        onGround(){
            return this.y>=this.gameheight-this.height;
        }
    }
    
    // background of the game
    
    class Background{//endless background
        constructor(gameWidth,gameHeight){
            this.gamewidth=gameWidth;
            this.gameheight=gameHeight;
            this.image=document.getElementById('backgroundImage');
            this.x=0;
            this.y=0;
            this.width=2400;
            this.height=720;
            this.speed=6;
        }
        draw(context){
            context.drawImage(this.image,this.x,this.y,this.width,this.height);
            context.drawImage(this.image,this.x+this.width-this.speed,this.y,this.width,this.height);
        }
        update(){
            this.x-=this.speed;
            if(this.x<0-this.width) this.x=0;
        }
        restart(){
            this.x=0;
        }
    }
    
    

    //generate enemies

    class Enemy{
        constructor(gameWidth,gameHeight){
            this.gamewidth=gameWidth;
            this.gameheight=gameHeight;
            this.width=230;
            this.height=230;
            this.image=document.getElementById('enemyImage');
            this.x=gameWidth;
            this.y=this.gameheight-this.height;
            this.frameX=0;
            this.maxframe=5;
            this.fps=20;
            this.frameTimer=0;
            this.frameInterval=1000/this.fps;
            // this.speed=8;
            this.speed=Math.random()*4+8;
            this.markedfordeletion=false;
        }
        draw(context){
            // context.strokeStyle='white';
            // context.strokeRect(this.x,this.y,this.width,this.height);
            // context.beginPath();
            // context.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2);
            // context.stroke()
            // context.strokeStyle='blue';
            // context.beginPath();
            // context.arc(this.x,this.y,this.width/3,0,Math.PI*2);
            // context.stroke();
            context.drawImage(this.image,this.frameX*this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
        }
        update(deltatime){
            if(this.frameTimer>this.frameInterval){
            if(this.frameX>=this.maxframe) this.frameX=0;
            else this.frameX++;
            this.frameTimer=0;
        }
        else{
            this.frameTimer+=deltatime;
        }
        this.x-=this.speed;
        if(this.x<0-this.width){ 
            this.markedfordeletion=true;
            score++;
        }
        }
    }
    
    //multiple adding and removing of enemies
    
    function handleEnemies(deltatime){
        // if(enemyTimer>(enemyInterval+RandomenemyInterval)){
        if(enemyTimer>(Math.random()*10000+250)){
        enemies.push(new Enemy(canvas.width,canvas.height));
        enemyTimer=0;
        }
        else{
            enemyTimer+=deltatime;
        }
        enemies.forEach(enemy=>{
            enemy.draw(ctx);
            enemy.update(deltatime);
        });
        enemies= enemies.filter(enemy=>!enemy.markedfordeletion);
    }
    
    //displaying score or gamover msg
    
    function displayStatusText(context){
        context.textAlign='left';
        context.font='40px Helvetica';
        context.fillStyle='black';
        context.fillText("score : "+ score,20,50);
        context.fillStyle='white';
        context.fillText("score : "+ score,22,52);
        if(gameOver){
            context.textAlign='center';
            context.fillStyle='black';
            context.fillText("GAME OVER, press ENTER to restart! : ",canvas.width/2,200);
            context.fillStyle='white';
            context.fillText("GAME OVER, press ENTER to restart! : ",canvas.width/2+5,200+5);
        }
    }
    
    //function to restart game
    
    function restartGame(){
        player.restart();
        background.restart();
        score=0;
        enemies=[];
        gameOver =false;
        Animate(0);
    }
    
    //full screen
    
    function togglefullscreen(){
        console.log(document.fullscreenElement);
        if(!document.fullscreenElement){
            canvas.requestFullscreen().catch(err=>{
                alert(`error cant enabe full screen mode: ${err.message}`)
            });
        }
        else{
            document.exitFullscreen();
        }
    }
    fullscreenbutton.addEventListener('click',togglefullscreen);
    const input= new InputHandler();
    const player = new Player(canvas.width,canvas.height);
    const background = new Background(canvas.width,canvas.height);
    
    let lastTime=0;
    let enemyTimer=0;
    let enemyInterval=Math.random()*800+100;;//you want to add an enemey every thousnad milli second;
    // let RandomenemyInterval=Math.random()*800+400;
    let RandomenemyInterval=Math.random()*800;
    
    //animation frames
    
    function Animate(timestamp){//animating
        const deltatime= timestamp - lastTime;
        lastTime=timestamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        background.draw(ctx);
        background.update();
        player.draw(ctx);
        player.update(input,deltatime,enemies);
        handleEnemies(deltatime);
        displayStatusText(ctx)
        if(!gameOver) requestAnimationFrame(Animate);
    }
    Animate(0);
});
