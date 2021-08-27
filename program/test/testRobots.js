// Mocha and chai testing

const expect = require("chai").expect;
const fs = require('fs')
const main = require("../martianRobots");


describe("Testing battery", function (){

    describe("Setting information", function (){
        let robot = new main.Robot(0, 3, 3)
        it('More than 100 actions', function () {
            let stringActions = ""
            // Check with one more than 100
            for (let i = 0; i < 101; i++) {
                let action = Math.floor(Math.random() * 2);
                switch (action) {
                    case 0:
                        stringActions = stringActions.concat("L");
                        break;
                    case 1:
                        stringActions = stringActions.concat("R");
                        break;
                    case 2:
                        stringActions = stringActions.concat("F");
                        break;
                }
            }
            expect(() => main.actions(robot, stringActions)).to.throw('Too big instruction string');
        })

        it('File creation', function () {
            main.exportFile("../FileCreated", "This is a test\n", "w+")
            expect(fs.existsSync("../FileCreated")).to.exist
        });
    })

    describe("Setting values correctly", function (){
        const robot = new main.Robot(1, 1, 0);
        it('X - coordinate', function (){
            expect(robot.x).to.equal(1);
        })

        it('X - coordinate', function (){
            expect(robot.y).to.equal(1);
        })

        it('Orientation ', function () {
            expect(main.orientations[robot.orientation]).to.equal('N')
        });

    })

    describe("Robot movements", function (){

        let robot = new main.Robot(1, 1, 0);

        it('Rotating left', function () {
            robot = main.actions(robot, "LLL")
            expect(main.orientations[robot.orientation]).to.equal('E')
        });

        it('Rotating right', function () {
            robot = main.actions(robot, "RR")
            expect(main.orientations[robot.orientation]).to.equal('W')
        });

        it('Moving forward without rotating', function () {
            robot = main.actions(robot, "F")
            expect(robot.x).to.equal(0)
        });

        it('Check distance', function () {
            let robot = new main.Robot(0, 0, 0)
            let origins = [robot.x, robot.y]
            robot = main.actions(robot, "FFFRFFFF")
            main.calculateDistance(robot, origins)
            expect(robot.distance).to.equal(7)
        });
    })

    describe("Robot status", function (){
        let robot = new main.Robot(3, 2, 0)

        it('Not losing a robot', function () {
            robot = main.actions(robot, "FRRRFFFLLF")
            expect(robot.lost).to.equal(false)
        });

        it('Loosing a robot', function () {
            robot = new main.Robot(3, 2, 0)
            robot = main.actions(robot, "FRRFLLFFRRFLL")
            expect(robot.lost).to.equal(true)
        });

        // The previous robot got lost, so this one will avoid the fall and not get lost
        it('Robot Scent', function () {
            let robot2 = new main.Robot(0, 3, 3)
            robot2 = main.actions(robot2, "LLFFFLFLFL");
            expect(robot2.lost).to.equal(false)
            expect(main.coordinatesToAvoid.length === 1)
        });
    })
})
