let url = 'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple';

startBtn =  document.querySelector('#play');
highScroreBtn =  document.querySelector('#high-score');


let scores = JSON.parse(localStorage.getItem('scores'));

var questionClassArray =[];
var playerClassArray = [];
var globalQuesdata;

mainContainer = document.querySelector('#main-container');

class ChoiceText {
    constructor(q,correctAnswer, wrongAnswer){
        this.q = q;
        this.correctAnswer =correctAnswer;
        this.options = [correctAnswer,...wrongAnswer];
    }
}

class Player {
    constructor(name,score){
        this.name = '';
        this.score = 0;
    }
}

var questionCount = {
    'count': 1,
};


randomize = (array) => {
    for (var i = array.length-1; i>0; i--){
        var j = Math.floor(Math.random() * (i+1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

checkanswer = (questionObject, selectedOption) => {
    if (selectedOption === questionObject.correctAnswer){
        tempPlayer.score += 10;
        questionCount.count = questionCount.count + 1;
    } else {
        questionCount.count = questionCount.count + 1;
    }

    if (questionCount.count<=10){
        console.log('i am here')
        console.log(questionCount);
        displayHTML(questionClassArray[questionCount.count - 1], tempPlayer, questionCount.count);
    } else {
        endGame();
    }

    console.log(tempPlayer);
}



displayHTML = (questionObject, player) =>{

    let sequence = [0,1,2,3]
    randomize(sequence);
    console.log(sequence)

    console.log('hh', questionObject);
    mainContainer.innerHTML =  `     <div class="row h-100 align-items-center">` +
`    <div class="col-sm-12 col-lg-6 offset-lg-3 display-col">` +
`        <div class="row">`+
`            <div class="col-6">`+
`            <p>Question ${questionCount.count}/10</p>`+
`           <div class="progress w-50">`+
`                <div class="progress-bar my-progress-bar" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" id="prog-inner-bar"></div>`+
`            </div>`+
`            </div>`+
`           <div class="col-6 display-score">`+
`            <p>Score</p>`+
`            <p>${player.score}</p>`+
`            </div>`+
`        </div>`+
`        <div class="row">`+
`            <div class="col-12">`+
`            <p class="question"> ${questionObject.q}</p>`+
`            <p class="option-p"><button class="btn btn-primary option-btn" value = "${questionObject.options[sequence[0]]}">A</button>${questionObject.options[sequence[0]]}</p>`+
`            <p class="option-p"><button class="btn btn-primary option-btn" value = "${questionObject.options[sequence[1]]}">B</button>${questionObject.options[sequence[1]]}</p>`+
`            <p class="option-p"><button class="btn btn-primary option-btn" value = "${questionObject.options[sequence[2]]}">C</button>${questionObject.options[sequence[2]]}</p>`+
`            <p class="option-p"><button class="btn btn-primary option-btn" value = "${questionObject.options[sequence[3]]}">D</button>${questionObject.options[sequence[3]]}</p>`+
`            </div>`+
`        </div>`+
`    </div>`+
`</div>`

    document.getElementById('prog-inner-bar').style.width = String(questionCount.count * 10)+'%';

    optionBtns = document.querySelectorAll('.option-btn').forEach((btn) => {
        btn.addEventListener('click' ,(e)=> {
            console.log(e.target.value);
            checkanswer(questionObject,e.target.value);
        })
    })

}

endGame = () => {

    mainContainer.innerHTML = `    <div class="row h-50 align-items-center">`+
    `        <div class="col-sm-12 col-lg-6 offset-lg-3 final-col">`+
    `            <h4> ${tempPlayer.score}</h4>`+
    `            <form action="index.html" id = "myform">`+
    `                <label for="username"></label>`+
    `                <input type="text" name="username" id="username" placeholder ="username">`+
    `                <small class = "errormessage" id="errormessage">To save, please enter username</small>`+
    `                <button type="submit" class="btn btn-primary w-100 end-button disabled" id="saveScroeBtn">Save</button>`+
    `            </form>`+
    `            <a href="index.html"><button class="btn btn-primary w-100 end-button" id="goHome">Home</button></a>`+
    `            <button class="btn btn-primary w-100 end-button" id="playAgain">Play Again</button>`+
    `        </div>`+
    `    </div>`

    playAgainBtn=document.getElementById('playAgain');
    playAgainBtn.addEventListener('click', () => {
        startGame(url);
    })

    document.getElementById('myform').addEventListener('submit', (e)=>{
        myFormValidation(e);
    })

    input = document.getElementById('username');
    saveScroeBtn= document.getElementById('saveScroeBtn');
    input.addEventListener('input' ,()=> {
        console.log(input.value);
        if (input.value !== ""){
            saveScroeBtn.classList.remove('disabled');

        } else if (input.value === ""){

            saveScroeBtn.classList.remove('disabled');

        }        
    })

}

myFormValidation = (e) => {
    input = document.getElementById('username');
    errorMessage = document.getElementById('errormessage');

    if (input.value === '' || input.value === null ){
        e.preventDefault();
        console.log(e);
        console.log(tempPlayer)
        input.style.border ="solid 2px red";
        errorMessage.style.visibility = 'visible';

    } else {
        tempPlayer.name = input.value;
        if (scores === null){
            scores = [];
            scores.push(tempPlayer);
        }else {
            scores.push(tempPlayer);
        }
        localStorage.setItem('scores', JSON.stringify(scores));
    }

}


displayHighScore = () => {

    let scores = JSON.parse(localStorage.getItem('scores'));
    arrayPlayer = [], arrayScores = [];
    for (var x of scores){
        arrayPlayer.push(x.name);
        arrayScores.push(x.score);
    }
    maxScore = Math.max(...arrayScores);
    console.log(maxScore, arrayScores.indexOf(maxScore), arrayPlayer[arrayScores.indexOf(maxScore)]);
    document.getElementById('score').innerHTML =  `The highest score is ${maxScore} and was scored by ${arrayPlayer[arrayScores.indexOf(maxScore)]}`

}


async function startGame (url) {
    let res =  await fetch(url);
    globalQuesdata = await res.json();

    globalQuesdata.results.forEach((v) => {
        questionClassArray.push(new ChoiceText(v.question, v.correct_answer, v.incorrect_answers))
    });

    tempPlayer = new Player();
    console.log(tempPlayer);
    console.log(questionClassArray);

    questionCount.count = 1;
    console.log(questionCount);

    displayHTML(questionClassArray[questionCount.count - 1], tempPlayer);

}
    

startBtn.addEventListener('click', ()=>{
    startGame(url);
})

highScroreBtn.addEventListener('click', displayHighScore);