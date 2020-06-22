/*------------------------------------------------------------------------------
** Description: This is the js code for the shape color matching game. This was
**              made for the 2020 beaver hackathon put on by OSU. This is part
**              of a larger web project.
**
** Notes      : A bunch of this code was referenced from past projets and
**              websites such as W3Schools and Stack overflow.
**
** Teammates  : TJ Holt, Aaron Thompson, Nicole Reynoldson, Victoria Fisher.          
**----------------------------------------------------------------------------*/
var body = document.body;
let isMouseDown = false; // Used for the click and drag feature.
let playGame = false; // Not used, but can be implimented for replayability.
let userScore = 0; 
let baddyScore = 0; // Not used but can be used for AI opponents.
let turn = 0; // keeps track of the turns.  

// This is a class Constructor for the pieces. This could have been utilized a
// lot better. Keeps track of shape and color of the pieces.
class Pieces
{
    constructor(color, shape)
    {
        this.color = color;
        this.shape = shape;
    }
}

// This specifies a number for each color and shape.
var red = 1;
var blue = 2;
var green = 3;
var yellow = 4;
var purple = 5;
var square = 6;
var circle = 7;
var triangle = 8;
var star = 9;
var cross = 10;

// This creates a bag and fills it up with 2 of every shape for every color.
var bag = [];

for(var i = 1; i < 6; i++) // for the 5 colors.
{
    for(var j = 6; j < 11; j++) // for the 5 shapes.
    {
        for(var k = 0; k < 2; k++) // for creating 2 of every shape.
        {
            bag.push(new Pieces(i,j)); // Puts the pieces in the bag.
        }
    }
}

// This initiates the game board with a bunch of empty pieces. This is for
// validation checking later on. 
var tempPiece = new Pieces;
tempPiece.color = "";
tempPiece.shape = "";
var spottySpots = [...Array(12)].map(e => Array(12).fill(tempPiece));

/*------------------------------------------------------------------------------
** Everything below is the real meat and potatoes of the whole "game".
** This first function is a check for valid placement of the pieces.  It runs
** a real basic serious of checks to make sure the adjacent pieces are either
** the same shape or same color.
**----------------------------------------------------------------------------*/
function check(item, placement)
{
    var weGood = false; // This is returned. 
    var color; // our current piece color.
    var shape; // our current piece shape. 
    
    // this searches the src and sets the color.
    if (item.src.includes("red")){color = 1;}
    else if (item.src.includes("blue")){color = 2;}
    else if (item.src.includes("green")){color = 3;}
    else if (item.src.includes("yellow")){color = 4;}
    else if (item.src.includes("purple")){color = 5;}
    
    // this searches the src and sets the shape.
    if (item.src.includes("Square")){shape = 6;}
    else if (item.src.includes("Circle")){shape = 7;}
    else if (item.src.includes("Triangle")){shape = 8;}
    else if (item.src.includes("Star")){shape = 9;}
    else if (item.src.includes("Cross")){shape = 10;}
    
    var spotCheck = placement.parentNode;

    // This takes the string (which is 2 ints separated by a space) and puts
    // them into an array for easy picking. 
    var spotCheck = spotCheck.id.split(" ");
    for(var i = 0; i < spotCheck.length; i++) { spotCheck[i] = parseInt(spotCheck[i], 10); }
    var row = spotCheck[0];
    var col = spotCheck[1];

    // all of the following are placement validation checks. If it is a valid 
    // place, it will change weGood = true. 
    if(((col + 1) < 12) && (col >= 0))
    {
        //console.log(document.getElementById(row + " " + col).childNodes[0].src);
        if (((spottySpots[row][col + 1].color == color) ||
            (spottySpots[row][col + 1].shape == shape)) && 
            (document.getElementById(row + " " + col).childNodes[0].src == ""))
        {
            weGood = true;
        }
    }
    
    if((col < 12) && ((col - 1) >= 0))
    {
        if (((spottySpots[row][col - 1].color == color) ||
            (spottySpots[row][col - 1].shape == shape)) &&
            (document.getElementById(row + " " + col).childNodes[0].src == ""))
        {
            weGood = true;
        }
    }
        
    if(((row + 1) < 12) && ((row) >= 0))
    {
        if (((spottySpots[row + 1][col].color == color) ||
            (spottySpots[row + 1][col].shape == shape)) &&
            (document.getElementById(row + " " + col).childNodes[0].src == ""))
        {
            weGood = true;
        }
    }
        
    if((row < 12) && ((row - 1) >= 0))
    {
        if (((spottySpots[row - 1][col].color == color) ||
            (spottySpots[row - 1][col].shape == shape)) &&
            (document.getElementById(row + " " + col).childNodes[0].src == ""))
        {
            weGood = true;
        } 
    }
    
    // If it is a valid position, we take the piece and we add it to the 2d
    // array called spottySpots. 
    if(weGood == true)
    {
        var tempPiece = new Pieces;
        tempPiece.color = color;
        tempPiece.shape = shape;
        spottySpots[row][col] = tempPiece;
    }
    
    return weGood;
}


/*------------------------------------------------------------------------------
** The following deal with the users input, specifically the mouse. These are 
** the functions that make the click and drag functionality work. 
**----------------------------------------------------------------------------*/
function onMouseDown(e, item)
{
    isMouseDown = true;
    e.target.style.position = "absolute"; // Notice the change of postion.
}

function onMouseMove(e, item)
{
    e.preventDefault();
    if(isMouseDown)
    {
        e.target.style.left = e.clientX -25 + "px"; // puts the center of the
        e.target.style.top = e.clientY -25 + "px";  // image roughly at your 
    }                                               // mouse pointer.
}

function onMouseUp(e, item) 
{
    var source = e.target.src; // saves the target in a variable. 
    e.target.remove(); // delets the target. 
    
    // This takes the position of the users mouse (the box where they want to
    // place their piece) and gives us the element at that location.
    var holder = document.elementFromPoint(event.clientX,event.clientY);
    
    // For deleting pieces. 
    if(holder.src.includes("trash"))
    {
        delete source;
        return;
    }
    
    if(check(item, holder)) // checks our piece and our position.
    {
        holder.src = source; // Changes the div img src.
        userScore = userScore + 3; // updates our score. 
        document.getElementById("user score").innerText = "Your Score: " + userScore;
    }
    else // If our check came back false, we cycle through our holding pin and 
    {    // put the piece back, so that it can be used again later. 
        for (var i = 0; i < 5; i++)
        {
            var spot = document.getElementById("block" + i);
            if (spot.children.length == 0)
            {
                var myImage = new Image(50,50);
                e.target.style.display = "block";
                myImage.src = e.target.src;
                myImage.addEventListener("mousedown", (e) =>
                {
                    onMouseDown(e, myImage);
                });

                myImage.addEventListener("mousemove", (e) =>
                {
                    onMouseMove(e, myImage);
                });

                myImage.addEventListener("mouseup", (e) =>
                {
                    onMouseUp(e, myImage);
                });
                
                spot.appendChild(myImage);
                e.target.remove();

                return;
            }
        }   
    }
    
    isMouseDown = false;
}

var blockContainer = document.createElement("DIV");
var rowContainer = document.createElement("DIV");
var block = document.createElement("DIV");

for(var i = 0; i < 12; i++)
{
    rowContainer = document.createElement("DIV");
    rowContainer.style.fontSize = "0";
    rowContainer.style.height = "50px";
    
    for(var j = 0; j < 12; j++)
    {
        block = document.createElement("DIV");
        block.innerText = "";
        block.style.border = "1px solid black";
        block.style.width = "50px";
        block.style.height = "50px";
        block.style.marginTop = "0px";
        //block.style.paddings = "0px";
        block.style.align = "center";
        block.style.fontSize = "37px";
        
        var myImage = new Image(50,50);
        
        block.id = i + " " + j
        //console.log(block.id);
        block.style.display = "inline-block";
        
        block.appendChild(myImage);
        rowContainer.appendChild(block);
    }
    //rowContainer.style.border = "2px solid blue";
    blockContainer.appendChild(rowContainer);
}

/*------------------------------------------------------------------------------
** The following is lot of design stuff. A lot of DOM creation of divs and 
** setting up their styles. Also appending them as children to other divs and
** eventually the body. 
**----------------------------------------------------------------------------*/
blockContainer.style.textAlign = "center";
blockContainer.style.border = "5px solid #1A237E";
blockContainer.style.boxShadow = "0px 5px 20px rgba(0, 0, 0, 0.5)";

var boardContainer = document.createElement("DIV");
boardContainer.style.display = "flex";
boardContainer.style.justifyContent = "center";

rowContainer = document.createElement("DIV");
rowContainer.style.textAlign = "center";
rowContainer.style.height = "100px";
rowContainer.style.display = "flex";
rowContainer.style.flex = "row";
rowContainer.style.paddings = "0px";
rowContainer.style.margins = "0px";
rowContainer.style.marginBottom = "10px";
rowContainer.style.marginTop = "15px";
rowContainer.style.justifyContent = "center";
rowContainer.style.overflow = "hidden";

var scoreContainer = document.createElement("DIV");
scoreContainer.style.height = "60px";
scoreContainer.style.border = "1px solid black";
scoreContainer.style.textAlign = "center";
scoreContainer.style.paddingTop = "15px";
scoreContainer.style.backgroundColor = "#1A237E";
scoreContainer.style.border = "none";
scoreContainer.style.borderRadius = "5px";
scoreContainer.style.color = "white";
scoreContainer.style.fontFamily = "Nunito, sans-serif";
scoreContainer.style.fontSize = "25px";
scoreContainer.style.textAlign = "center";
scoreContainer.style.justifyContent = "center";
scoreContainer.style.marginRight = "30px";
scoreContainer.style.marginBottom = "0px";
scoreContainer.style.paddingTop = "10px";
scoreContainer.style.paddingRight = "15px";
scoreContainer.style.paddingLeft = "15px";
scoreContainer.style.boxShadow = "0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)";

var userScoreContainer = document.createElement("DIV");
userScoreContainer.id = "user score";
userScoreContainer.style.height = "50px";
userScoreContainer.style.margin ="5px";
userScoreContainer.style.marginRight ="15px";
userScoreContainer.style.fontSize = "25px";
//userScoreContainer.style.border = "1px solid red";
userScoreContainer.style.display = "inline-block";
userScoreContainer.innerText = "Your Score: " + userScore;

var baddyScoreContainer = document.createElement("DIV");
baddyScoreContainer.id = "pieces remaining";
baddyScoreContainer.style.height = "50px";
baddyScoreContainer.style.margin = "5px";
baddyScoreContainer.style.fontSize = "25px";
baddyScoreContainer.style.display = "inline-block";
piecesRemaining = bag.length;
baddyScoreContainer.innerText = "Pieces Remaining: " + piecesRemaining;

var scoreHolder = document.createElement("DIV");
scoreHolder.style.display = "flex";
scoreHolder.style.justifyContent = "center";
scoreHolder.style.marginBottom = "15px";
scoreHolder.style.marginTop = "15px";

var nameHolder = document.createElement("DIV");
nameHolder.style.backgroundColor = "#1A237E";
nameHolder.style.border = "none";
nameHolder.style.borderRadius = "5px";
nameHolder.style.color = "white";
nameHolder.style.fontFamily = "Nunito, sans-serif";
nameHolder.innerText = "Shape and Color Match";
nameHolder.style.fontSize = "40px";
nameHolder.style.textAlign = "center";
nameHolder.style.justifyContent = "center";
nameHolder.style.marginRight = "30px";
nameHolder.style.marginBottom = "0px";
nameHolder.style.paddingTop = "13px";
nameHolder.style.paddingRight = "15px";
nameHolder.style.paddingLeft = "15px";
nameHolder.style.boxShadow = "0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)";

boardContainer.appendChild(blockContainer);
scoreHolder.appendChild(nameHolder);
scoreHolder.appendChild(scoreContainer);

scoreContainer.appendChild(userScoreContainer);
scoreContainer.appendChild(baddyScoreContainer);
body.appendChild(scoreHolder);
body.appendChild(boardContainer);
body.appendChild(rowContainer);

block = document.createElement("DIV");
block.style.width = "75px";
block.style.height = "75px";
block.style.margin = "15px";
block.style.display = "flex-box";
var myImage = new Image(75,75);
myImage.src = "color_match_images/trashCan.png";
block.appendChild(myImage);
rowContainer.appendChild(block);

// This sets up the 5 holder spots for the user to pick the pieces. 
for(var i = 0; i < 5; i++)
{
    block = document.createElement("DIV");
    block.style.border = "1px solid black";
    block.style.width = "50px";
    block.style.height = "50px";
    block.style.margin = "15px";
    block.id = "block" + i;
    block.style.display = "flex-box";
    
    rowContainer.appendChild(block);
}


// The next turn button. 
var button = document.createElement("BUTTON");
button.id = "nextBtn";
button.innerText = "Start";
button.style.backgroundColor = "#1A237E";
button.style.border = "none";
button.style.height = "50px";
button.style.width = "100px";
button.style.margin = "15px"
button.style.borderRadius = "8px";
button.style.fontSize = "20px";
button.style.color = "white";
button.style.cursor = "pointer";
button.style.boxShadow = "0 6px 10px rgba(0, 0, 0, .08)";
button.style.outline = "none";
button.onclick = nextTurn;
rowContainer.appendChild(button);

var instructHolder = document.createElement("DIV");
instructHolder.style.border = "2px solid #1A237E ";
//instructHolder.style.backgroundColor = "rgba(0, 0, 0, 0.05)"
instructHolder.style.borderRadius = "10px";
instructHolder.style.display = "flex";
instructHolder.style.justifyContent = "center";
instructHolder.style.boxShadow = "0 10px 6px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)";

var instruct = document.createElement("DIV");
instruct.style.backgroundColor = "#1A237E";
instruct.style.border = "none";
instruct.style.borderRadius = "5px";
instruct.style.color = "white";
instruct.style.fontFamily = "Nunito, sans-serif";
instruct.innerText = "How to play";
instruct.style.fontSize = "25px";
instruct.style.textAlign = "center";
instruct.style.justifyContent = "center";
instruct.style.marginBottom = "0px";
instruct.style.paddingTop = "5px";
instruct.style.paddingBottom = "5px";
instruct.style.paddingRight = "15px";
instruct.style.paddingLeft = "15px";
instruct.style.boxShadow = "0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)";

var words = "The goal is to get as many points as possible. You get points by " +
            "matching either shapes or colors. If you run into a dead end, you " +
            "can always throw your piece in the trash and get a new one. Good luck!";
var instruct2 = document.createElement("DIV");
instruct2.innerText = words;
instruct2.style.fontSize = "20px";
instruct2.style.fontFamily = "Nunito, sans-serif";
instruct2.style.width = "500px";
instruct2.style.marginLeft = "5px";

var instructHolder2 = document.createElement("DIV");
//instructHolder2.style.border = "2px solid blue";
instructHolder2.style.display = "flex";
instructHolder2.style.justifyContent = "center";

instructHolder.appendChild(instruct);
instructHolder.appendChild(instruct2);
instructHolder2.appendChild(instructHolder);

body.appendChild(instructHolder2);

/*------------------------------------------------------------------------------
** This is the function that takes pieces out of the pack and assignms them to 
** the players holder slots. It takes generates a random number between 1 and 50
** and pulls that piece out of the bag. 
**----------------------------------------------------------------------------*/
function takePiece(spot)
{
    var num = (Math.floor(Math.random() * Math.floor(bag.length)));
    var aPiece = bag[num];

    bag.splice(num,1); // pops the piece from the bag. 
    
    document.getElementById("pieces remaining").innerText = "Pieces Remaining: " + bag.length;
    
    // assigns the piece to thet image and gives it some click and drag 
    // functionality. 
    var myImage = new Image(50,50);
    myImage.addEventListener("mousedown", (e) =>
    {
        onMouseDown(e, myImage);
    });

    myImage.addEventListener("mousemove", (e) =>
    {
        onMouseMove(e, myImage);
    });

    myImage.addEventListener("mouseup", (e) =>
    {
        onMouseUp(e, myImage);
    });
    
    if(aPiece.color == red)
    {
        if(aPiece.shape == square)
        {
            myImage.src = "color_match_images/redSquare.png";
        }
     
        else if(aPiece.shape == circle)
        {
            myImage.src = "color_match_images/redCircle.png";
        }
        
        else if(aPiece.shape == triangle)
        {
            myImage.src = "color_match_images/redTriangle.png";
        }
        
        else if(aPiece.shape == star)
        {
            myImage.src = "color_match_images/redStar.png";
        }
        
        else if(aPiece.shape == cross)
        {
            myImage.src = "color_match_images/redCross.png";
        }
    }
    
    else if(aPiece.color == blue)
    {
        if(aPiece.shape == square)
        {
            myImage.src = "color_match_images/blueSquare.png";
        }
     
        else if(aPiece.shape == circle)
        {
            myImage.src = "color_match_images/blueCircle.png";
        }
        
        else if(aPiece.shape == triangle)
        {
            myImage.src = "color_match_images/blueTriangle.png";
        }
        
        else if(aPiece.shape == star)
        {
            myImage.src = "color_match_images/blueStar.png";
        }
        
        else if(aPiece.shape == cross)
        {
            myImage.src = "color_match_images/blueCross.png";
        }
    }
    
    else if(aPiece.color == green)
    {
        if(aPiece.shape == square)
        {
            myImage.src = "color_match_images/greenSquare.png";
        }
     
        else if(aPiece.shape == circle)
        {
            myImage.src = "color_match_images/greenCircle.png";
        }
        
        else if(aPiece.shape == triangle)
        {
            myImage.src = "color_match_images/greenTriangle.png";
        }
        
        else if(aPiece.shape == star)
        {
            myImage.src = "color_match_images/greenStar.png";
        }
        
        else if(aPiece.shape == cross)
        {
            myImage.src = "color_match_images/greenCross.png";
        }
    }
    
    else if(aPiece.color == yellow)
    {
        if(aPiece.shape == square)
        {
            myImage.src = "color_match_images/yellowSquare.png";
        }
     
        else if(aPiece.shape == circle)
        {
            myImage.src = "color_match_images/yellowCircle.png";
        }
        
        else if(aPiece.shape == triangle)
        {
            myImage.src = "color_match_images/yellowTriangle.png";
        }
        
        else if(aPiece.shape == star)
        {
            myImage.src = "color_match_images/yellowStar.png";
        }
        
        else if(aPiece.shape == cross)
        {
            myImage.src = "color_match_images/yellowCross.png";
        }
    }
    
    else if(aPiece.color == purple)
    {
        if(aPiece.shape == square)
        {
            myImage.src = "color_match_images/purpleSquare.png";
        }
     
        else if(aPiece.shape == circle)
        {
            myImage.src = "color_match_images/purpleCircle.png";
        }
        
        else if(aPiece.shape == triangle)
        {
            myImage.src = "color_match_images/purpleTriangle.png";
        }
        
        else if(aPiece.shape == star)
        {
            myImage.src = "color_match_images/purpleStar.png";
        }
        
        else if(aPiece.shape == cross)
        {
            myImage.src = "color_match_images/purpleCross.png";
        }
    }
    
    spot.appendChild(myImage);
}

/*------------------------------------------------------------------------------
** This checks the users holder spots and sees if there is a spot that needs to 
** be filled. If it does it called takePiece();
**----------------------------------------------------------------------------*/
function pieceCheck()
{
    for (var i = 0; i < 5; i++)
    {
        var spot = document.getElementById("block" + i);
        if (spot.children.length == 0)
        {
            takePiece(spot); // sends the spot that needs to be filled. 
        }
    }   
}

/*------------------------------------------------------------------------------
** The button that starts it all and sends us to the next turn. 
**----------------------------------------------------------------------------*/
function nextTurn()
{
    // if it is the first turn, we initialize a piece in the center of the board.
    if (turn == 0)
    {
        document.getElementById("nextBtn").innerText = "Next Turn";
        var num = (Math.floor(Math.random() * Math.floor(bag.length)));
        var aPiece = bag[num];
        bag.splice(num,1);
        
        var place = document.getElementById("5 5").childNodes[0];

        if(aPiece.color == red)
        {
            if(aPiece.shape == square)
            {
                place.src = "color_match_images/redSquare.png";
            }
         
            else if(aPiece.shape == circle)
            {
                place.src = "color_match_images/redCircle.png";
            }
            
            else if(aPiece.shape == triangle)
            {
                place.src = "color_match_images/redTriangle.png";
            }
            
            else if(aPiece.shape == star)
            {
                place.src = "color_match_images/redStar.png";
            }
            
            else if(aPiece.shape == cross)
            {
                place.src = "color_match_images/redCross.png";
            }
        }

        else if(aPiece.color == blue)
        {
            if(aPiece.shape == square)
            {
                place.src = "color_match_images/blueSquare.png";
            }
         
            else if(aPiece.shape == circle)
            {
                place.src = "color_match_images/blueCircle.png";
            }
            
            else if(aPiece.shape == triangle)
            {
                place.src = "color_match_images/blueTriangle.png";
            }
            
            else if(aPiece.shape == star)
            {
                place.src = "color_match_images/blueStar.png";
            }
            
            else if(aPiece.shape == cross)
            {
                place.src = "color_match_images/blueCross.png";
            }
        }
        
        else if(aPiece.color == green)
        {
            if(aPiece.shape == square)
            {
                place.src = "color_match_images/greenSquare.png";
            }
         
            else if(aPiece.shape == circle)
            {
                place.src = "color_match_images/greenCircle.png";
            }
            
            else if(aPiece.shape == triangle)
            {
                place.src = "color_match_images/greenTriangle.png";
            }
            
            else if(aPiece.shape == star)
            {
                place.src = "color_match_images/greenStar.png";
            }
            
            else if(aPiece.shape == cross)
            {
                place.src = "color_match_images/greenCross.png";
            }
        }
        
        else if(aPiece.color == yellow)
        {
            if(aPiece.shape == square)
            {
                place.src = "color_match_images/yellowSquare.png";
            }
         
            else if(aPiece.shape == circle)
            {
                place.src = "color_match_images/yellowCircle.png";
            }
            
            else if(aPiece.shape == triangle)
            {
                place.src = "color_match_images/yellowTriangle.png";
            }
            
            else if(aPiece.shape == star)
            {
                place.src = "color_match_images/yellowStar.png";
            }
            
            else if(aPiece.shape == cross)
            {
                place.src = "color_match_images/yellowCross.png";
            }
        }
        
        else if(aPiece.color == purple)
        {
            if(aPiece.shape == square)
            {
                myImage.src = "color_match_images/purpleSquare.png";
            }
         
            else if(aPiece.shape == circle)
            {
                myImage.src = "color_match_images/purpleCircle.png";
            }
            
            else if(aPiece.shape == triangle)
            {
                myImage.src = "color_match_images/purpleTriangle.png";
            }
            
            else if(aPiece.shape == star)
            {
                myImage.src = "color_match_images/purpleStar.png";
            }
            
            else if(aPiece.shape == cross)
            {
                myImage.src = "color_match_images/purpleCross.png";
            }
        }
        
        spottySpots[5][5] = aPiece;
    }
    
    if(bag.length > 0)
    {
        pieceCheck();
        turn++;
    }
}
