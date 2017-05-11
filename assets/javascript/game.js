var guessWord = "";
var gameInPlay = false;
var currentWordArray = [];
var remainingGuesses = 6;
var remainingLetters = 0;
var arrayLetters = [['a',false],['b',false],['c',false],['d',false],['e',false],['f',false],['g',false],['h',false],['j',false],['k',false],['i',false],['l',false],['m',false],['n',false],['o',false],['p',false],['q',false],['r',false],['s',false],['t',false],['u',false],['v',false],['w',false],['x',false],['y',false],['z',false]];
var winCounter = 0;
var wordList = [];

function arrayToString(array) {
	var str = "";
	for (var i = 0; i<array.length; i++) {
		str = str + array[i] + " ";			
	}
	return str;
}

function chooseWord() {
	var wordArray= ['dolphin', 'horse', 'dragons', 'chickens', 'browser', 'events', 'resorted', 'frequently', 'kitchens', 'volunteers', 'pitying', 'children', 'corralled', 'teachers', 'coping', 'barely', 'apartment', 'evaded', 'landlord', 'mother', 'artisan', 'pediment', 'plater', 'populated', 'around', 'embodied', 'underneath', 'magined', 'youth', 'extreme', 'anatomy', 'gambler'];
	if (wordList.length == 0) {
		return wordArray[Math.floor(Math.random() * wordArray.length)];
	} else {
		return wordList[Math.floor(Math.random() * wordList.length)];
	}
}

function chooseWordOnline(callback) {
	var newWord = "";
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			if (request.status === 200) {
				newWord = request.responseText;
				document.body.className = 'ok';
				callback(newWord);
				console.log(newWord);
			} else {
				document.body.className = 'error';
			}
		}
	};
	request.open("GET", "http://setgetgo.com/randomword/get.php" , true);
	request.send(null);
}

function onLoad() {
	getWordDictionary(function(result) {
		wordList = result.split('\n');	
		console.log(wordList.length);
	});
}

function getWordDictionary(callback) {
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "assets/words2.txt", true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText);
            }
        }
    }
    rawFile.send(null);
}
}



function newGame() {
	//reset arrayletters (guess history) and score
	arrayLetters = [['a',false],['b',false],['c',false],['d',false],['e',false],['f',false],['g',false],['h',false],['j',false],['k',false],['i',false],['l',false],['m',false],['n',false],['o',false],['p',false],['q',false],['r',false],['s',false],['t',false],['u',false],['v',false],['w',false],['x',false],['y',false],['z',false]];
	remainingGuesses = 6;
	currentWordArray = [];
	//reset board on RHS of DOM
	updateStrikeThrough();
	guessWord = chooseWord(); 
	updatePictureFromRemainingLetters();
	// Offline version
	letters = guessWord.split(''); 
	console.log("_______________NEW GAME_______________");
	for (var i=0; i<letters.length; i++) {
		//console.log(letters[i]);
		currentWordArray[i] = "_";
		remainingLetters++;
	}
	document.getElementById("guessBox").innerHTML = arrayToString(currentWordArray);
	document.getElementById("messageBox").innerHTML = 'New word up! Take a guess!';

	//Online version using a callback (let's see if this guy goes)
	// chooseWordOnline(function(result) {
	// 	guessWord = result;	
	// 	letters = guessWord.split(''); 
	// 	remainingLetters=0;
	// 	for (var i=0; i<letters.length; i++) {
	// 		currentWordArray[i] = "_";
	// 		remainingLetters++;
	// 	}
	// 	document.getElementById("guessBox").innerHTML = arrayToString(currentWordArray);
	// 	document.getElementById("messageBox").innerHTML = 'New word up! Take a guess!';
	// });

	gameInPlay = true;
}

function updateStrikeThrough() {
	for (var i = 0; i < 26; i++) {
		if(arrayLetters[i][1]) {
			document.getElementById(arrayLetters[i][0]).innerHTML = arrayLetters[i][0].strike();
		} else {
			document.getElementById(arrayLetters[i][0]).innerHTML = arrayLetters[i][0];
		}
	}
}

function inputLetter(letter) {
	letter = letter.toLowerCase();
	if (gameInPlay) {
		var wordLength = currentWordArray.length;
		//console.log("input letter is " + letter);
		//console.log("word to guess is " + guessWord);
		var guessedAlready = false; 
		var guessIsLetter = false;
		//find letter in array by iterating through
		for (var j = 0; j<26; j++) {

			if(arrayLetters[j][0] === letter) {
				guessIsLetter = true;
				console.log("you guessed " + letter);
				//if letter has been guessed already, set guessed already to true and break, else, just break
				if (arrayLetters[j][1]) {
					guessedAlready = true;
					document.getElementById("messageBox").innerHTML = "You already guessed that!";
					break;
				} else {
					arrayLetters[j][1] = true;
					break;
				}
			}
		}
		if (!guessedAlready && guessIsLetter) {
			//update guess array on RHS
			updateStrikeThrough();
			var foundMatch = false;
			//checks against letters in word by iterating through word
			for (var i = 0; i<wordLength; i++) {
				//console.log ("checking " + letter + " against " + guessWord.charAt(i));
				if (guessWord.charAt(i) === letter) {
					remainingLetters--;
					document.getElementById("messageBox").innerHTML = "Great job! There is a(n) " + letter + ". " + remainingLetters + " letters to go.";
					//updates guess array
					currentWordArray[i] = letter;
					foundMatch = true;
					//no break here, so it can grab duplicates
				} else {

				}
			}
			if (!foundMatch) {
				remainingGuesses--;
				document.getElementById("messageBox").innerHTML = "No '" + letter + "'s in the word. " + remainingGuesses + " guesses left";
			}
		}
		if (remainingGuesses === 0) {
			document.getElementById("messageBox").innerHTML = "You Lose! Game Over. You were looking for '" + guessWord + "'. Press any key to start again!";
			gameInPlay = false;
			winCounter = 0;
		} 
		if (remainingLetters === 0) {
			document.getElementById("messageBox").innerHTML = "Congrats! You win! Press any key to start a new game";
			winCounter++;
			gameInPlay = false;
		}

		document.getElementById("guessBox").innerHTML = arrayToString(currentWordArray);
		document.getElementById("remainingLetters").innerHTML = remainingLetters;
		document.getElementById("remainingGuesses").innerHTML = remainingGuesses;
		document.getElementById("winStreak").innerHTML = winCounter;
		updatePictureFromRemainingLetters();
	} else {
		newGame();
	}
}

function updatePictureFromRemainingLetters() {
	var innerHTML = "";
	//I originally was going to use a switch, but realized I was just going to increment by 1
	innerHTML = "<img src='assets/images/Hangman-"+(6-remainingGuesses)+".png'>"
	document.getElementById("hangmanBox").innerHTML = innerHTML;
}