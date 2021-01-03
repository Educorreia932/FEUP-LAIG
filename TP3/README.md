# LAIG 2020/2021 - TP3

## Group T03G04

| Name            | Number    | E-Mail               |
|-----------------|-----------|----------------------|
| Eduardo Correia | 201806433 | up201806433@fe.up.pt |
| Telmo Baptista  | 201806554 | up201806554@fe.up.pt |

----

## How to run

To run this project, one must follow these steps:

- Start an HTTP local server in the root folder of the project, containing the source code and the CGF library.
- Start a SICStus Prolog instance, inside the `greener_api/` folder
- Consult the server file with the following command `['server'].` 
- Run the command `server.` to start the Prolog connection.

**Note:** The last three steps may also be performed by running the `start.bat` script.

## Game rules

Players take turns (starting by Black ⚫) capturing pyramids or stacks of any colour orthogonally (on the same row or collumn and with no stacks between them). On your turn you must make one capture if possible, otherwise you pass the turn. The game ends when all players pass in succession. The player with the most green pyramids captured (being part of stacks they control) wins the game.

![Gameboard Picture](https://camo.githubusercontent.com/bdab01f86ceae414728e94b5501529ff80c26daa0220a868a88a5ddfb15ddf1c/68747470733a2f2f692e696d6775722e636f6d2f75687a4a334e332e706e67)

[Official Rules](https://nestorgames.com/rulebooks/GREENGREENERGREENEST_EN.pdf)

## User instructions

### Setup and Start New Game

To start playing, the user must click on the `New Game` button, which will start a game with the specificed options:

- **Difficulty:** Random / Smart
- **Game Mode:** PvP / PvE / EvE
- **Board Size:** 3 x 3 / 6 x 6 / 9 x 9

All these options can be changed through dropdown menus and their default values are the first of each respective option list.

A `New Game` might be started at any instance with any combination of options.

### Theme

The game can be played in two different themes (scenes) that we have created. The user is able to switch between these, at any point in the game, in the dropdown menu, along side with the rest of the gameplay options.

### Lights

In the Lights interface directory, there are some light toggles. There is one toggle for each light in the current scene. By pressing the toggles, the user will turn off/on a light.

### Cameras

There is also a dropdown menu to select the current camera view. 

When this is changed, an animation plays, following the camera trajectory between the current and the selected view.

### Game Move

To make a move, the player has to choose a piece of its color, then, the tiles that consist of valid moves will be highlighted and the player must then select the stack of one those to finish the move or click again in the stack it picked in the beginning to cancel the move.


### Undo Move

To undo the last game move, the user can press the undo button. This can be repeated until there are no more moves to undo (reached the game board's starting state).

### Scoreboard

On the scoreboard, there is information about the current score of the players, the elapsed time since the beginning of the game and whose turn it is.

### Game Movie

To play the game's movie, the user can press the `Play Movie` button when a game is finished. Once the button is pressed, the movie will start.
After the movie starts, it may be repeated by clicking on the button again.
