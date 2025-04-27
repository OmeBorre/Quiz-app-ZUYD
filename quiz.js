//Global variable
let COUNT = 1;
let array;
let TOTAL_QUESTIONS = 30; // Updated to 30 questions
let isProcessing = false;

// Quiz state
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10 * 60; // 10 minutes in seconds
let selectedAnswer = null;

//Main function
$(document).ready(function() {
    console.log("Quiz initialized");
    getJSON();
    result();
    let mark = 0; 
    sessionStorage.setItem("mark", mark);
    startTimer();
});

//Result function
function result() {
    let marksession = sessionStorage.getItem("mark");
    let mark1 = parseInt(marksession, 10);
    console.log("Current score:", mark1);
    $("#result").text(mark1);
    
    // Add result message based on score
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

//function to get data from json file
function getJSON() {
    $.getJSON("ques-db.json", function(json) {
        array = json;    
        getFunction();
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error loading questions:", textStatus, errorThrown);
        $("#que").text("Er is een fout opgetreden bij het laden van de vragen. Vernieuw de pagina.");
    });
}

//function to print question
function getFunction() {
    if (COUNT <= TOTAL_QUESTIONS) {
        const keys = Object.values(array);
        let randIndex = Math.floor(Math.round(Math.random() * (keys.length - 1)));
        if (randIndex == null) {
            randIndex = 0;
        } else {
            let value = keys[randIndex];
            $("#queno").text(COUNT);
            $("#que").text(value.question);
            
            // Apply word wrapping to the answer options
            $("#value1").html(wrapTextAfterWords(value.options[0], 6));
            $("#value2").html(wrapTextAfterWords(value.options[1], 6));
            $("#value3").html(wrapTextAfterWords(value.options[2], 6));
            $("#value4").html(wrapTextAfterWords(value.options[3], 6));
            
            sessionStorage.setItem("que", value.question);
            sessionStorage.setItem("ans", value.answer);
        }
    } else {
        $("#value1").attr("disabled", true);
        $("#value2").attr("disabled", true);
        $("#value3").attr("disabled", true);
        $("#value4").attr("disabled", true);
    }
    COUNT++;
}

// Function to wrap text after a certain number of words
function wrapTextAfterWords(text, wordsPerLine) {
    if (!text) return '';
    
    const words = text.split(' ');
    let result = '';
    let currentLine = '';
    let wordCount = 0;
    
    for (let i = 0; i < words.length; i++) {
        // Add the current word
        currentLine += words[i];
        wordCount++;
        
        // Add space if not the last word
        if (i < words.length - 1) {
            currentLine += ' ';
        }
        
        // If we've reached the word limit or this is the last word, add the line to the result
        if (wordCount === wordsPerLine || i === words.length - 1) {
            result += currentLine;
            
            // Add line break if not the last line
            if (i < words.length - 1) {
                result += '<br>';
            }
            
            // Reset for the next line
            currentLine = '';
            wordCount = 0;
        }
    }
    
    return result;
}

//function check answers 
function process(value) {
    // Prevent multiple clicks
    if (isProcessing) return;
    isProcessing = true;
    
    selectedValue = value.innerText;
    let ans = sessionStorage.getItem("ans");
    
    // Disable all buttons immediately
    $("#value1").attr("disabled", true);
    $("#value2").attr("disabled", true);
    $("#value3").attr("disabled", true);
    $("#value4").attr("disabled", true);
    
    if (ans == selectedValue) {
        let mark = sessionStorage.getItem("mark");
        let mark1 = parseInt(mark, 10);
        mark1++;
        sessionStorage.setItem("mark", mark1);
        
        // Visual feedback for correct answer
        value.style.backgroundColor = "#2ecc71";
        value.style.color = "white";
    } else {
        // Visual feedback for incorrect answer
        value.style.backgroundColor = "#e74c3c";
        value.style.color = "white";
    }
    
    // Show correct answer
    let correctAns = sessionStorage.getItem("ans");
    if (correctAns == $("#value1").text()) {
        $("#value1").css("backgroundColor", "#2ecc71");
        $("#value1").css("color", "white");
    } else if (correctAns == $("#value2").text()) {
        $("#value2").css("backgroundColor", "#2ecc71");
        $("#value2").css("color", "white");
    } else if (correctAns == $("#value3").text()) {
        $("#value3").css("backgroundColor", "#2ecc71");
        $("#value3").css("color", "white");
    } else if (correctAns == $("#value4").text()) {
        $("#value4").css("backgroundColor", "#2ecc71");
        $("#value4").css("color", "white");
    }
    
    // Wait 3 seconds before moving to next question
    console.log("Waiting 3 seconds before next question...");
    setTimeout(function() {
        console.log("Moving to next question");
        getFunction();
        
        // Reset button styles
        $("#value1").attr("disabled", false);
        $("#value2").attr("disabled", false);
        $("#value3").attr("disabled", false);
        $("#value4").attr("disabled", false);
        
        $("#value1").css("backgroundColor", "");
        $("#value2").css("backgroundColor", "");
        $("#value3").css("backgroundColor", "");
        $("#value4").css("backgroundColor", "");
        
        $("#value1").css("color", "");
        $("#value2").css("color", "");
        $("#value3").css("color", "");
        $("#value4").css("color", "");
        
        isProcessing = false;
    }, 2000);
}

//function to set timer
function startTimer() {
    var time_in_minutes = 10; // Changed from 15 to 10 minutes
    var current_time = Date.parse(new Date());
    var deadline = new Date(current_time + time_in_minutes * 60 * 1000);
    
    function time_remaining(endtime) {
        var t = Date.parse(endtime) - Date.parse(new Date());
        var seconds = Math.floor((t/1000) % 60);
        var minutes = Math.floor((t/1000/60) % 60);
        var hours = Math.floor((t/(1000*60*60)) % 24);
        var days = Math.floor(t/(1000*60*60*24));
        return {'total':t, 'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds};
    }

    //function to run timer
    function run_clock(id, endtime) {
        var clock = document.getElementById('timer');
        function update_clock() {
            var t = time_remaining(endtime);
            document.getElementById("timer").innerHTML = '<i class="fas fa-clock mr-2"></i> ' + 
                (t.minutes < 10 ? '0' : '') + t.minutes + ':' + 
                (t.seconds < 10 ? '0' : '') + t.seconds;

            if (t.total <= 0) {
                clearInterval(timeinterval);
                location.replace("index2.html");
            }
        }
        update_clock();
        var timeinterval = setInterval(update_clock, 1000);
    }
    run_clock('timer', deadline);
}
  




    

