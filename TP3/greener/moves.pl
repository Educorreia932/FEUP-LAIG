:- use_module(library(between)).

% Move piece from a cell to other

move(GameState, [I0, J0, I1, J1], NewGameState) :-
    nth0(I0, GameState, RowStart),           % Select starting row
    nth0(J0, RowStart, StackStart),          % Select stack from row

    replace(RowStart, J0, [], RowAux),       % Remove stack from starting cell
    replace(GameState, I0, RowAux, BoardAux),          

    nth0(I1, BoardAux, RowEnd),              % Select final row
    nth0(J1, RowEnd, StackEnd),              % Select stack from row
    append(StackStart, StackEnd, Stack),     % Add the piece to the top of the stack
    
    replace(RowEnd, J1, Stack, Row),         % Move stack to final cell
    replace(BoardAux, I1, Row, NewGameState), !.


% Checks if there are any pieces in the same line between two cells

has_pieces_between(Board, I, J0, I, J1) :-    % Same row
    exclusive_between(J0, J1, J),
    get_cell(Board, I, J, Stack),
    \+ is_empty(Stack).

has_pieces_between(Board, I0, J, I1, J) :-    % Same column
    exclusive_between(I0, I1, I),
    get_cell(Board, I, J, Stack),
    \+ is_empty(Stack).

% All possible and valid moves

valid_moves(BoardIn, Player, ListOfMoves) :- % Gets all possible moves
    findall(BoardOut, valid_move(Player, BoardIn, BoardOut), ListOfMoves).

valid_move(Player, BoardIn, BoardOut) :-
    board_dimensions(BoardIn, Width, Height),

    exclusive_between(-1, Height, I0),                    % Generate start cell coordinates
    exclusive_between(-1, Width, J0),
    get_cell(BoardIn, I0, J0, StackStart),                % Get start cell
    nth0(0, StackStart, Player),                          % Piece is controlled by player

    exclusive_between(-1, Height, I1),                    % Generate end cell coordinates
    exclusive_between(-1, Width, J1),
    get_cell(BoardIn, I1, J1, StackEnd),                  % Get end cell
    \+ is_empty(StackEnd),                                % Cell is not empty

    \+ is_same_cell(I0, J0, I1, J1),                      % Start and cell coordinates are different
    (I0 == I1; J0 == J1),
    \+ has_pieces_between(BoardIn, I0, J0, I1, J1),
    move(BoardIn, [I0, J0, I1, J1], BoardOut).            % Make move

% Choose move

choose_move(GameState, Player, _, GameState) :-
    valid_moves(GameState, Player, []).              % There are no valid moves          

choose_move(GameState, Player, randomAI, Move) :-    % Random AI Strategy
    valid_moves(GameState, Player, ListOfMoves),     % Calculates valid moves
    length(ListOfMoves, NumberOfMoves),              % Gets number of valid moves
    random(0, NumberOfMoves, R),                     % Choose a random number
    nth0(R, ListOfMoves, Move).                      % Choose a random move

choose_move(GameState, Player, smartAI, Move) :-     % Smart AI Strategy
    valid_moves(GameState, Player, ListOfMoves),     % Calculates valid moves
    moves_values(ListOfMoves, Player, MovesValues),  % Calculate value for each move
    max_list(MovesValues, _, Index),                 % Get the highest value move
    nth0(Index, ListOfMoves, Move).                  % Choose the highest value move

% Get move

get_move(Player, GameState, 'player', NewGameState) :-
    move_input(Player, GameState, NewGameState), !.     % Player inputs move

get_move(Player, GameState, Strat, NewGameState) :-     % AI calculates move
    Strat \== 'player',
    choose_move(GameState, Player, Strat, NewGameState),
    sleep(0.5).

% Calculate value of move

value(GameState, Player, Value) :-
    flatten(GameState, AllStacks),                  % Retrieve list of all stacks
    get_stacks(AllStacks, Player, PlayerStacks),    % Retrieve player's stacks
    green_pieces(PlayerStacks, GreenPieces),        % Count the number of green pieces in each stack
    sumlist(GreenPieces, Value).                        % Get the total number of green pieces

% Map values of each move

moves_values([], _, []).                    % Stop Recursion

moves_values([C|R], Player, [Value|CR]) :-
    value(C, Player, Value),                % Calculates value of GameState
    moves_values(R, Player, CR).            % Recursion using tails of lists

% Retrieve stacks controlled by player

get_stacks(ListOfStacks, Player, PlayerStacks) :-   % Puts all the stacks controlled by one player in a list
findall(Stack, get_player_stack(ListOfStacks, Stack, Player), PlayerStacks).    

get_player_stack(ListOfStacks, Stack, Player) :-
member(Stack, ListOfStacks),                    % Get stack from list
nth0(0, Stack, Player).                         % Verify if top piece is of the player's color

% Count the number of green pieces in each stack and map it

green_pieces([], []).           % Stop Recursion

green_pieces([C|R], [TC|CR]) :-
count(C, g, TC),            % Counts green pieces 
green_pieces(R, CR).        % Recursion with tails