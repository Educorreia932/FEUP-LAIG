% Start Program

play :-
    now(T),                         % Seed for RNG
    setrand(T),                     % For randomness 
    repeat,                         % Repeat while Exit fails
        print_start_menu,           % Prints Start Menu
        read_input(Input),          % Receives user option
        option_start_menu(Input),   % Process option
        Input =:= 3.                % Exit Game

% Start Menu

option_start_menu(3).                           % Exit                       
option_start_menu(1) :- board_menu.             % Start Game          
option_start_menu(2) :- print_instructions.     % Instructions     

print_start_menu:-  % Prints Start menu
    nl,
    print('================================================'), nl,
    print('|                   GREENER                    |'), nl,
    print('================================================'), nl,
    print('                                                '), nl,
    print('                  1 - Start                     '), nl,
    print('                  2 - How to play               '), nl,
    print('                  3 - Exit                      '), nl,
    print('                                                '), nl,
    print('================================================'), nl.

% Board Menu

board_menu :-                       
    print_board_menu,           % Prints board menu       
    read_input(Input),          % Receives user option
    option_board_menu(Input),   % Processs option
    Input =:= 4.                % Go Back to other menu

option_board_menu(4) .                   % Back
option_board_menu(1) :- game_menu(6, 6). % 6x6
option_board_menu(2) :- game_menu(6, 9). % 6x9
option_board_menu(3) :- game_menu(9, 9). % 9x9
            
print_board_menu:-  % Prints board menu
    nl,
    print('================================================'), nl,
    print('|                    BOARD                     |'), nl,
    print('================================================'), nl,
    print('                                                '), nl,
    print('                   1 - 6x6                      '), nl,
    print('                   2 - 6x9                      '), nl,
    print('                   3 - 9x9                      '), nl,
    print('                   4 - Back                     '), nl,
    print('                                                '), nl,
    print('================================================'), nl.

% Game Menu

game_menu(Rows, Columns) :-                 
    print_game_menu,                        % Prins Game Menu
    read_input(Input),                      % Receives user option
    option_game_menu(Input, Rows, Columns), % Process option
    Input =:= 4.                            % Go Back

option_game_menu(4, _, _).                                                              % Back 
option_game_menu(1, Rows, Columns) :- start_game(['player', 'player'], Rows, Columns), !.  % Starts PvP
option_game_menu(2, Rows, Columns) :- ai_menu('Player VS AI', Rows, Columns), !.           % AI vs Player 
option_game_menu(3, Rows, Columns) :- ai_menu('AI VS AI', Rows, Columns), !.               % AI vs AI

print_game_menu:-
    nl,
    print('================================================'), nl,
    print('|                    GAME                      |'), nl,
    print('================================================'), nl,
    print('                                                '), nl,
    print('                1 - Player vs Player            '), nl,
    print('                2 - Player vs AI                '), nl,
    print('                3 - AI vs AI                    '), nl,
    print('                4 - Back                        '), nl,
    print('                                                '), nl,
    print('================================================'), nl.

% AI Menu

ai_menu('Player VS AI', Rows, Columns) :-     % AI vs Player
    print_ai_menu,                            % Prints AI Menu
    read_input(Input),                        % Receives user option
    option_ai_menu(Input, Strat),             % Gets strategy of AI
    color_menu(Strat, Rows, Columns).         % Calls color menu

ai_menu('AI VS AI', Rows, Columns) :-
    print_ai_menu,                                % Prints AI Menu

    print('Choose strategy for black AI:'), nl,
    read_input(Input1),                           % Receives user option
    option_ai_menu(Input1, Strat1),               % Sets strategy for black AI

    print('Choose strategy for white AI:'), nl,
    read_input(Input2),                           % Receives user option
    option_ai_menu(Input2, Strat2),               % Sets strategy for white AI

    start_game([Strat1, Strat2], Rows, Columns).  % Starts AI VS AI game with startegys

option_ai_menu(1, randomAI).  % Random Strategy
option_ai_menu(2, smartAI).   % Smart Strategy

print_ai_menu :-
    nl,
    print('================================================'), nl,
    print('|                  AI STRATEGY                 |'), nl,
    print('================================================'), nl,
    print('                                                '), nl,
    print('                  1 - Random                    '), nl,
    print('                  2 - Smart                     '), nl,
    print('                                                '), nl,
    print('================================================'), nl.

% Color Menu 

color_menu(Strat, Rows, Columns) :- 
    print_color_menu,
    read_input(Input),                % Receives user option
    option_color_menu(Input, Strat, Rows, Columns).  % Process option

option_color_menu(1, Strat, Rows, Columns) :- start_game(['player', Strat], Rows, Columns).   % Black (AI Plays first)
option_color_menu(2, Strat, Rows, Columns) :- start_game([Strat, 'player'], Rows, Columns).   % White

print_color_menu :-
    nl,
    print('================================================'), nl,
    print('|                    AI COLOR                  |'), nl,
    print('================================================'), nl,
    print('                                                '), nl,
    print('                  1 - Black                     '), nl,
    print('                  2 - White                     '), nl,
    print('                                                '), nl,
    print('================================================'), nl.

% instructions

print_instructions :-
    nl,
    print('================================================================'), nl,
    print('|                           HOW TO PLAY                        |'), nl,
    print('================================================================'), nl,
    print('                                                                '), nl,
    print('   Players take turns (starting by Black) capturing pyramids or '), nl, 
    print('   stacks of any colour on the same row or column and with no   '), nl,
    print('   stacks between them.                                         '), nl,
    print('                                                                '), nl,
    print('   On your turn you must make one capture if possible, otherwise'), nl,
    print('   you pass the turn.                                           '), nl,
    print('                                                                '), nl,
    print('   The game ends when all players pass in succession.           '), nl,
    print('                                                                '), nl,
    print('   The player with the most green pyramids captured (being      '), nl,
    print('  part of stacks they control) wins the game.                   '), nl,
    print('   In case of a tie, the player with the highest stack wins.    '), nl,
    print('   If the tie persists, play again.                             '), nl,
    print('                                                                '), nl,
    print('   Good luck and have fun!                                      '), nl,
    print('                                                                '), nl,
    print('================================================================'), nl.

% Input

% Used for reading user input without '.'

read_input(Input) :-
    get_code(Character),
    read_input_all(Character, Characters),       
    name(Input, Characters), !.

read_input_all(10, []) :- !.
read_input_all(13, []) :- !.

read_input_all(Character, [Character|T]) :-
    get_code(C),
    read_input_all(C, T), !.

% Ask play to choose a cell

cell_input(Row, Column) :-
    print('Column: '),
    read_input(J),              % Receive input Column
    column_index(J, Column),    % Translate column
    
    print('Row: '),
    read_input(I),              % Receive input Row
    integer(I),                 % Check if it is a number
    Row is I - 1.               % Translate row

% Ask player for its turn's move

move_input(Player, GameState, NewGameState) :-
    repeat,                                                             % Repeat if input Failed
        nl, nl,
        print('Please make a move.'), nl, nl,   

        print('Piece to move:'), nl,
        cell_input(I0, J0), nl,                                         % Get stack to move

        print('Cell to move to:'), nl,
        cell_input(I1, J1),                                             % Get destination
        make_move(Player, GameState, [I0, J0, I1, J1], NewGameState),   % Apply move
        nl.

make_move(Player, GameState, [I0, J0, I1, J1], NewGameState) :- 
    move(GameState, [I0, J0, I1, J1], NewGameState),            % Apply move
    valid_move(Player, GameState, NewGameState).                % Verify if move is valid
