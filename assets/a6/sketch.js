let lane1;      // defines array for lane 1
let lane2;      // defines array for lane 2
let lane3;      // defines array for lane 3
let lane4;      // defines array for lane 4
let lane5;      // defines array for lane 5
let lane6;      // defines array for lane 6

// declares global variables:
// - randint: random int
// - win: boolean win value
// - lost: boolean lost value
// - next: variable to track loops and random int
// - port: serial port
// - connectBtn: connect to arduino button
let randint, win, lost, next, port, connectBtn;

// sets baud rate for serial
const BAUD_RATE = 9600;

// setup function, runs at startup
function setup() {
    setupSerial();            // setups serial
    createCanvas(600, 600);   // creates a 600x600 canvas
    resetGame();              // resets game board
}

// keyPressed methods checks for keyboard input
function keyPressed() {
    if (key == " ") {         // when space bar is pressed
        resetGame();          // restarts game
    }
}

// resetGame function clears canvas and resets game
function resetGame() {
    console.log("Restarting game");   // logs restart
    win = false;                      // sets win to false
    lost = false;                     // sets lost to false
    lane1 = [];                       // creates empty array for lane 1
    lane2 = [];                       // creates empty array for lane 2
    lane3 = [];                       // creates empty array for lane 3
    lane4 = [];                       // creates empty array for lane 4
    lane5 = [];                       // creates empty array for lane 5
    lane6 = [];                       // creates empty array for lane 6

    next = 0;                         // sets next variable to 0
    player = new Player();            // constructs new Player object
    port.write(0);                    // writes 0 to arduino

    randint = int(random(0, 10));     // sets random int between 0 and 10
    loop();                           // begins draw loop
}

// draw method loops while game is running
function draw() {

    // establishes and reads serial port
    const portIsOpen = checkPort();     // checks whether port is open
    if (!portIsOpen) return;            // exits draw loop if not open

    let str = port.readUntil("\n");     // read from the port until the newline
    if (str.length == 0) return;        // return if nothing read

    let coords = str.trim().split(","); // trims whitespace and splits by commas


    // maps joystick movements to player movements
    // moving the joystick more than halfway equates to a move in the game
    // takes analogRead input 0-1023, maps to -1-1, and rounds to nearest int 
    // button press maps to restart button mid-game
    let xMov = round(map(Number(coords[0]), 0, 1023, -1, 1));   // sets player x movement
    let yMov = round(map(Number(coords[1]), 0, 1023, -1, 1));   // sets player y movement
    let restart = Boolean(Number(coords[2]));                   // sets restart boolean

    // moves player in x-axis
    if (xMov != 0) {                    // if xMov is -1 or 1
        player.move(xMov * 60, 0);      // move player 60px to left or right
    }

    // moves player in y-axis
    if (yMov != 0) {                    // if yMov is -1 or 1
        player.move(0, yMov * 60);      // move player 60px up or down
    }

    // restarts game if joystick is pressed
    if (!restart) {                     // joystick pressed, reading 0 from analogRead
        resetGame();                    // resets game
    }

    // draws game board
    background(220);                    // sets gray background
    line(0, 60, 600, 60);               // draws lane divider
    line(0, 120, 600, 120);             // draws lane divider
    line(0, 180, 600, 180);             // draws lane divider
    line(0, 240, 600, 240);             // draws lane divider
    line(0, 300, 600, 300);             // draws lane divider
    line(0, 360, 600, 360);             // draws lane divider
    line(0, 420, 600, 420);             // draws lane divider
    line(0, 480, 600, 480);             // draws lane divider
    line(0, 540, 600, 540);             // draws lane divider
    line(0, 600, 600, 600);             // draws lane divider

    fill("green ");                     // sets green for grass dividers
    rect(0, 540, 600, 60);              // draws grass portion (start)
    rect(0, 360, 600, 60);              // draws grass portion
    rect(0, 180, 600, 60);              // draws grass portion
    rect(0, 0, 600, 60);                // draws grass portion (end)

    next += 1;                          // increases next int by 1

    // if next value is the same as the random int, add more cars
    if (next == randint) {
        lane1.push(new Car(width - 10, 495, -20));  // draws car in lane 1
        lane2.push(new Car(-60, 435, 20));          // draws car in lane 2
        lane3.push(new Car(width - 10, 315, -30));  // draws car in lane 3
        lane4.push(new Car(-60, 255, 40));          // draws car in lane 4
        lane5.push(new Car(width - 10, 135, -50));  // draws car in lane 5
        lane6.push(new Car(-60, 75, 70));           // draws car in lane 6

        next = 0;                                   // resets next int to 0
        randint = int(random(5, 20));               // changes rand int to a value between 5 and 20
    }

    // removes end cars
    removeCar(lane1);       // removes end cars from lane 1
    removeCar(lane2);       // removes end cars from lane 2
    removeCar(lane3);       // removes end cars from lane 3
    removeCar(lane4);       // removes end cars from lane 4
    removeCar(lane5);       // removes end cars from lane 5
    removeCar(lane6);       // removes end cars from lane 6

    player.show();          // shows the player
}

// remove car functions remove cars that have already moved through the screen
// takes lane array as a function
function removeCar(lane) {
    for (let c of lane) {                   // for each car in lane
        if (c.x > 600 || c.x < -60) {       // if car has passed bounds of screen
            if (lane.length > 8) {          // if there are more than 8 cars in the array
                lane.shift();               // remove the first car
            }
        }
    
        c.move();                           // move car
        c.show();                           // show car after move

        if (player.hits(c)) {               // if player hits the car
            console.log("Game Over!");      // log game over
            lost = true;                    // sets lost to true
            noLoop();                       // ends draw loop
        }
    }

    if (player.y < 60) {                    // if player reaches final grass section
        console.log("You Win!");            // log win
        win = true;                         // sets win to true
        port.write(1);                      // writes 1 to the arduino
        noLoop();                           // ends draw loop
    }
}

// [from class example] setup serial function allows user to connect arudino to program
function setupSerial() {
    port = createSerial();                              // creates serial with port

    let usedPorts = usedSerialPorts();                  // checks for previously used ports
    if (usedPorts.length > 0) {                         // if there are more than 0 ports used
        port.open(usedPorts[0], BAUD_RATE);             // open the first
    }

    // creates a connect button
    connectBtn = createButton("Connect to Arduino");    // button displays connect to arduino text
    connectBtn.position(5, 5);                          // position the button in the top left of the screen.
    connectBtn.mouseClicked(onConnectButtonClicked);    // run the onConnectButtonClicked function when clicked
}

// [from class example] checkPort function checks if there is a port
function checkPort() {
    if (!port.opened()) {                           // if port is not open
        connectBtn.html("Connect to Arduino");      // change button text
        background("gray");                         // sets gray background
        return false;                               // return false
    } else {                                        // if port is open
    connectBtn.html("Disconnect");                  // change button text
    return true;                                    // return true
}
}

// [from class example] onConnectButtonClicked function connects program to serial
function onConnectButtonClicked() {                 // runs when button is clicked
    if (!port.opened()) {                           // if port is not open
        port.open(BAUD_RATE);                       // open port at baud rate
    } else {                                        // if it is open
        port.close();                               // close the port
    }
}
