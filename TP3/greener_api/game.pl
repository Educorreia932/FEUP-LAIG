:- use_module(library(lists)).
:- use_module(library(random)).

:- consult('board.pl').
:- consult('display.pl').
:- consult('menu.pl').
:- consult('moves.pl').
:- consult('utils.pl').

:- dynamic(state/2).

% Defines what color is playing next

next_player(w, b). % black plays after white
next_player(b, w). % white plays after black

% Convert player color to an index

player_index(b, 0).
player_index(w, 1).

% Starts game

start_game(Strats, Rows, Columns) :-            % Starts PvP game
    generate_board(Rows, Columns, GameState),   % Generates board
    game_loop(b, Strats, 0, GameState, 0, 0).      % Starts game with black playing first

% Game Over

game_over(GameState, Winner) :-
    value(GameState, b, BlackValue),          % Calculates value for black 
    value(GameState, w, WhiteValue),          % Calculates value for white
    winner(BlackValue, WhiteValue, Winner).   % Sets winner

winner(BlackValue, WhiteValue, 'Black') :- BlackValue > WhiteValue.   % Black won
winner(BlackValue, WhiteValue, 'White') :- BlackValue < WhiteValue.   % White won
winner(BlackValue, WhiteValue, 'Draw') :- BlackValue =:= WhiteValue.  % Draw

% Check if player has already finished playing

finished_playing(GameState, NewGameState, _, 0) :-  
    GameState \== NewGameState.                     % Different GameStates means player can play
    
finished_playing(GameState, GameState, w, 1).       % White player can't play
finished_playing(GameState, GameState, b, 1).       % Black player can't play

% Game loop
    
game_loop(_, _, _, GameState, 1, 1) :-
    game_over(GameState, Winner),
    (Winner = 'Draw' -> format('There\'s no winner', Winner);   
    format('\nThe winner is ~w', Winner)), !.

game_loop(Player, Strats, Round, GameState, BlackFinished, WhiteFinished) :-
    display_game(GameState, Player),                     % Display the current state of the game
    player_index(Player, PlayerIndex),                   % Convert current player to an index
    nth0(PlayerIndex, Strats, Strat),                    % Get current strategy
    get_move(Player, GameState, Strat, NewGameState),    % Get next move
    clear_screen,                                        % Clear the screen
    next_player(Player, NextPlayer),                     
    finished_playing(GameState, NewGameState, Player, Finished),
    assert(state(Round, GameState)),
    NewRound is Round + 1,
    (Player = b -> game_loop(NextPlayer, Strats, NewRound, NewGameState, Finished, WhiteFinished);
     Player = w -> game_loop(NextPlayer, Strats, NewRound, NewGameState, BlackFinished, Finished)).
