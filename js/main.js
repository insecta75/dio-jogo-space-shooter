const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['../img/monster-1.png', '../img/monster-2.png', '../img/monster-3.png']; 
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
let alienInterval;

function flyShip(event) { //Movimento e tiro da nave
    if(event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if(event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    } else if(event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

function moveUp() { //Movimento de subida da nave
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); //pega valor do codigo CSS
    if(topPosition === "0px") { //se estiver na borda superior
        return; //nao acontece nada
    } else {
        let position = parseInt(topPosition);
        position -= 50; //sobe nave
        yourShip.style.top = `${position}px`;
    }
}

function moveDown() { //Movimento de descida da nave
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top'); //pega valor do codigo CSS
    if(topPosition === "500px") { //se estiver na borda inferior
        return; //nao acontece nada
    } else {
        let position = parseInt(topPosition);
        position += 50; //sobe nave
        yourShip.style.top = `${position}px`;
    }
}

function fireLaser() { //Faz a nave atirar
    let laser = createLaserElement();
    playArea.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() { //Faz o laser surge da nave
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    let newLaser = document.createElement('img');

    newLaser.src = '../img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`; //-10: faz o laser sair do meio da nave
    return newLaser; //Retorna a imagem do laser
}

function moveLaser(laser) { //Faz o laser se mover na tela
    let laserInterval = setInterval(() => { //Intervalo temporal para o tiro
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');

        aliens.forEach((alien) => { //comparando se cada inimigo foi atingido
            if(checkLaserCollision(laser, alien)) { //se sim, troca para a imagem de explosao
                alien.src = '../img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        });

        if(xPosition === 340) {
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`; //+8: a distancia de saida do tiro a frente da nave 
        }
    }, 10);
}

function createAliens() { //Cria inimigo de maneira randomica
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteia uma das 3 imagens dos inimigos
    
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '370px'; //posicao horizontal fixa
    newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`; //posicao vertical randomica de 0 a 330
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien) { //Move o inimigo em direcao ao heroi
    let moveAlienInterval = setInterval(() => {
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));

        if(xPosition <= 50) {
            if(Array.from(alien.classList).includes('dead-alien')) {
                alien.remove(); 
            } else {
                gameOver();
            } 
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

function checkLaserCollision(laser, alien) { //verifica a colisao do tiro com o inimigo
    let laserTop = parseInt(laser.style.top); //posicao do laser
    let laserLeft = parseInt(laser.style.left);
    let laserBottom = laserTop - 20; //a posicao que ainda permite a saida de um tiro

    let alienTop = parseInt(alien.style.top); //posicao do inimigo
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;

    if(laserLeft != 340 && laserLeft + 40 >= alienLeft) { //mesma posicao horizontal
        if(laserTop <= alienTop && laserTop >= alienBottom) { //mesma posicao vertical
            return true; //houve colisao
        } else {
            return false;
        }
    } else {
        return false;
    }
}

//inicio do jogo
startButton.addEventListener('click', (event) => {
    playGame();
});

function playGame() {
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';    
    window.addEventListener('keydown', flyShip); //obtem os eventos do teclado
    alienInterval = setInterval(() => {
        createAliens();
    }, 2000);
}

//fim de jogo
function gameOver() {
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => { //evita o final brusco
        alert('Game over!');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}