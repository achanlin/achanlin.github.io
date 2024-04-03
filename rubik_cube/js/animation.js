var cube0 = $(".cube").cube({
    color: [
        "rgb(240,36,36)", // front red
        "rgb(16,150,16)", // right green
        "rgb(255,150,56)", // back orange
        "rgb(86,56,250)", // blue
        "rgb(250,250,56)", // up yellow
        "rgb(240,240,240)" // down white
    ],
    animation: {
        delay: 500
    }
});
var cube = $(".cube").data("_cube");
var options = cube.getOptions();

document.querySelector('#control').addEventListener("click", inputClick, false);

function inputClick(e) {
    options.animation.delay = 500;
    var move = e.target.value;
    cube.execute(move);
}

function runContinuously(buttonID) {
    options.animation.delay = 1000; // Adjust delay value as needed
    var move = document.getElementById(buttonID).value;
    cube.execute(move);
}

function runC(buttonID, movesString) {
    var button = document.getElementById(buttonID);
    button.disabled = true; // Disable the button to prevent multiple clicks during animation

    var movesArray = movesString.split(' '); // Convert movesString into an array of moves

    // Loop through each move in the movesArray with a delay of 1000 milliseconds between each move
    movesArray.forEach((move, index) => {
        setTimeout(() => {
            cube.execute(move);
            if (index === movesArray.length - 1) {
                button.disabled = false; // Re-enable the button after all moves are executed
            }
        }, index * 1000); // Multiply index by 1000 to create a delay of 1000 milliseconds for each move
    });
}



function getInitialStatus(buttonID) {
    options.animation.delay = 100; // Adjust delay value as needed
    var iniStatus = document.getElementById(buttonID).name;
    cube.execute(iniStatus);
}

function refresh_the_page() {
    location.reload();
}
/*
function messItUp(delay, possibleMoves) {
    var text = "";
    for (var i = 0; i < possibleMoves.length; i++) {
        var randomInt = Math.floor(Math.random() * possibleMoves.length);
        text += possibleMoves[randomInt];
        text += " ";
    }
    options.animation.delay = delay;
    cube.execute(text);
}
*/
function messItUp(){
	var possible = ["U","u","R","r","D","d","L","l","F","f","B","b","M","E","S","X","Y","Z", "U'","u'","R'","r'","D'","d'","L'","l'","F'","f'","B'","b'","M'","E'","S'","X'","Y'","Z'","U2","u2","R2","r2","D2","d2","L2","l2","F2","f2","B2","b2","M2","E2","S2","X2","Y2","Z2"];
	var text="";
	for (var i = 0; i < 10; i++) {
		var randomInt = Math.floor(Math.random() * 45);
		text +=possible[randomInt];
		text +=" ";}
	options.animation.delay = 100;	
	cube.execute(text);
}
	
function messItUpF44(){//e, m, s are two rows or columns.
	var possible = ["U","R","D","L","F","B","m","e","s","X","Y","Z", "U'","R'","D'","L'","F'","B'","m'","e'","s'","X'","Y'","Z'","U2","R2","D2","L2","F2","B2","m2","e2","s2","X2","Y2","Z2"];
	var text="";
	for (var i = 0; i < 35; i++) {
		var randomInt = Math.floor(Math.random() * 100);
		text +=possible[randomInt];
		text +=" ";}
	options.animation.delay = 100;	
	cube.execute(text);
}
