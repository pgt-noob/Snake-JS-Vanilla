const startBtn = document.querySelector('.start-btn');
let snake = document.querySelectorAll('.snake');
const main = document.querySelector('.main');
const head = document.querySelector('.head');
let leftMove = 0;
let topMove = 0;
let score = 0;
let parts = [{
    id : 1,
    left : leftMove,
    top : topMove
}];
const controller = moving()

let foodLeft;
let foodTop;
startBtn.addEventListener('click',controller.turnRight)
startBtn.addEventListener('click', spawning)

function moving () {
    let timeMove;
    let prevKey;
    let currentKey;
    return {
        clear : function () {
            clearInterval(timeMove)
        },
        turnRight : function () {
            currentKey = 'ArrowRight';
            if (currentKey === prevKey || prevKey === 'ArrowLeft') {
                return
            }
            this.clear();
            timeMove = setInterval(function () {
                leftMove += 25;
                moveAnimation();
                update('left',leftMove)
                ate();
                losing();
                spawning ();
            },50);
            prevKey = 'ArrowRight'
        },
        turnLeft : function () {
            currentKey = 'ArrowLeft'
            if (currentKey === prevKey || prevKey === 'ArrowRight') {
                return
            }
            this.clear();
            timeMove = setInterval(function () {
                leftMove -= 25;
                moveAnimation();
                update('left',leftMove)
                ate()
                losing();
                spawning ();
            },50);
            prevKey = 'ArrowLeft'
        },
        turnUp : function () {
            currentKey = 'ArrowUp'
            if (currentKey === prevKey || prevKey === 'ArrowDown') {
                return
            }
            this.clear();
            timeMove = setInterval(function () {
                topMove -= 25;
                moveAnimation();
                update('top',topMove)
                ate()
                losing()
                spawning ();
            },50);
            prevKey = 'ArrowUp'
        },
        turnDown : function () {
            currentKey = 'ArrowDown'
            if (currentKey === prevKey || prevKey === 'ArrowUp') {
                return
            }
            this.clear();
            timeMove = setInterval(function () {
                topMove +=25;
                moveAnimation();
                update('top',topMove)
                ate();
                losing();
                spawning ();
            },50);
            prevKey = 'ArrowDown'
        }

    }
}

function losing () {
    parts.forEach(item => {
        if (item.id !== 1) {
            if (parts[0].left === item.left && parts[0].top === item.top){
                controller.clear();
                console.log('YOU LOSE');
                head.classList.add('disable')
            }
        }
    })
}
document.body.addEventListener('keydown', function (e) {
    if (head.matches('.disable')) {
        return
    }
    if (e.key === 'ArrowDown') {
        controller.turnDown();
    } else if (e.key ==='ArrowUp') {
        controller.turnUp();
    } else if (e.key === 'ArrowLeft') {
        controller.turnLeft();
    } else if (e.key ==='ArrowRight') {
        controller.turnRight();
    }
});

function moveAnimation () {
    // if (leftMove > 450 || topMove > 450 || topMove < 0 || leftMove < 0) {
    //     return
    // }
    if (leftMove >= 500) {
        leftMove = 0;
    }
    if (leftMove < 0) {
        leftMove = 500
    }
    if (topMove >= 500) {
        topMove = 0
    }
    if (topMove < 0) {
        topMove = 500
    }
    parts.forEach(item => {
        if (item.left >= 500) {
            item.left = 0;
        }
        if (item.left < 0) {
            item.left = 500
        }
        if (item.top >= 500) {
            item.top = 0
        }
        if (item.top < 0) {
            item.top = 500
        }
    })
    head.setAttribute('style',`left: ${leftMove}px; top: ${topMove}px`);
    const reverse = [...parts].reverse();
    reverse.forEach(item => {
        const reverseIndex = reverse.indexOf(item);
        const index = parts.indexOf(item)
        if (reverseIndex < parts.length -1 && parts.length > 1) {
            const {left,top} = reverse[reverseIndex + 1];
            parts[index].left = left;
            parts[index].top = top;
        }
    })
    snake.forEach(item => {
        const index = [...snake].indexOf(item);
        if (index > 0) {
            const {left,top} = parts[index];
            item.setAttribute('style',`left: ${left}px; top : ${top}px`)
        }
    })
};

function spawning () {
    const food = document.querySelector('.food');
    if (food) {
        return
    } else {
        let end;
        const randomLeft = (25 * Math.floor((Math.random()* 499)/50));
        const randomTop = (25 * Math.floor((Math.random()* 499)/50));
        parts.forEach(item => {
            if (randomLeft === item.left && randomTop === item.top) {
                end = true;
            }
        })
        if (end) {
            console.log('again')
            return
        }
        foodLeft = randomLeft;
        foodTop = randomTop;
        const template = `
        <div class="food" style="left: ${randomLeft}px; top: ${randomTop}px"></div>
        `
        main.insertAdjacentHTML('beforeend',template);
    }
}

function ate () {
    const food = document.querySelector('.food');
    if (topMove === foodTop && leftMove === foodLeft) {
        food.parentElement.removeChild(food);
        score+=1;
        snake = [...document.querySelectorAll('.snake')];
        const saveLeft = foodLeft;
        const saveTop = foodTop;
        setTimeout( function (){
            main.insertAdjacentHTML('beforeend',`<div class="snake" style="left: ${saveLeft}px;top: ${saveTop}px;"></div>`);
            parts.push({
                id : parts.length + 1,
                left : saveLeft,
                top : saveTop
            });
            snake = [...document.querySelectorAll('.snake')]
            console.log(parts)
        },50*(snake.length));
        
        document.querySelector('.score-board').textContent = score;
    } else {
        return;
    }
}

function update (direct,value) {
    parts[0][`${direct}`] = value
}
