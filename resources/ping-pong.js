const canvas = document.getElementById('main');
const ctx = canvas.getContext('2d');

function playGame(name1, name2, totalMinute) {
    canvas.width = innerWidth - 80;
    canvas.height = innerHeight - 120;

    const user = {
        player1: {
            name: name1,
            score: 0,
            speed: 5,
            sx: 30,
            sy: (canvas.height / 2) - 50,
            ex: 30,
            ey: (canvas.height / 2) + 50
        },
        player2: {
            name: name2,
            score: 0,
            speed: 5,
            sx: canvas.width - 30,
            sy: (canvas.height / 2) - 50,
            ex: canvas.width - 30,
            ey: (canvas.height / 2) + 50
        }
    }

    const time = {
        second: 0,
        minute: 0,
        maxMinute: totalMinute
    }

    const gameController = {
        isPause: false,
        isWantExit: false,
        isRestart: false,
        isGameOver: false,
        ballReset: 0
    }

    const bowl = {
        isStart: true,
        speed: {
            cs: -1,
            max: 8,
            sx: 0,
            sy: 0
        },
        r: 10,
        x: canvas.width / 2,
        y: canvas.height / 2,
        bs: Math.floor(Math.random() * 4) + 1
    }

    const keyboard = {
        KeyW: false,
        KeyS: false,
        ArrowUp: false,
        ArrowDown: false
    }

    const rings = {
        hl: {
            sx: 0,
            ex: 0,
            sy: canvas.height,
            ey: 0,
            c: "#6F6F6F"
        },
        hr: {
            sx: canvas.width,
            sy: 0,
            ex: canvas.width,
            ey: canvas.height,
            c: "#6F6F6F"
        },
        vt: {
            sx: 15,
            sy: 0,
            ex: canvas.width - 15,
            ey: 0,
            c: "white"
        },
        vb: {
            sx: 15,
            sy: canvas.height,
            ex: canvas.width - 15,
            ey: canvas.height,
            c: "white"
        }
    }

    const square = {
        be: {
            s: 45 + 15,
            e: 90 - 45
        },
        bs: {
            s: 90 + 15,
            e: 90 + 15 + 45
        },
        ss: {
            s: 180 - 45,
            e: 180 + 90 - 45
        },
        se: {
            s: 180 + 45,
            e: 360 - 45
        }
    }

    const centerRing = {
        sx: (canvas.width / 2),
        sy: 80,
        ex: (canvas.width / 2),
        ey: canvas.height - 15
    }

    const drawBackground = () => {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }

    const drawRing = () => {
        for (const [key, value] of Object.entries(rings)) {
            ctx.beginPath();
            ctx.moveTo(value.sx, value.sy);
            ctx.lineTo(value.ex, value.ey);
            ctx.lineWidth = 20;
            ctx.strokeStyle = value.c;
            ctx.stroke();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.moveTo(centerRing.sx, centerRing.sy);
        ctx.lineTo(centerRing.ex, centerRing.ey);
        ctx.lineWidth = 15;
        ctx.setLineDash([10, 23.5]);
        ctx.strokeStyle = "white";
        ctx.stroke();
        ctx.closePath();
    }

    const drawUser = () => {
        for (const [key, value] of Object.entries(user)) {
            ctx.beginPath();
            ctx.moveTo(value.sx, value.sy);
            ctx.lineTo(value.ex, value.ey);
            ctx.setLineDash([]);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 10;
            ctx.stroke();
            ctx.closePath();
        }
    }

    const drawBall = () => {
        ctx.beginPath();
        ctx.arc(bowl.x, bowl.y, bowl.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    const drawScore = () => {
        ctx.beginPath();
        ctx.font = "80px vt323";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(user.player1.score.toString(), canvas.width / 3, 80);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.font = "80px vt323";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.fillText(user.player2.score.toString(), canvas.width - canvas.width / 3, 80);
        ctx.fill();
        ctx.closePath();
    }

    const drawTime = () => {
        ctx.beginPath();
        ctx.font = "40px vt323";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(time.minute.toString().padStart(2, '0') + ':' + time.second.toString().padStart(2, '0'), canvas.width / 2, 60);
        ctx.fill();
        ctx.closePath
    }

    const init = () => {
        drawBackground();
        drawRing();
        drawScore();
        drawTime();
        drawUser();
        drawBall();
    }

    const reset = () => {
        user.player1.sx = 30;
        user.player1.ex = 30;

        user.player2.sx = canvas.width - 30;
        user.player2.ex = canvas.width - 30;

        bowl.isStart = true;
        bowl.speed.max = 8;
        bowl.speed.cs = -1;
        bowl.speed.sx = 0;
        bowl.speed.sy = 0
        bowl.r = 10;
        bowl.x = canvas.width / 2;
        bowl.y = canvas.height / 2;
        bowl.bs = Math.floor(Math.random() * 4) + 1;

        keyboard.KeyW = false;
        keyboard.KeyS = false;
        keyboard.ArrowUp = false;
        keyboard.ArrowDown = false;
        triggerStartBowl();
    }

    document.addEventListener('keydown', function (e) {
        keyboard[e.code] = true;
        if (e.code == 'KeyR' && gameController.ballReset === 0) {
            gameController.ballReset = 6;

            bowl.isStart = true;
            bowl.speed.max = 10;
            bowl.speed.cs = -1;
            bowl.speed.sx = 0;
            bowl.speed.sy = 0
            bowl.r = 10;
            bowl.x = canvas.width / 2;
            bowl.y = canvas.height / 2;
            bowl.bs = Math.floor(Math.random() * 4) + 1;
        }
    });

    document.addEventListener('keyup', function (e) {
        keyboard[e.code] = false;
    });

    const startBowl = (angle) => {
        const radian = angle * (Math.PI / 180);

        let tpx = Math.cos(radian);
        let tpy = Math.sin(radian);

        const c = Math.sqrt(tpx * tpx + tpy * tpy);

        tpx /= c;
        tpy /= c;

        bowl.speed.sx = tpx * bowl.speed.max;
        bowl.speed.sy = tpy * bowl.speed.max;
    }

    function triggerStartBowl() {
        if (bowl.isStart) {
            setTimeout(() => {
                rings.hl.c = "#6F6F6F";
                rings.hr.c = "#6F6F6F";
            }, 150);

            if (bowl.bs === 1) {
                startBowl(Math.floor(Math.random() * (square.be.s - square.be.e) + square.be.e));
            }
            if (bowl.bs === 2) {
                startBowl(Math.floor(Math.random() * (square.bs.s - square.bs.e) + square.bs.e));
            }

            if (bowl.bs === 3) {
                startBowl(Math.floor(Math.random() * (square.ss.s - square.ss.e) + square.ss.e));
            }

            if (bowl.bs === 4) {
                startBowl(Math.floor(Math.random() * (square.se.s - square.se.e) + square.se.e));
            }
        }
    }

    const controller = () => {
        // move player
        if (keyboard.KeyW && user.player1.sy >= 20) {
            user.player1.sy -= user.player1.speed;
            user.player1.ey -= user.player1.speed;
        }

        if (keyboard.KeyS && user.player1.ey <= (rings.vb.sy - 20)) {
            user.player1.sy += user.player1.speed;
            user.player1.ey += user.player1.speed;
        }

        if (keyboard.ArrowUp && user.player2.sy >= 20) {
            user.player2.sy -= user.player2.speed;
            user.player2.ey -= user.player2.speed;
        }

        if (keyboard.ArrowDown && user.player2.ey <= (rings.vb.sy - 20)) {
            user.player2.sy += user.player2.speed;
            user.player2.ey += user.player2.speed;
        }


        // start bowl
        triggerStartBowl();

        // move bowl
        if ((bowl.y + bowl.r) >= (canvas.height - 10)) {
            bowl.speed.sy *= bowl.speed.cs;
            bowl.speed.cs += -0.0005;
        };

        if ((bowl.y + bowl.r) <= (bowl.r + 20)) {
            bowl.speed.sy *= bowl.speed.cs;
            bowl.speed.cs += -0.0005;
        };

        // if touch player
        if ((user.player1.sx + 10) >= bowl.x && bowl.y >= user.player1.sy && bowl.y <= user.player1.ey) {
            bowl.speed.sx *= bowl.speed.cs;
            bowl.speed.cs += -0.0005;
        };
        if ((user.player2.sx - 10) <= bowl.x && bowl.y >= user.player2.sy && bowl.y <= user.player2.ey) {
            bowl.speed.sx *= bowl.speed.cs;
            bowl.speed.cs += -0.0005;
        };

        // goal
        if ((bowl.x + bowl.r) >= (canvas.width - 10)) {
            rings.hr.c = "white";
            user.player1.score++;

            if (user.player1.ey - user.player1.sy >= 50) {
                user.player1.sy += 2;
                user.player1.ey -= 2;
                user.player1.speed += 0.5;
            }
            reset()
        };
        if ((bowl.x + bowl.r) <= (bowl.r + 20)) {
            rings.hl.c = "white";
            user.player2.score++;
            if (user.player2.ey - user.player2.sy >= 50) {
                user.player2.ey -= 2;
                user.player2.sy += 2;
                user.player2.speed += 0.5;
            }
            reset()
        };

        bowl.y += bowl.speed.sy;
        bowl.x += bowl.speed.sx;

        bowl.speed.sy *= 99.99 / 100;
        bowl.speed.sx *= 99.99 / 100;
        bowl.isStart = false;
    }

    setInterval(() => {
        if (!gameController.isPause) {
            time.second++;
            if (time.second >= 60) {
                time.minute++;
                time.second = 0;
            }
        }

        if (gameController.ballReset > 0) {
            gameController.ballReset -= 1;
            if (!document.getElementById('remaining')) {
                canvas.insertAdjacentHTML('afterend', `<div id='reset-ball'>Ball reset in <span id='remaining'>${gameController.ballReset}</span>s</div>`)
            } else {
                document.getElementById('remaining').innerText = gameController.ballReset;
            }
        } else {
            if (document.getElementById('remaining')) {
                document.getElementById('reset-ball').remove();
            }
        }

        // game over
        if (time.minute >= time.maxMinute) {
            gameController.isPause = true;
            gameController.isGameOver = true;
        }
    }, 1000);

    document.getElementById('pause-button').addEventListener('click', function () {
        gameController.isPause = true;
    });

    document.getElementById('exit-button').addEventListener('click', function () {
        gameController.isPause = true;
        gameController.isWantExit = true;
    });

    const handlePause = () => {
        const pause = document.createElement('div');
        pause.setAttribute('id', 'pause');
        pause.innerHTML = `
            <div class="container">
                <h1>Pause</h1>
                <div>
                    <button id="continue">Continue</button>
                    <button id="restart">Restart</button>
                </div>
            </div>
        `;
        content.append(pause);

        document.getElementById('continue').addEventListener('click', function () {
            gameController.isPause = false;
            document.getElementById('pause').remove();
            main();
        });

        document.getElementById('restart').addEventListener('click', function () {
            reset();
            user.player1.score = 0;
            user.player2.score = 0;
            time.second = 0;
            time.minute = 0;

            gameController.isPause = false;
            document.getElementById('pause').remove();
            main();
        });
    }

    const handleExit = () => {
        const pause = document.createElement('div');
        pause.setAttribute('id', 'pause');
        pause.innerHTML = `
            <div class="container">
                <h1>Are You Sure?</h1>
                    <div class='buttons'>
                        <button id="save">Save</button>
                        <button id="continue">Continue</button>
                    </div>
                    <button id="exit">Exit</button>
                </div>
            </div>
        `;
        content.append(pause);

        document.getElementById('exit').addEventListener('click', function () {
            handleExitGame();
        });

        document.getElementById('continue').addEventListener('click', function () {
            gameController.isPause = false;
            gameController.isWantExit = false;
            document.getElementById('pause').remove();
            main();
        });

        document.getElementById('save').addEventListener('click', function () {
            const toSave = {
                player1: {
                    name: user.player1.name,
                    score: user.player1.score
                },
                player2: {
                    name: user.player2.name,
                    score: user.player2.score
                },
                time: {
                    second: time.second,
                    minute: time.minute
                },
                date: new Date().toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: "numeric",
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(/\./g, ':')
            }

            const prevValue = JSON.parse(localStorage.getItem('verdi_ping_pong')) ?? [];
            prevValue.push(toSave);
            localStorage.setItem('verdi_ping_pong', JSON.stringify(
                prevValue
            ));

            document.getElementById('exit').insertAdjacentHTML('afterend', `<p id='success-save'>Successfully saved!</p>`);
            document.getElementById('save').remove();
        })
    }

    const handleGameOver = () => {
        const pause = document.createElement('div');
        pause.setAttribute('id', 'pause');
        pause.innerHTML = `
            <div class="container game-over">
                <h1>Game Over</h1>
                <h2>
                    ${
                        user.player1.score === user.player2.score ? 'Game is Draw'
                        :
                        `
                            ${user.player1.score > user.player2.score ? user.player1.name : user.player2.name}
                        ` + 'is Won!'
                    }
                </h2>
                <div class='buttons'>
                    <div>
                        <button id="save">Save</button>
                        <button id="restart">Restart</button>
                    </div>
                    <button id="back-to-home">Back To Home</button>
                </div>
            </div>
        `;
        content.append(pause);

        document.getElementById('restart').addEventListener('click', function () {
            gameController.isPause = false;
            gameController.isGameOver = false;

            reset();
            user.player1.score = 0;
            user.player2.score = 0;
            time.second = 0;
            time.minute = 0;

            gameController.isPause = false;
            document.getElementById('pause').remove();
            main();
        });

        document.getElementById('back-to-home').addEventListener('click', function () {
            handleExitGame();
        });

        document.getElementById('save').addEventListener('click', function () {
            const toSave = {
                player1: {
                    name: user.player1.name,
                    score: user.player1.score
                },
                player2: {
                    name: user.player2.name,
                    score: user.player2.score
                },
                time: {
                    second: time.second,
                    minute: time.minute
                },
                date: new Date().toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: "numeric",
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(/\./g, ':')
            }

            const prevValue = JSON.parse(localStorage.getItem('verdi_ping_pong')) ?? [];
            prevValue.push(toSave);
            localStorage.setItem('verdi_ping_pong', JSON.stringify(
                prevValue
            ));

            document.getElementById('back-to-home').insertAdjacentHTML('afterend', `<p id='success-save'>Successfully saved!</p>`);
            document.getElementById('save').remove();
        });
    }

    const main = () => {
        init();
        controller();
        if (!gameController.isPause) {
            requestAnimationFrame(main);
        } else {
            if (gameController.isWantExit) {
                handleExit();
            } else if (gameController.isGameOver) {
                handleGameOver();
            } else {
                handlePause();
            }
        }
    }

    return main();
}
document.getElementById('play').addEventListener('click', function () {
    const player1 = document.getElementById('player1').value;
    const player2 = document.getElementById('player2').value;
    const maxMinute = document.getElementById('max-minute').value;

    if (
        player1.trim() !== "" &&
        player2.trim() !== "" &&
        maxMinute.trim() !== "" &&
        player1.length <= 8 &&
        player2.length <= 8 &&
        maxMinute <= 100 &&
        maxMinute > 0
    ) {
        canvas.style.display = 'block';
        document.getElementById('content').innerHTML = `
            <div class="row">
                <button id="pause-button">Pause</button>
                <div class="name-player1">${player1}</div>
                <div class="name-player2">${player2}</div>
                <button id="exit-button">Exit</button>
            </div>
        `;
        playGame(player1, player2, maxMinute);
    }
});


function handleHistoryClick() {
    document.getElementById("show-history").addEventListener('click', function () {
        let theHistories = null;

        if (localStorage.getItem('verdi_ping_pong') && localStorage.getItem('verdi_ping_pong') !== '[]') {
            theHistories = JSON.parse(localStorage.getItem('verdi_ping_pong')).map(item => {
                return `
                <tr>
                    <td rowspan='2'>${item.date}</td>
                    <td>${item.player1.name}</td>
                    <td>${item.player1.score}</td>
                    <td rowspan='2'>${item.time.minute.toString().padStart(2, '0')}:${item.time.second.toString().padStart(2, '0')}</td>
                </tr>
                <tr>
                    <td>${item.player2.name}</td>
                    <td>${item.player2.score}</td>
                </tr>
            `;
            }).join('');
        }

        document.getElementById("history-content").setAttribute('class', 'active');
        document.getElementById("history-content").innerHTML = `
        <div id="history">
            <button id="close">x</button>
            ${theHistories ?
                `
                <h1>Game History</h1>
                <button id='clear-history'>Clear History</button>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Player</th>
                            <th>Score</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${theHistories}
                    </tbody>
                </table>`
                :
                '<p>Game history is empty</p>'
            }
        </div>
    `;

        document.getElementById('close').addEventListener('click', function () {
            document.getElementById("history-content").removeAttribute('class');
            document.getElementById('history').remove();
        });
        if(theHistories){
            document.getElementById('clear-history').addEventListener('click', function(){
                document.getElementById("history-content").innerHTML = `
                <div id="history">
                    <button id="close">x</button>
                    <p>Game history is empty</p>
                </div>
                `;
                localStorage.removeItem('verdi_ping_pong');
            });
        }
    });

}

handleHistoryClick();

function handleExitGame() {
    canvas.style.display = 'none';
    document.getElementById('content').innerHTML = `
        <div id="init-game">
            <h1>Ping Pong Game</h1>
            <div class="history-wrap">
                <button id="show-history">Show History</button>
                <div id="history-content">
                </div>
            </div>
            <div class="enter-name">
                <h3>Enter your name</h3>
                <div class="wrap-input">
                    <div>
                        <input type="text" id="player1" name="player1" placeholder="Player 1">
                        <input type="text" id="player2" name="plyer2" placeholder="Player 2">
                    </div>
                    <input type="number" id="max-minute" name="max_minute" placeholder="Max Minute">
                </div>
                <button id="play">Play</button>
            </div>
            <div class="rules-wrapper">
                <h5>Rules:</h5>
                <ol>
                    <li>The maximum name is 8 characters</li>
                    <li>The maximum minutes is 100 minutes</li>
                </ol>
                <ol id="rules">
                    <li>Player 1 on the left player 2 on the right</li>
                    <li>To control player 1 press W for up S for down</li>
                    <li>To control player 2, press Arrow Up for up, Arrow Down for down</li>
                    <li>Press R if the ball is almost close to vertical, cooldown for 5 seconds</li>
                    <li>The first ball will appear randomly</li>
                    <li>The more scores your pong size will decrease</li>
                    <li>The game will end based on the minute time you input</li>
                    <li>You can save on the exit button and when game over</li>
                </ol>
            </div>
        </div>
    `;

    handleHistoryClick();
}