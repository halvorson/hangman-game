function runme() {
	document.getElementById("guessBox").innerHTML = "Hello World!";
}

function strikeThroughX(letter) {
	console.log(letter);
	if(letter.toLowerCase() === letter) {
		document.getElementById(letter).innerHTML = letter.strike();
	} else {
		document.getElementById(letter.toLowerCase()).innerHTML = letter.toLowerCase();
	}
}