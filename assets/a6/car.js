// Car class creates object that is moves horizontally across lanes
class Car {
    
    // constructor creates car value, taking start coordinates and speed
    constructor(startX, startY, speed) {
        this.h = 30;                                                // sets height to be 30px
        this.w = 40;                                                // sets width to be 40px
        this.x = startX;                                            // assigns start x coordinate
        this.y = startY;                                            // assigns start y coordinate
        this.speed = speed;                                         // sets car speed
        let colors = ['grey', 'white', 'blue', 'red', 'black'];     // creates array of car colors
        this.color = colors[int(random(0, 5))];                     // selects random color
    }
    
    // move method updates car x coordinate based on speed
    move() {
        this.x += this.speed;     // updates x coordinate
    }

    // show method draws car
    show() {
        fill(this.color);                       // sets color to be object color
        rect(this.x, this.y, this.w, this.h);   // draws rectangle at coordinates and size
    }
  }