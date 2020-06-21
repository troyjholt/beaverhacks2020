//Variables needed globally
var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var gameStatus = "inProgress";
var apples = []
var diff = easy;
var idx;
var word;
var lives = 6;
var blanks;

// Load images for various states of the apple
for(i = 0; i <= lives; i++){
    apples[i] = "apples/apple" + i + ".png";
}

document.addEventListener('DOMContentLoaded', pageLoad);

// Create an anchor node that can be passed to all tabs
var anchor = document.createElement("div");
anchor.className = "wrapper";
function generateGame(){
    let ele = document.createElement("p");
    ele.id = "status";
    ele.innerHTML = " ";
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
        document.getElementById("status").innerHTML = "The word was <b>" + word + "</b>. Better luck next time!";
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
    tab.style.display = "inline-block";
    tab.className += " active";

    if(tab.id != "howto")
        tab.appendChild(anchor);
        diff = difficulty
        gameReset();
	evt.currentTarget.className += " active";

}

// Generates a new word, resets all buttons, lives, game status.
function gameReset(){
    let buttons = document.getElementsByClassName("alphabet");
    for(i in buttons)
        buttons[i].disabled = false;

    if(diff == 'easy'){
        idx = Math.floor(Math.random() * (easy.length - 1 - 1));
        word = easy[idx];
    }
    else if(diff == 'medium'){
        idx = Math.floor(Math.random() * (medium.length - 1 - 1));
        word = medium[idx];
    }
    else{
        idx = Math.floor(Math.random() * (hard.length - 1 - 1));
        word = hard[idx];
    }

    lives = 6;
    document.getElementById("apple").setAttribute("src", apples[lives]);
 
    blanks = [];
    for(let i = 0; i < word.length; i++){
        blanks[i] = "_";
    }
 
    updateDisplay();

    if(gameStatus != "inProgress"){
        document.getElementById("status").innerHTML = "     ";
        //status.removeChild(status.firstChild);
        gameStatus = "inProgress";
    }
}


var hard = ["abruptly", "absurd", "abyss", "affix", "askew", "avenue", "awkward", "axiom", "azure", "bagpipes", 
            "bandwagon", "banjo", "bayou", "beekeeper", "bikini", "blitz", "blizzard", "boggle", "bookworm", 
            "boxcar", "boxful", "buckaroo", "buffalo", "buffoon", "buxom", "buzzard", "buzzing", "buzzwords", 
            "caliph", "cobweb", "cockiness", "croquet", "crypt", "curacao", "cycle", "daiquiri", "dirndl", 
            "disavow", "dizzying", "duplex", "dwarves", "embezzle", "equip", "espionage", "euouae", "exodus", 
            "faking", "fishhook", "fixable", "fjord", "flapjack", "flopping", "fluffiness", "flyby", "foxglove",
            "frazzled", "frizzled", "fuchsia", "funny", "gabby", "galaxy", "galvanize", "gazebo", "giaour", "gizmo", 
            "glowworm", "glyph", "gnarly", "gnostic", "gossip", "grogginess", "haiku", "haphazard", "hyphen", 
            "iatrogenic", "icebox", "injury", "ivory", "ivy", "jackpot", "jaundice", "jawbreaker", "jaywalk", 
            "jazziest", "jazzy", "jelly", "jigsaw", "jinx", "jiujitsu", "jockey", "jogging", "joking", "jovial", 
            "joyful", "juicy", "jukebox", "jumbo", "kayak", "kazoo", "keyhole", "khaki", "kilobyte", "kiosk", 
            "kitsch", "kiwifruit", "klutz", "knapsack", "larynx", "lengths", "lucky", "luxury", "lymph", "marquis", 
            "matrix", "megahertz", "microwave", "mnemonic", "mystify", "naphtha", "nightclub", "nowadays", "numbskull", 
            "nymph", "onyx", "ovary", "oxidize", "oxygen", "pajama", "peekaboo", "phlegm", "pixel", "pizazz", 
            "pneumonia", "polka", "pshaw", "psyche", "puppy", "puzzling", "quartz", "queue", "quips", "quixotic", 
            "quiz", "quizzes", "quorum", "razzmatazz", "rhubarb", "rhythm", "rickshaw", "schnapps", "scratch", "shiv", 
            "snazzy", "sphinx", "spritz", "squawk", "staff", "strength", "strengths", "stretch", "stronghold", 
            "stymied", "subway", "swivel", "syndrome", "thriftless", "thumbscrew", "topaz", "transcript", "transgress", 
            "transplant", "triphthong", "twelfth", "twelfths", "unknown", "unworthy", "unzip", "uptown", "vaporize", 
            "vixen", "vodka", "voodoo", "vortex", "voyeurism", "walkway", "waltz", "wave", "wavy", "waxy", 
            "wellspring", "wheezy", "whiskey", "whizzing", "whomever", "wimpy", "witchcraft", "wizard", "woozy", 
            "wristwatch", "wyvern", "xylophone", "yachtsman", "yippee", "yoked", "youthful", "yummy", "zephyr", 
            "zigzag", "zigzagging", "zilch", "zipper", "zodiac", "zombie"];

var medium = ["activity", "afterthought", "apartment", "appoint", "approve", "beginner", "boundary", "breathe", 
              "calendar", "caption", "clothe", "colony", "competition", "concern", "condition", "creature", 
              "crouton", "currency", "cycle", "devotion", "disguise", "dishonest", "distance", "disuse", "eager", 
              "education", "exist", "famous", "feather", "feature", "fiction", "fragile", "friction", "grateful", 
              "guardian", "household", "increase", "industry", "invention", "junction", "junior", "lawyer", 
              "management", "mayor", "meanwhile", "memorable", "mention", "metal", "mightily", "minister", "nature", 
              "neither", "option", "pardon", "passenger", "pickle", "picture", "pleasure", "popular", "proceed", 
              "produce", "professor", "property", "quartet", "reason", "recess", "reduce", "reduction", "reply", 
              "route", "scene", "scent", "stolen", "supporter", "sweater", "teachable", "televise", "though", 
              "thread", "tidal", "triple", "victory", "volcano", "wealth", "weather", "weird", "wilderness", "wrist"]

var easy = ["able", "aftermath", "afternoon", "appear", "attack", "attend", "breakfast", "brightly", "cabbage", 
            "cable", "carpenter", "channel", "circle", "climb", "comfort", "comical", "confirm", "construct", 
            "curtain", "customer", "damage", "decide", "delight", "disappear", "discover", "empty", "encourage", 
            "entertain", "equal", "exactly", "forever", "fruit", "fuel", "group", "guard", "guest", "guide", "guitar", 
            "handle", "health", "heart", "heavily", "helmet", "idea", "kindness", "level", "locket", "lumber", "magic", 
            "melon", "meter", "money", "motor", "mountain", "partner", "perfect", "perhaps", "personal", "plastic", 
            "pocket", "protect", "provide", "railway", "record", "reward", "shoulder", "socket", "stranger", "stroll", 
            "subject", "suit", "supply", "temper", "theatre", "total", "toward", "treatment", "useful", "vacant", 
            "windy", "writer"]