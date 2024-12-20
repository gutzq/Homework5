
/*
name: Ryan Gutierrez
github: gutzq
email: ryan_gutierrez@uml.student.edu
*/




const tileValues = {
    A: { count: 9, value: 1 }, 
    B: { count: 2, value: 3 }, 
    C: { count: 2, value: 3 }, 
    D: { count: 4, value: 2 }, 
    E: { count: 12, value: 1 }, 
    F: { count: 2, value: 4 }, 
    G: { count: 3, value: 2 }, 
    H: { count: 2, value: 4 }, 
    I: { count: 9, value: 1 }, 
    J: { count: 1, value: 8 }, 
    K: { count: 1, value: 5 }, 
    L: { count: 4, value: 1 }, 
    M: { count: 2, value: 3 }, 
    N: { count: 6, value: 1 }, 
    O: { count: 8, value: 1 }, 
    P: { count: 2, value: 3 }, 
    Q: { count: 1, value: 10 }, 
    R: { count: 6, value: 1 }, 
    S: { count: 4, value: 1 }, 
    T: { count: 6, value: 1 }, 
    U: { count: 4, value: 1 }, 
    V: { count: 2, value: 4 }, 
    W: { count: 2, value: 4 }, 
    X: { count: 1, value: 8 }, 
    Y: { count: 2, value: 4 }, 
    Z: { count: 1, value: 10 }
};


const boardMultipliers = [
    ["1", "1", "2W", "1", "1", "1", "2L", "1", "2L", "1", "1", "1", "2W", "1", "1"]
];

let currentScore = 0;



function restartGame() {
    $("#tileRack").empty();
    $("#scrabbleBoard").empty();

    currentScore = 0;
    $("#scoreBoard").text("Score: " + currentScore);

    createTileRack();
    createBoard();
}

$("#restartButton").click(function() {
    restartGame();
});

$("#submitWordButton").click(function() {
    submitWord();
});

function createTileRack() {
    $("#tileRack").empty(); 
    const letters = Object.keys(tileValues);

    for (let i = 0; i < 7; i++) {
        const letter = letters[Math.floor(Math.random() * letters.length)];
        const tileImage = `<img src="assets/scrabbleTiles/${letter}_TILE.jpg" class="tileImage" data-letter="${letter}">`;
        const tile = $(`<div class="tile">${tileImage}</div>`);
        
        tile.draggable({
            helper: "clone",
            start: function(event, ui) {
                ui.helper.data("letter", letter);
            }
        });
        
        $("#tileRack").append(tile);
    }
}


function createBoard() {
    const scrabbleBoard = $("#scrabbleBoard");

    for (let i = 0; i < 15; i++) {
        const square = $(`<div class="square" data-position="${i}"></div>`);

        const multiplier = boardMultipliers[0][i];  
        square.attr("data-multiplier", multiplier);

        if (multiplier === "2W") {
            square.attr("data-bonus", "2W");
        } else if (multiplier === "2L") {
            square.attr("data-bonus", "2L");
        }

        scrabbleBoard.append(square);

        square.droppable({
            accept: ".tile", 
            drop: function(event, ui) {
                const draggedLetter = ui.helper.data("letter");

                $(this).empty();

                const draggedImage = `<img src="assets/scrabbleTiles/${draggedLetter}_TILE.jpg" class="droppedTile" data-letter="${draggedLetter}">`;
                $(this).append(draggedImage);

                const multiplier = $(this).data("multiplier");
                if (multiplier === "2L") {
                    updateTileScore(draggedLetter, 2);
                } else if (multiplier === "2W") {
                    updateWordScore(draggedLetter, 2); 
                }
            }
        });
    }
}


function updateWordScore(letter, multiplier) {
    let wordScore = tileValues[letter].value * multiplier; 
    console.log(`Word Score updated: ${wordScore}`);
}

function updateTileScore(letter, multiplier) {
    let tileScore = tileValues[letter].value * multiplier;
    console.log(`Tile Score updated: ${tileScore}`);
}

function submitWord() {
    let wordScore = 0;

    $(".square").each(function() {
        const tileImage = $(this).find(".droppedTile");

        if (tileImage.length > 0) {
            const letter = tileImage.data("letter");

            if (letter && tileValues[letter]) {
                const tileValue = tileValues[letter].value;

                const multiplier = $(this).data("multiplier");

                if (multiplier === "2L") {
                    wordScore += tileValue * 2; 
                } else if (multiplier === "2W") {
                    wordScore += tileValue * 2;
                } else {
                    wordScore += tileValue; 
                }
            }
        }

        $(this).find(".droppedTile").remove();
    });


    if (wordScore > 0) {
        updateScore(wordScore);
    }

    $("#tileRack").empty();
    createTileRack(); 
}

function updateScore(points) {
    currentScore += points;
    $("#scoreBoard").text("Score: " + currentScore);
}

function calculateWordScore(tiles) {
    let wordScore = 0;
    let wordMultiplier = 1; 

    tiles.forEach(tile => {
        let letterScore = getLetterScore(tile.letter);
        let tileBonus = tile.bonus;

        if (tileBonus === "2L") {
            letterScore *= 2; 
        }

        wordScore += letterScore;

        if (tileBonus === "2W") {
            wordMultiplier *= 2;
        } 
    });

    wordScore *= wordMultiplier;

    return wordScore;
}

function getLetterScore(letter) {
    const letterScores = {
        "A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4,
        "I": 1, "J": 8, "K": 5, "L": 1, "M": 3, "N": 1, "O": 1, "P": 3,
        "Q": 10, "R": 1, "S": 1, "T": 1, "U": 1, "V": 4, "W": 4, "X": 8,
        "Y": 4, "Z": 10
    };
    return letterScores[letter.toUpperCase()] || 0;
}

createTileRack();
createBoard();
