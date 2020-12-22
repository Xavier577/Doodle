const gameBoard = document.querySelector('#game-board')

const startBtn = document.querySelector('#start-btn')

const doodler = document.createElement('div')

// Variables
let platformList = []
let platformCount = 5
let startPoint = 150
let doodlerBottomSpace = startPoint
let doodlerLeftSpace = 50
let score = 0;
let isJumping = true;
let upTimerId
let downTimerId
let isGoingLeft = false
let isGoingRight = false
let leftTimerId
let rightTimerId
let isGameOver = false


class Platform {
    constructor(platformBottom){
        this.left = Math.random() * 285
        this.bottom = platformBottom
        this.platformVisible = document.createElement('div')
        let platformVisible = this.platformVisible
        platformVisible.classList.add('platform')
        platformVisible.style.left = this.left + 'px'
        platformVisible.style.bottom = this.bottom + 'px'
        gameBoard.appendChild(platformVisible)
    }
}


function createDoodler() {
    
    doodler.classList.add('doodler')
    gameBoard.appendChild(doodler);
    //position of doodler
    doodlerLeftSpace = platformList[0].left
    doodler.style.left = doodlerLeftSpace + 'px'
    doodler.style.bottom = doodlerBottomSpace + 'px'
    // add sound effect for playing game
}

function createPlatforms() {
    for( let i = 0; i < platformCount; i++) {
        let platformGap = 600 / 5
        let platformBottom = 100 + i * platformGap
        let newPlatform = new Platform(platformBottom)
        platformList.push(newPlatform)
        

    }
}

function movePlatforms() {
    if(doodlerBottomSpace > 200) {
        platformList.forEach(platform => {
            platform.bottom -= 4 //this the object
            let platformVisible = platform.platformVisible
            platformVisible.style.bottom = platform.bottom + 'px'

            if(platform.bottom < 10) {
                let firstPlatform = platformList[0].platformVisible
                firstPlatform.classList.remove('platform') //becomes invisible
                platformList.shift()
                score++
                let newPlatform = new Platform(600)
                platformList.push(newPlatform)
            }
        })
    }
}

function fall() {
    isJumping = false
    clearInterval(upTimerId)
    downTimerId = setInterval(function() {
        doodlerBottomSpace -= 5
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if(doodlerBottomSpace <= 0) {
            gameOver()
        }
        platformList.forEach( platform => {
            if((doodlerBottomSpace >= platform.bottom) &&
                (doodlerBottomSpace <= (platform.bottom + 15)) &&
                ((doodlerLeftSpace + 60 ) >= platform.left) &&
                (doodlerLeftSpace <= (platform.left + 85)) &&
                !isJumping
            ) {
                startPoint = doodlerBottomSpace
                jump()
                isJumping = true
            }
        })
    }, 20)
}

function jump() {
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval( function() {
        doodlerBottomSpace += 20
        doodler.style.bottom = doodlerBottomSpace + 'px'
        if (doodlerBottomSpace > (startPoint + 200)){
            fall()
            isJumping = false
        }
    }, 30)
}

function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(function () {
        if (doodlerLeftSpace >= 0) {
            clearInterval(rightTimerId)
            doodlerLeftSpace -=5
            doodler.style.left = doodlerLeftSpace + 'px'
        } else{ moveRight() } 
    },20)
    clearInterval(rightTimerId)
}

function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(function () {
      //changed to 313 to fit doodle image
    if(doodlerLeftSpace <= 313) {
        clearInterval(leftTimerId)
        console.log('going right')
        doodlerLeftSpace +=5
        doodler.style.left = doodlerLeftSpace + 'px'
    } else {moveLeft()}
    },20)
    clearInterval(leftTimerId)
}


function moveStraight() {
    isGoingLeft = false
    isGoingRight = false
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
}

 //assign functions to keyCodes
function control(e) {
    doodler.style.bottom = doodlerBottomSpace + 'px'
    if(e.key === 'ArrowLeft') {
    moveLeft()
    clearInterval(rightTimerId)
    } else if (e.key === 'ArrowRight') {
    moveRight()
    clearInterval(leftTimerId)
    } else if (e.key === 'ArrowUp') {
    moveStraight()
    }
}

function gameOver() {
    isGameOver = true
    while (gameBoard.firstChild) {
    
    gameBoard.removeChild(gameBoard.firstChild)
    }
    // grid.innerHTML = score *Display score*
    clearInterval(upTimerId)
    clearInterval(downTimerId)
    clearInterval(leftTimerId)
    clearInterval(rightTimerId)
}

function start() {
    if (!isGameOver) {
        createPlatforms()
        createDoodler()
        setInterval(movePlatforms,30)
        jump(startPoint)
        document.addEventListener('keyup', control)
    } 
}



startBtn.addEventListener('click', start)
