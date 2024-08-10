function loaded(){
    const canvas= document.getElementById('canvas1');
    const ctx= canvas.getContext('2d');
    canvas.width= window.innerWidth;
    canvas.height= window.innerHeight;
    const collisionCanvas= document.getElementById('collisionCanvas');
    const collisionctx= collisionCanvas.getContext('2d');
    collisionCanvas.width= window.innerWidth;
    collisionCanvas.height= window.innerHeight;
    let gameOver= false;
    let explosions=[];
    let ravens=[];
    let timeToNextRaven=0;
    let ravenInterval=600;
    let lastTime =0;
    let score=0;
    ctx.font='50px Impact';
    class Explosions{
        constructor(x,y,size){
            this.image= new Image();
            this.image.src= "boom.png";
            this.spritewidth=200;
            this.spriteheight=179;
            this.size = size;
            this.x=x;
            this.y=y;
            this.frame=0;
            this.sound= new Audio();
            this.sound.src= "boom.wav";
            this.timesincelastframe=0;
            this.markedForDetection=false;
        }
        update(){
            if(this.frame === 0) this.sound.play()
            if(this.timesincelastframe%20==0){
                this.frame++;
                if(this.frame>5) this.markedForDetection=true;
            }
            this.timesincelastframe++;
        }
        draw(){
            ctx.drawImage(this.image,this.frame*this.spritewidth,0,this.spritewidth,this.spriteheight,this.x,this.y,this.size,this.size);
            
        }
    }
    class Raven{
        constructor(){
            this.spritewidth=268.6666666666667;//change
            this.spriteheight=170;//change
            this.sizemodifier=Math.random()*0.6+0.4
            this.width=this.spritewidth*this.sizemodifier;
            this.height=this.spriteheight*this.sizemodifier;
            this.x= canvas.width;
            this.y= Math.random()*(canvas.height-this.height)//so that there wont be any ravens half visible on screen
            this.directionX=Math.random()*2+1;//horizontal speed
            this.directionY=Math.random()*4-2;
            this.markedForDetection= false;
            this.image= new Image(); 
            this.image.src = "flipflyingm1.png";
            this.frame=0;
            this.maxframe=6;//change
            this.flapSpeed=0;
            this.randomcolors= [Math.floor(Math.random()*225),Math.floor(Math.random()*225),Math.floor(Math.random()*225)]//[red,green,blue]
            this.color='rgb(' + this.randomcolors[0]+','+this.randomcolors[1]+','+this.randomcolors[2]+')';
        }
        update(){
        this.x-=this.directionX;
        if(this.y>canvas.height-this.height){
            this.directionY=this.directionY*-1;
        }
        if(this.y<0){
            this.directionY=this.directionY*-1;
        }
        this.y-=this.directionY;
        if(this.x<0-this.width) this.markedForDetection=true;
        if(this.flapSpeed%10==0){
        if(this.frame>this.maxframe) this.frame=0;
        else this.frame++;
        }
        this.flapSpeed++;
        if(this.x<0- this.width) gameOver = true;
        }
    
        draw(){
            collisionctx.fillStyle= this.color; 
            collisionctx.fillRect(this.x,this.y,this.width,this.height);
            // ctx.fillRect(this.x,this.y,this.width,this.height);
            ctx.drawImage(this.image,this.frame*this.spritewidth,0,this.spritewidth,this.spriteheight,this.x,this.y,this.width,this.height);
        }
    }
    function drawscore(){
        ctx.fillStyle='black';
        ctx.fillText('score: '+ score,50,75);
        ctx.fillStyle='white';
        ctx.fillText('score: '+ score,50,80);//draw this at coordinate (50,75) inside the canvas
    }
    function drawGameOver(){
        ctx.textAlign='center';
        ctx.fillStyle='black';
        ctx.fillText('GAME OVER , your score is : '+ score,canvas.width/2,canvas.height/2);
        ctx.fillStyle='white';
        ctx.fillText('GAME OVER , your score is : '+ score,canvas.width/2+5,canvas.height/2+5);
        }
    
    window.addEventListener('click', function(e){
        const detectPixelColor = collisionctx.getImageData(e.x,e.y,1,1);
        console.log(detectPixelColor);
        const pc= detectPixelColor.data;
        ravens.forEach(object=>{
            if(object.randomcolors[0]==pc[0] && object.randomcolors[1]==pc[1] && object.randomcolors[2]==pc[2]){
                object.markedForDetection=true;
                score++;
                explosions.push(new Explosions(object.x,object.y,object.width));
                console.log(explosions);
            }
        });
    });
    function animate(timestamp){
        collisionctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        let deltatime= timestamp - lastTime;
        lastTime=timestamp;
        timeToNextRaven+=deltatime;
        if(timeToNextRaven>ravenInterval){
            ravens.push(new Raven());
            timeToNextRaven=0;
            ravens.sort(function(a,b){
                return a.width - b.width;
            });
        };
        drawscore();
        //the below is to concatenate two arrays so that we can use a call abck function for multiple arrays
        [...ravens,...explosions].forEach(object=>object.update());//array literal spread opeartor
        [...ravens,...explosions].forEach(object=>object.draw());//array literal spread opeartor
        ravens=ravens.filter(object=> !object.markedForDetection);//old object which left the screen will be deleated keeping the ravens array  short
        if(!gameOver) {
            requestAnimationFrame(animate);
        }
        else {
            drawGameOver();
        }
    }
    animate(0);//it wont take 0th loop.starts form 1st loop,in 0th loop timestamp is null so we wont get any ravens
}