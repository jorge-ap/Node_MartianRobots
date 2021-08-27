// Author : Jorge Adame Prudencio

// Dependencies
const fs = require('fs')
const pr = require("prompt");
const prompt = pr.start();

/* Creation of Robot's class to save all the important information:
    - X and Y coordinates
    - Orientation
    - Distance
    - Sentinel which set the status of the robot (lost or not)
 */

class Robot {

    constructor(x, y, orientation) {
        this.x = x;
        this.y = y;
        this.orientation = orientation;
        this.distance = 0
        this.lost = false
    }

    // Movements section
    // ===========================================================
    moveWest() {
        if (this.x - 1 < 0) {
            this.setLost();
        } else {
            this.x -= 1;
        }
    }

    moveEast() {
        if (this.x + 1 > upperRight[0]) {
            this.setLost();
        } else {
            this.x += 1;
        }
    }

    moveNorth() {
        if (this.y + 1 > upperRight[1]) {
            this.setLost();
        } else {
            this.y += 1;
        }
    }

    moveSouth() {
        if (this.y - 1 < 0) {
            this.setLost();
        } else {
            this.y -= 1;
        }
    }
    // ===========================================================

    setLost() {
        this.lost = true
        coordinatesToAvoid.push([this.x, this.y, this.orientation])
    }

    // =============================================================

    // Turns
    // ====================================================
    add90Degrees() {
        this.orientation += 1;
        this.orientation %= orientations.length
    }

    remove90Degrees() {
        this.orientation -= 1
        if (this.orientation < 0) {
            this.orientation = orientations.length - 1;
        }
    }
    // ====================================================

}

// Constants
const possibleActions = ["L", "R", "F"];
const maxCoordinate = 50;
const maxInstruction = 100;
const orientations = ["N", "E", "S", "W"]

// Global variables
let upperRight;
let recordRobots = []
let coordinatesToAvoid = []


// Functions' section
// =========================================================

// This function allows the user to initialize the upper-right coordinates - Left-lower will always be [0,0]
function startPromptVersion() {
    prompt.get("upperRightBounds", function (err, result) {

        upperRight = result["upperRightBounds"].split(" ")
        if (upperRight.length !== 2){
            throw ("Just 2 coordinates")
        }
        if (upperRight[0] > maxCoordinate || upperRight[1] > maxCoordinate)
            throw ("Coordinates too big")
        receiveRobotInfo()
    })
}

/* This method checks if it gets parameters and there are two different branches:
      1º (Base case) -> If the prompt is empty, there won't be any incoming robots, so the execution goes to
                        show the results
      2º -> In other case, the new info is saved in a new Object and starts the movements
 */
function receiveRobotInfo(){
    prompt.get("robotCoordinates", function (err, result) {
        if (result["robotCoordinates"] === '') {
            showResults()
        }
        else {
            let coordinate = result["robotCoordinates"].split(" ")
            robot = createRobot(Number(coordinate[0]), Number(coordinate[1]), coordinate[2])
            moveRobot(robot)
        }
    });
}

function createRobot(x, y, orientation){
    let or = orientations.findIndex(elem => orientation === elem)
    return new Robot(x,y, or)
}

/* This function deals with the movement.
   The actions will proceed only if isn't lost and operations are 'R', 'L', 'F'
        ● 'R': the robot turns right 90 degrees and remains on the current grid point.
        ● 'L': the robot turns left 90 degrees and remains on the current grid point.
        ● 'F': the robot moves forward one grid point in the direction of the current
               orientation and maintains the same orientation.
 */
function moveRobot(r) {
    let origins = [r.x, r.y]
    prompt.get("actions", function (err, result) {

        // Execute actions
        r = executeActions(r, result["actions"])
        calculateDistance(r, origins)

        // When finishes the moves, it will be saved in an array to display its information below
        recordRobots.push(r);

        // Recursively will demand new robot information
        receiveRobotInfo()
    })
}

// When the robot end its movement, calculates its Manhattan's distance covered
function calculateDistance(robot, origins){
    robot.distance = Math.abs(robot.x - origins[0]) + Math.abs(robot.y - origins[1])
}

function executeActions(r, actions){
    if (actions.length > maxInstruction)
        throw ("Too big instruction string")

    for (let action of actions) {
        if (r.lost) {
            break
        }
        if (possibleActions.find(elem => action === elem) !== undefined) {
            if (action === "R") {
                r.add90Degrees();
            } else if (action === "L") {
                r.remove90Degrees();
            } else if (action === "F") {
                r = forward(r);
            }
        } else {
            throw ("Invalid action:" + action)
        }
    }
    return r
}

/* Forward has its own method because needs to check if some previous robots fell of the grid to avoid that movement
   and needs to check the orientation to move accordingly
 */
function forward(robot) {
    let feasible = true
    if (coordinatesToAvoid.length > 0) {
        for (let i = 0; i < coordinatesToAvoid.length; i++) {
            if (feasible) {
                feasible = !(coordinatesToAvoid[i][0] === robot.x && coordinatesToAvoid[i][1] === robot.y &&
                    coordinatesToAvoid[i][2] === robot.orientation)
            }
        }
    }
    if (feasible){
        switch (robot.orientation) {
            case 0:
                robot.moveNorth();
                break;
            case 1:
                robot.moveEast();
                break;
            case 2:
                robot.moveSouth();
                break;
            case 3:
                robot.moveWest();
                break;
        }
    }
    return robot
}

// This is the last execution function, which purpose is display the final positions of the robots
function showResults() {
    let date = new Date()
    let data = `
Game recorded on date ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()} :
    {
       numberRobots : ${recordRobots.length}
       lostRobots : ${coordinatesToAvoid.length}
       successPercentage : ${100- ((coordinatesToAvoid.length / recordRobots.length) * 100)}%
       record: 
    `
    let index = 0;
    let totalDistance = 0;
    let indexMoreDistance = 0;

    recordRobots.forEach(robot => {
        if (robot.distance > recordRobots[indexMoreDistance].distance){
            indexMoreDistance = index;
        }
        let status = `${robot.x} ${robot.y} ${orientations[robot.orientation]} `;
        if (robot.lost)
            status = status.concat("LOST")
        data = data.concat(`
        {
           id : ${index}
           x - coordinate : ${robot.x},
           y - coordinate : ${robot.y},
           orientation : ${orientations[robot.orientation]},
           distance: ${robot.distance}
           lost : ${robot.lost}     
        }
    `);
        index++;
        totalDistance += robot.distance
        console.log(status + "\n");

    })
    data += `
        totalDistance : ${totalDistance}
        robotMoreDistance : 
           {
              id : ${indexMoreDistance}
              x - coordinate : ${recordRobots[indexMoreDistance].x},
              y - coordinate : ${recordRobots[indexMoreDistance].y},
              orientation : ${orientations[recordRobots[indexMoreDistance].orientation]},
              distance: ${recordRobots[indexMoreDistance].distance}
              lost : ${recordRobots[indexMoreDistance].lost}      
           }
    }
    `
    prompt.get("Export? (y/n)", function (err, result){
        if (result["Export? (y/n)"] === 'y'){
            prompt.get("Location?" , function (err, result){
                if (result["Location?"] === ''){
                    throw ("You had to select a location")
                }
                checkExport(result["Location?"], data)
            })
        }
    })
}

// Check if the location given by the user exists and give the chance to overwrite or append in other case
function checkExport(location, data){
    let flag = "w+";
    if (fs.existsSync(location)){
        prompt.get("Rewrite? (y/n)" , function (err, result){
            if (result["Rewrite? (y/n)"] !== 'y'){
                flag = "a+";
            }
            exportFile(location, data, flag)
        })
    }
    else {
        exportFile(location, data, flag)
    }
}

// This function is up to write into the file with the conditions given above
function exportFile(location, data, flag){
    fs.writeFile(location,
        data, { flag: flag }, err => {
            if (err){
                throw ("An error occurred")
            }
        })
}

startPromptVersion()

module.exports = {
    Robot : Robot,
    orientations : orientations,
    upperRight : upperRight = [5,3],
    coordinatesToAvoid : [],
    forward : forward,
    actions : executeActions,
    calculateDistance: calculateDistance,
    exportFile : exportFile
};
