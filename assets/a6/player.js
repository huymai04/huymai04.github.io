// Player class creates object that is controlled by joystick
class Player {

    // constructor method creates object and defines variables
    constructor() {
        this.size = 40;                 // sets size to 40px
        this.x = 280;                   // sets initial x position to 280px
        this.y = 550;                   // sets initial y position to 550px
    }
    
    // hits method returns if an object has collided with player
    hits(obs) {
        // returns true/false based on object dimensions and position
        return collideRectRect(this.x,this.y,this.size,this.size,obs.x,obs.y,obs.w,obs.h)
    }

    // moves player up or down; takes movements as parameters
    move(xMove,yMove) {
        let tempX = this.x + xMove;         // sets tempX value for testing
        if (tempX > 0 && tempX < 540) {     // if temp value fits within game bounds
            this.x += xMove;                // updates player x value
        }
        
        let tempY = this.y + yMove;         // sets tempY value for testing
        if (tempY > 0 && tempY < 600) {     // if temp value fits within game bounds
            this.y += yMove;                // updates player y value
        }
    }
    
    // show method draws player
    show() {
        fill('yellow');                                     // sets player fill to yellow
        rect(this.x, this.y, this.size, this.size);         // draws player at coordinates and size
    }
  }