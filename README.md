# Martian Robots
Welcome to the martian robots' game!

## Index

* [**Program instructions**](#functionality)

* [**How to run it**](#howTo)
    *   [Prerequisites](#prereq)
    *   [Procedure](#procedure)
* [**How to play**](#play)
---
## Program instructions <a name = "functionality"></a>
 The program is located in Mars, which is a rectangular grid where robot can move according to instructions provided from Earth, and this program calculaes the final robot  position after the instructions.
 
 Each robot has a 2D grid cooordinate and an orientation (N, S, E, W) and can do 3 actions:
   * **Left (L)**: the robot turns left 90 degrees and remains on the current grid point.
   * **Right (R)**: the robot turns right 90 degrees and remains on the current grid point.
   * **Forward (F)**: the robot moves forward one grid point in the direction of the current orientation and maintains the same orientation.
 
 Note that North corresponds to (x, y + 1) point.
 
 Finally, robots can move off the grid, leaving a scent at the last grid coordinate before the fall. This scent allow the following robots to avoid the action.
 
## How to run it <a name = "howTo"></a>
### Prerequisites <a name = "prereq"></a>
To run it, you need *NodeJS*. If you don't have it, you can install it here [NodeJS](https://nodejs.dev/)
### Procedure <a name = "procedure"></a>
To run it, regardless the OS, you need to locate the project, open the *program* folder it and execute the command *node martianRobots.js*

![image](https://user-images.githubusercontent.com/61882277/131372204-13cb238a-cec3-43b4-b8b5-615a5dda1d85.png)

## How to play <a name = "play"></a>
The first thing you find is a prompt with the label *upper right bounds*, as you see in the image above. This prompt defines the upper right bound of the square because the low-left is default 0 0. The format is two numbers separated by an space and values lower than 50, as you can see below

![image](https://user-images.githubusercontent.com/61882277/131372638-38b50bfb-8ba6-42bf-a83f-0dae095152d7.png)

If the prompt is valid, the program will have the next two consecutive prompts:
- The first one corresponds with the starting robot location each one separate by an space. The format is :
   - X
   - Y
   - Orientation
   
   Example *1 1 E*
- The second one is a less 100 char string which defines the actions the robot will do, which were L,R,F. Example *RFRFRFRF*

This structure will continue while the first of the two inputs is empty. For example:

![image](https://user-images.githubusercontent.com/61882277/131373424-df93e529-cafc-4f30-9891-44b78a0ec009.png)

When it happens, results will be shown:

![image](https://user-images.githubusercontent.com/61882277/131373493-b872acfc-9970-4d2f-a31f-1f1525b1b90c.png)

As you can see, the program asks you to export the results. If you accept, the program is finished. In other case, the program request a location to save a txt file with even more information as distance covered by each robot and the sum of them.
Just in case the file exists, will ask to rewrite. If you want to, the file will be rewritten and in other case, the program finishes.

![image](https://user-images.githubusercontent.com/61882277/131374064-e6700da7-879c-4912-a816-1859230b007b.png)

Finally, the file will be like this

[Example.txt](https://github.com/jorge-ap/Node_MartianRobots/files/7078154/Example.txt)
