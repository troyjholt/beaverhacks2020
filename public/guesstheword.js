//Variables needed globally
var words = ["abruptly","absurd","abyss","affix","askew","avenue","awkward","axiom","azure","bagpipes","bandwagon"];
var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var gameStatus = "inProgress";
var apples = []
var difficulty;
var idx;
var word;
var lives = 6;
var blanks;

// Load images for various states of the apple
for(i = 0; i <= lives; i++){
    apples[i] = "/apples/Apple" + i + ".png";
}

document.addEventListener('DOMContentLoaded', pageLoad);

// Create an anchor node that can be passed to all tabs
var anchor = document.createElement("div");
anchor.className = "wrapper";
function generateGame(){
    let ele = document.createElement("p");
    ele.id = "status";
    anchor.appendChild(ele);

    let wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    ele = document.createElement("img");
    ele.id = "apple";
    ele.setAttribute("width", "200");
    ele.setAttribute("height", "200");
    wrapper.appendChild(ele);
    anchor.appendChild(wrapper);

    ele= document.createElement("p");
    ele.id = "blanks";
    anchor.appendChild(ele);

    ele = document.createElement("div");
    ele.id = "wordpool";
    anchor.appendChild(ele);

    
    wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    ele = document.createElement("button");
    ele.id = "reset";
    ele.setAttribute("onClick","gameReset()");
    ele.appendChild(document.createTextNode("Play Again"));
    wrapper.appendChild(ele);
    anchor.appendChild(wrapper);

    document.getElementById("easy").appendChild(anchor);
    generateButtons();
}

// Generate all of the buttons for letters of the alphabet
function generateButtons(){
  let wordpool = document.getElementById("wordpool");
  
  for(letter in alphabet){
    let button = document.createElement("button");
    button.id = alphabet[letter];
    button.classList.add("alphabet");
    let text = document.createTextNode(alphabet[letter]);

    // For each button add a listener to check if the letter has been found
    button.addEventListener("click", function(){
        var found = false
        for(var i = 0; i < word.length; i++){
            if(button.id == word[i]){
                blanks[i] = button.id;
                found = true;
            }
        }

        //If found, the user should no longer be able to click it
        button.disabled = true;
        if(found == false){
            lives--;
            document.getElementById("apple").setAttribute("src", apples[lives]);
        }

        updateDisplay();

        checkGameProgress();
 
    });

    button.appendChild(text);
    wordpool.appendChild(button);
  }
}

function updateDisplay(){
    let current = "";
    for(let i = 0; i < blanks.length; i++)
        current += blanks[i] + " ";
    document.getElementById("blanks").innerHTML = current;
}

// Loads the initial anchor node containing all the game elements and generates buttons
function pageLoad(){
  	generateGame();
    gameReset();
    updateDisplay();

    // Make the how-to play page the default
    document.getElementById("defaultOpen").click();
}

// Checks whether the user has won or lost - is called every time an alphabet button is clicked
function checkGameProgress(){
    let buttons = document.getElementsByClassName("alphabet");
    
    if(blanks.join("") == word && lives > 0){
        gameStatus = "won";
        document.getElementById("status").innerHTML = "WINNER!";
    }
    if(blanks.toString() != word && lives <= 0){
        gameStatus = "lost";
        document.getElementById("status").innerHTML ="TRY AGAIN!";
    }
    if(gameStatus != "inProgress"){
        for(i in buttons)
            buttons[i].disabled = true;
    }
}

// Modified from https://www.w3schools.com/howto/howto_js_tabs.asp
// Resets the game any time a new difficulty tab is opened
// Swaps the 'anchor' node to the active tab
function openDifficulty(evt, difficulty){
	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("tabcontent");

	for(i = 0; i < tabcontent.length; i++){
		tabcontent[i].style.display="none";
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }
	tablinks = document.getElementsByClassName("tablinks");

	for(i = 0; i < tablinks.length; i++)
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	let tab = document.getElementById(difficulty);
    tab.style.display = "block";
    tab.className += " active";

    if(tab.id != "howto")
        tab.appendChild(anchor);
        gameReset();
	evt.currentTarget.className += " active";

}

// Generates a new word, resets all buttons, lives, game status.
function gameReset(){
    let buttons = document.getElementsByClassName("alphabet");
    for(i in buttons)
        buttons[i].disabled = false;

    idx = Math.floor(Math.random() * (words.length - 1 - 1));
    word = words[idx];
    lives = 6;
    document.getElementById("apple").setAttribute("src", apples[lives]);
 
    blanks = [];
    for(let i = 0; i < word.length; i++){
        blanks[i] = "_";
    }
 
    updateDisplay();

    if(gameStatus != "inProgress"){
        let status = document.getElementById("status");
        status.removeChild(status.firstChild);
        gameStatus = "inProgress";
    }
}