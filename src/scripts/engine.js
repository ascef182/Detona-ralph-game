const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-left"),
        score: document.querySelector("#score"),
        lives: document.querySelector(".menu-lives h2"),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentLives: 3,
        currentTime: 60,
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    },
};

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        endGame();
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);
    audio.volume = 0.2;
    audio.play();
}

function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = null;
                playSound("hit");
            } else {
                // Perde uma vida se errar
                loseLife();
            }
        });
    });
}

function loseLife() {
    state.values.currentLives--;
    state.values.currentLives = Math.max(state.values.currentLives, 0); // Garante que o número de vidas não seja negativo
    state.view.lives.textContent = `x${state.values.currentLives}`;

    if (state.values.currentLives === 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    let restart = confirm("Game Over! O seu resultado foi: " + state.values.result + "\nDeseja reiniciar o jogo?");
    if (restart) {
        resetGame();
    }
}

function resetGame() {
    state.values.currentLives = 3;
    state.values.currentTime = 60;
    state.values.result = 0;
    state.view.lives.textContent = `x${state.values.currentLives}`;
    state.view.score.textContent = state.values.result;
    state.view.timeLeft.textContent = state.values.currentTime;

    // Reiniciar os timers
    state.actions.timerId = setInterval(randomSquare, 1000);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function initialize() {
    resetGame(); // Adiciona essa chamada para iniciar o jogo
    addListenerHitBox();
}

initialize();
