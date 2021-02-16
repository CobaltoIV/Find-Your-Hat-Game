const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const directions = ['u', 'd', 'r', 'l'];

class Field {
    constructor(field) {
        this._field = field;
        this._position = [0, 0]
    }

    get field() { return this._field }

    get position() { return this._position }

    set position(newPosition) { this._position = newPosition; }
    print() {
        console.log();
        const f = this.field;

        f.forEach(row => {
            console.log(row.join(''));
        })

    }

    static generateField(width, height, holes) {
        let row = [];
        let field = [];
        for (let c = 0; c < width; c++)
            row.push(fieldCharacter);

        for (let r = 0; r < height; r++)
            field.push([...row]);

        field[0][0] = pathCharacter;

        if (holes >= 0.5) throw Error('Please insert a number between 0 and 0.5 as the percentage of holes');

        const numberOfHoles = Math.floor(width * height * holes);

        for (let i = 0; i < numberOfHoles; i++) {

            let holePosition = [];
            do {
                holePosition = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
            } while (field[holePosition[0]][holePosition[1]] != fieldCharacter);

            field[holePosition[0]][holePosition[1]] = hole;
        }
        let hatPosition = [];
        do {
            hatPosition = [Math.floor(Math.random() * height), Math.floor(Math.random() * width)];
        } while (field[hatPosition[0]][hatPosition[1]] != fieldCharacter);

        field[hatPosition[0]][hatPosition[1]] = hat;

        return field

    }
}


function setupInstructions() {
    console.log(`In this game your objective is to find the hat (represented with ^).
Every turn you can choose to move in 4 directions: u-up, d-down, r-right, l-left.
Be careful to not fall in a hole (represented with O) or go out of the field!`)
}

function play(myfield) {
    let c = 0;
    // Ask for a direction to play
    do {
        let play = '';
        do {
            play = prompt('In which direction do you want to move? - ');
        } while (!directions.includes(play)); // If command is not valid repeat the question

        // verifies position is within height limits
        const verifyHeight = (h, field) => field.length >= h && h >= 0;
        // verifies position is within width limits
        const verifyWidth = (w, field) => field[0].length >= w && w >= 0;
        // verifies position is on a hole
        const verifyHole = (pos, field) => {
            try {
                return field[pos[0]][pos[1]] == hole;
            } catch (e) {
                return true // If an error occurs we want the movement to be invalid
            }
        };
        // verifies position is on a hat
        const verifyHat = (pos, field) => field[pos[0]][pos[1]] == hat;

        // verifies the result of a valid movement
        const verifyValidMovement = function(pos, myfield) {

            if (verifyHat(pos, myfield.field)) {
                console.log('You Win');
                return true;
            } else {
                myfield.position = pos;
                myfield.field[pos[0]][pos[1]] = pathCharacter;
                return false;
            }
        }

        let newPosition;

        switch (play) {
            case 'u':
                newPosition = myfield.position.slice();
                newPosition[0] -= 1;
                if (verifyHeight(newPosition[0], myfield.field) && !verifyHole(newPosition, myfield.field)) {
                    if (verifyValidMovement(newPosition, myField)) return;
                } else {
                    console.log('You Lose');
                    return;
                }
                break;
            case 'd':
                newPosition = myfield.position.slice();
                newPosition[0] += 1;
                if (verifyHeight(newPosition[0], myfield.field) && !verifyHole(newPosition, myfield.field)) {
                    if (verifyValidMovement(newPosition, myField)) return;
                } else {
                    console.log('You Lose');
                    return;
                }
                break;
            case 'r':
                newPosition = myfield.position.slice();
                newPosition[1] += 1;
                if (verifyWidth(newPosition[1], myfield.field) && !verifyHole(newPosition, myfield.field)) {
                    if (verifyValidMovement(newPosition, myField)) return;
                } else {
                    console.log('You Lose');
                    return;
                }
                break;
            case 'l':
                newPosition = myfield.position.slice();
                newPosition[1] -= 1;
                if (verifyWidth(newPosition[1], myfield.field) && !verifyHole(newPosition, myfield.field)) {
                    if (verifyValidMovement(newPosition, myField)) return;
                } else {
                    console.log('You Lose');
                    return;
                }
                break;
        }

        myfield.print()
    } while (true);

}


function verifyDimension(input) {

    while (Number.isNaN(input) || !Number.isInteger(input) || input < 1 || input > 10) {
        input = Number(prompt('Please insert an integer between 1 and 10: '));
    }
    return input;
}

function verifyPercentage(input) {
    while (Number.isNaN(input) || input < 0 || input > 0.5) {
        input = Number(prompt('Please insert a number between 0 and 0.5: '));
    }
    return input;
}

let width = Number(prompt('How wide do you want your field to be? (Please insert an integer between 1 and 10): '));
width = verifyDimension(width);

let height = Number(prompt('How tall do you want your field to be? (Please insert an integer between 1 and 10): '));
height = verifyDimension(height);

let holes = Number(prompt('How wide do you want your field to be? (Please insert a number between 0 and 0.5): '));
holes = verifyPercentage(holes);

let myField = new Field(Field.generateField(width, height, holes))


setupInstructions();


myField.print();

play(myField);