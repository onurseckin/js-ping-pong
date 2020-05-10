
let canvas;
let canvasContext;
let play;
let ballX = 1;
let ballSpeedX = 5;
let ballY = 1;
let ballSpeedY = 5;
let deltaY;

let paddle1Y = 250;
let paddle2Y = 250;
let RADIUS = 10;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 10;
let showingWinScreen = false;
function calculateMousePosition(e){
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scrollLeft;
    let mouseY = e.clientY - rect.top - root.scrollTop;
    return { x: mouseX, y: mouseY }
}
    window.onload = function(){
        canvas = document.getElementById('gameCanvas');
        canvasContext = canvas.getContext('2d');
        rectangle(0,0, canvas.width, canvas.height, 'black');
        canvasContext.fillStyle = "white";
        canvasContext.font = "50px serif";
        canvasContext.fillText("Ready!",320,230);
        let framesPerSecond = 60;
        setTimeout(()=> {
            play = setInterval(()=>{
            move();
            draw();
        }, 1000 / framesPerSecond);
        }, 1000);
        
        canvas.addEventListener('mousedown',(e)=>{
            if(showingWinScreen){
                player1Score = 0;
                player2Score = 0;
                showingWinScreen = false;
                play = setInterval(()=>{
                         move();
                         draw();
                         }, 1000 / framesPerSecond);
            }
        });
        canvas.addEventListener('mousemove',(e)=>{
            let mousePos = calculateMousePosition(e);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
        });
    }

function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
        window.clearInterval(play);
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}
function computerMovement(){
    //random number to prevent paddle shaking
    let antiShake = (PADDLE_HEIGHT*0.35); 
    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    if(paddle2YCenter < ballY - antiShake)
        paddle2Y += 6;
    else if(paddle2YCenter > ballY + antiShake)
        paddle2Y -= 6;
}
function move(){
    if(showingWinScreen) return;
    computerMovement();
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if(ballY < 0){
        ballY += RADIUS;
        ballSpeedY = -ballSpeedY;
    }
    
    if(ballY > canvas.height){
        ballY-= RADIUS;
        ballSpeedY = -ballSpeedY;
    } 


    if(ballX < 0){
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
        ballSpeedX = -ballSpeedX;
        deltaY = ballY - (1+paddle1Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
        }
        else{
            player2Score++;
            ballReset();
        }
    }
    if(ballX > canvas.width){
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
        ballSpeedX = -ballSpeedX;
        deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
        }
        else{
            player1Score++;
            ballReset();
        }
    }
}
    
function draw(){
    // next line blacks out the screen with black
    rectangle(0,0, canvas.width, canvas.height, 'black');
    
    if(showingWinScreen){
        canvasContext.fillStyle = "white";
        canvasContext.font = "20px serif";
            if(player1Score >= WINNING_SCORE){
                canvasContext.fillText("Left Player Won",350,200);
                scoreTable();
            }else if(player2Score >= WINNING_SCORE){
               canvasContext.fillText("Right Player Won",350,200); 
               scoreTable();
            }
        canvasContext.fillText("click to continue",350,300);
        return;
    }
    drawNet();
    //left player paddle
     rectangle(
    0,
    paddle1Y, 
    PADDLE_THICKNESS, 
    PADDLE_HEIGHT, 
    'white');
    // right player paddle
    rectangle(
    canvas.width-PADDLE_THICKNESS,
    paddle2Y, 
    PADDLE_THICKNESS, 
    PADDLE_HEIGHT, 
    'white');
    // next line draws the ball
    circle(ballX, ballY, RADIUS, 'white');
    //scores
    scoreTable();
    
}

function circle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}
function rectangle(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY ,width, height);
}

function drawNet(){
    for(let i=0;i<canvas.height;i+=40){
        rectangle(canvas.width/2-1,i,2,20,'white');
    }
}

function scoreTable(){
    canvasContext.font = "20px serif";
    canvasContext.fillText(player1Score,300,50);
    canvasContext.fillText(player2Score,canvas.width-300,50);
}








