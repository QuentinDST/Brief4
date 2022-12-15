(function () {

    var code = [], // COMBINAISON QUE LE JOUEUR DOIT DEVINER
        guess = [], // 4 AVATARS QUE LE JOUEUR DOIT DEVINER
        choices = document.getElementsByClassName('choice'),
        inputRows = document.getElementsByClassName('guess'),
        hintContainer = document.getElementsByClassName('hint'),
        secretSockets = document.getElementsByClassName('secret case'),
        modalMessage = document.getElementById('modalMessage'),
        rowIncrement = 1,
        hintIncrement = 1,
        score = 0, 
        avatars = {
            1: 'Alex',
            2: 'kevin',
            3: 'laeticia',
            4: 'bruno',
            5: 'quentin',
            6: 'leandre'
        };

    function gameSetup() {
        generateSecretCode(1, 7);

        // AJOUTER UN ADDEVENTLISTENER SUR TOUS LES BOUTONS
        for (var i = 0; i < choices.length; i++)
            choices[i].addEventListener('click', insertGuess, false);

        document.getElementById('newGame').onclick = newGame;
        document.getElementById('delete').onclick = deleteLast;
    }

    // AJOUTER FONCTION QUI PERMET D'INSERER LES AVATARS DANS LES ROWS

    function insertGuess() {
        var self = this;
        var slots = inputRows[inputRows.length - rowIncrement].getElementsByClassName('case');

        slots[guess.length].className = slots[guess.length].className + ' avatar ' + self.id; // Insert node into page

        guess.push(+(self.value));

        if (guess.length === 4) { //
            if (compare())
                gameState('won');
            else
                rowIncrement += 1;
        }

        if (rowIncrement === inputRows.length + 1 && !compare())
            gameState('lost');
    }

    function compare() {
        var isMatch = true; //VARIABLE QUI VERIFIE SI LA CONDITION EST VRAIE OU FAUSSE
        var codeCopy = code.slice(0); // VARIALE QUI PARCOURS LA COMBINAISON SECRETE ET LA COMPARE

        // PREMIEREMENT VERIFIER SI CHAQUE AVATAR EST PRESENT DANS LA ROW ET A LA BONNE PLACE
        for (var i = 0; i < code.length; i++) {
            if (guess[i] === code[i]) {
                insertPeg('right');
                codeCopy[i] = 0;
                guess[i] = -1;
            } else
                isMatch = false;
        }

        // PUIS VERIFIER SI CHAQUE AVATAR EST PRESENT DANS LA ROW MAIS PAS A LA BONNE PLACE
        for (var j = 0; j < code.length; j++) {
            if (codeCopy.indexOf(guess[j]) !== -1) {
                insertPeg('almost');
                codeCopy[codeCopy.indexOf(guess[j])] = 0;
            }
        }

        hintIncrement += 1; // PREPARER ET INITIALISER LA ROW SUIVANTE
        guess = []; // RESET PLATEAU DE JEU

        return isMatch;
    }

    function insertPeg(type) {
        var sockets = hintContainer[hintContainer.length - hintIncrement].getElementsByClassName('hint--case');
        sockets[0].className = 'case' + type;
    }

    function deleteLast() {
        if (guess.length !== 0) {
            var slots = inputRows[inputRows.length - rowIncrement].getElementsByClassName('case');
            slots[guess.length - 1].className = 'case'; // Insert node into page
            guess.pop();
        }
    }

/*****  FONCTION NOUVEAU JEU  *****/

    function newGame() {
        guess = []; // RESET PLATEAU DE JEU
        clearBoard();
        rowIncrement = 1; // REMETTRE A 0 LA PREMIERE LIGNE DU PLATEAU DE JEU
        hintIncrement = 1; // REMETTRE A 0 LA LIGNE DES INDICES// 
        gameSetup();
    }
    
    function generateSecretCode(min, max) {
        for (var i = 0; i < 4; i++)
            code[i] = Math.floor(Math.random() * (max - min)) + min;
    }

    function clearBoard() {
        // NETTOYER TABLEAU CASES AVATAR A DEVINER
        for (var i = 0; i < inputRows.length; i++) {
            inputRows[i].innerHTML = '';
            for (var j = 0; j < 4; j++) {
                var socket = document.createElement('div');
                socket.className = 'case';
                inputRows[i].appendChild(socket);
            }
        }

        // NETTOYER CASES INDICES
        for (var i = 0; i < hintContainer.length; i++) {
            var socketCollection = hintContainer[i].getElementsByClassName('case');
            for (var j = 0; j < 4; j++) {
                socketCollection[j].className = 'hint--case case';
            }
        }

        // REMETTRE A ZERO LA COMBINAISON A DEVINER
        for (var i = 0; i < secretSockets.length; i++) {
            secretSockets[i].className = 'secret case';
            secretSockets[i].innerHTML = '?';
        }
    }

    // Once the player runs out of guesses or crack the code - the sequence is revealed
    function revealCode() {
        for (var i = 0; i < secretSockets.length; i++) {
            secretSockets[i].className += ' ' + avatars[code[i]];
            secretSockets[i].innerHTML = '';
        }
    }

    function gameOver() {
        // Disable color options
        for (var i = 0; i < choices.length; i++)
            choices[i].removeEventListener('click', insertGuess, false);
        revealCode();
    }

    gameSetup(); // LANCER LE JEU
}());