int tempX = 0;                          // defines tempX variable
int tempY = 0;                          // defines tempY variable

// runs at startup
void setup() {
    Serial.begin(9600);                 // begins serial with baud rate 9600
    pinMode(7, INPUT);                  // initializes pin 7 as input for joystick button
    pinMode(8, OUTPUT);                 // initializes pin 8 as output for LED
    digitalWrite(7, HIGH);              // sets pin 7 as HIGH to read joystick button
}

// loop runs repeatedly
void loop() {
    if (Serial.available()) {           // if there is available serial from p5
        if(Serial.read() == 1){         // if arduino reads 1 from p5 
            digitalWrite(8, HIGH);      // set pin 8 to high to turn on LED
        } else {                        // if arduino reads 0
            digitalWrite(8, LOW);       // turn LED off
        }
    }

    tempX = 0;                          // resets tempX value
    tempY = 0;                          // resets tempY value

    // takes average of ten readings to reduce erroneous interferance
    for (int i = 0; i < 10; i++) {      // runs 10 times
        tempX += analogRead(A0);        // adds analogRead at A0 (x value for joystick) to sum
        tempY += analogRead(A1);        // adds analogRead at A1 (y value for joystick) to sum
    }

    tempX = tempX / 10;                 // divides sum by 10
    tempY = tempY / 10;                 // divides sum by 10

    // prints readings to serial
    Serial.print(tempX);                // prints X vlaue
    Serial.print(",");                  // prints comma
    Serial.print(tempY);                // prints Y value
    Serial.print(",");                  // prints comma
    Serial.println(digitalRead(7));     // prints digital read of button press
    delay(180);                         // delays 180ms to give time for player to move
}