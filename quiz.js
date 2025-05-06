let COUNT = 1;
let array;
let TOTAL_QUESTIONS = 30;
let isProcessing = false;
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 10 * 60;
let startTime;
let selectedAnswer = null;
let correctAnswers = 0;
let wrongAnswers = 0;
let unansweredQuestions = 0;
let isTimerRunning = false;

$(document).ready(function() {
    getJSON();
    result();
    let mark = 0; 
    sessionStorage.setItem("mark", mark);
    
    // Start timer alleen op de quiz pagina
    if (!window.location.pathname.includes('result.html')) {
        startTimer();
    }
});

function result() {
    let marksession = sessionStorage.getItem("mark");
    let mark1 = parseInt(marksession, 10);
    $("#result").text(mark1);
    
    let resultMessage = "";
    if (mark1 >= 24) {
        resultMessage = "Uitstekend! Je hebt een zeer goede kennis van ICT!";
    } else if (mark1 >= 18) {
        resultMessage = "Goed gedaan! Je hebt een goede basiskennis van ICT.";
    } else if (mark1 >= 12) {
        resultMessage = "Niet slecht! Je kunt nog wat leren over ICT.";
    } else {
        resultMessage = "Je kunt nog veel leren over ICT. Probeer het opnieuw!";
    }
    $("#result-message").text(resultMessage);
}

function getJSON() {
    $.getJSON("ques-db.json", function(json) {
        array = json;
        questions = Object.keys(array);
        console.log("Questions loaded:", questions);
        getFunction();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error loading questions:", textStatus, errorThrown);
        $("#QuestionText").text("Er is een fout opgetreden bij het laden van de vragen. Vernieuw de pagina.");
    });
}

function getFunction() {
    if (COUNT <= TOTAL_QUESTIONS && questions.length > 0) {
        let randIndex = Math.floor(Math.random() * questions.length);
        let questionKey = questions[randIndex];
        let value = array[questionKey];
        
        console.log("Displaying question:", questionKey, value);
        
        $("#QuestionNumber").text(COUNT);
        $("#QuestionText").text(value.question);
        
        $("#answer1").text(value.options[0]);
        $("#answer2").text(value.options[1]);
        $("#answer3").text(value.options[2]);
        $("#answer4").text(value.options[3]);
        
        sessionStorage.setItem("que", value.question);
        sessionStorage.setItem("ans", value.answer);
        
        questions.splice(randIndex, 1);
    } else {
        $("#answer1").attr("disabled", true);
        $("#answer2").attr("disabled", true);
        $("#answer3").attr("disabled", true);
        $("#answer4").attr("disabled", true);
    }
    COUNT++;
}

function process(value) {
    if (isProcessing) return;
    isProcessing = true;
    
    selectedValue = value.innerText;
    let ans = sessionStorage.getItem("ans");
    
    $("#answer1").attr("disabled", true);
    $("#answer2").attr("disabled", true);
    $("#answer3").attr("disabled", true);
    $("#answer4").attr("disabled", true);
    
    if (ans == selectedValue) {
        correctAnswers++;
        score++;
        sessionStorage.setItem("mark", score);
        
        value.style.backgroundColor = "#2ecc71";
        value.style.color = "white";
    } else {
        wrongAnswers++;
        
        value.style.backgroundColor = "#e74c3c";
        value.style.color = "white";
    }
    
    let correctAns = sessionStorage.getItem("ans");
    if (correctAns == $("#answer1").text()) {
        $("#answer1").css("backgroundColor", "#2ecc71");
        $("#answer1").css("color", "white");
    } else if (correctAns == $("#answer2").text()) {
        $("#answer2").css("backgroundColor", "#2ecc71");
        $("#answer2").css("color", "white");
    } else if (correctAns == $("#answer3").text()) {
        $("#answer3").css("backgroundColor", "#2ecc71");
        $("#answer3").css("color", "white");
    } else if (correctAns == $("#answer4").text()) {
        $("#answer4").css("backgroundColor", "#2ecc71");
        $("#answer4").css("color", "white");
    }
    
    setTimeout(function() {
        getFunction();
        
        $("#answer1").attr("disabled", false);
        $("#answer2").attr("disabled", false);
        $("#answer3").attr("disabled", false);
        $("#answer4").attr("disabled", false);
        
        $("#answer1").css("backgroundColor", "");
        $("#answer2").css("backgroundColor", "");
        $("#answer3").css("backgroundColor", "");
        $("#answer4").css("backgroundColor", "");
        
        $("#answer1").css("color", "");
        $("#answer2").css("color", "");
        $("#answer3").css("color", "");
        $("#answer4").css("color", "");
        
        isProcessing = false;
    }, 2000);
}

function startTimer() {
    if (isTimerRunning) {
        return;
    }
    
    isTimerRunning = true;
    startTime = Date.now();
    timeLeft = 10 * 60;
    let timerElement = document.getElementById("time");
    
    function updateTimer() {
        if (!timerElement || !isTimerRunning) {
            return;
        }
        
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        
        timerElement.textContent = 
            (minutes < 10 ? "0" : "") + minutes + ":" + 
            (seconds < 10 ? "0" : "") + seconds;
        
        if (timeLeft <= 0) {
            stopTimer();
            saveResults();
            window.location.href = "result.html";
            return;
        }
        
        timeLeft--;
    }
    
    timer = setInterval(updateTimer, 1000);
}

function stopTimer() {
    isTimerRunning = false;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function saveResults() {
    stopTimer();
    
    // Gebruik de huidige resterende tijd
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    const totalQuestions = 30;
    unansweredQuestions = totalQuestions - (correctAnswers + wrongAnswers);
    
    const results = {
        score: correctAnswers,
        time: formattedTime,
        correct: correctAnswers,
        wrong: wrongAnswers,
        unanswered: unansweredQuestions
    };

    localStorage.setItem('quizResults', JSON.stringify(results));
}

function showResults() {
    const storedResults = localStorage.getItem('quizResults');
    
    if (!storedResults) {
        return;
    }
    
    const results = JSON.parse(storedResults);

    // Update de resultaten zonder timer
    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = results.time;
        timeElement.style.fontSize = '2.5rem';
        timeElement.style.fontWeight = 'bold';
    }

    document.getElementById('score').textContent = `${results.score}/30`;
    document.getElementById('correct').textContent = results.correct;
    document.getElementById('wrong').textContent = results.wrong;
    document.getElementById('unanswered').textContent = results.unanswered;

    // Reset alle variabelen
    correctAnswers = 0;
    wrongAnswers = 0;
    unansweredQuestions = 0;
    timeLeft = 10 * 60;
    isTimerRunning = false;
    
    localStorage.removeItem('quizResults');
}

document.addEventListener('DOMContentLoaded', function() {
    // Alleen op de quiz pagina
    if (!window.location.pathname.includes('result.html')) {
        const submitButton = document.querySelector('a[href="result.html"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                stopTimer();
                saveResults();
                window.location.href = 'result.html';
            });
        }
    } else {
        // Alleen op de resultatenpagina
        showResults();
    }
});
  




    

