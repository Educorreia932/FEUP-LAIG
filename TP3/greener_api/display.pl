player(w, 'White').
player(b, 'Black').

% Assigns each piece to a character for displaying

character([w| _], 9651). % △
character([g| _], 9709). % ◭
character([b| _], 9650). % ▲
character([], 32).

% Assigns each piece to a color for displaying

color([w| _], '[1;0m').
color([g| _], '[1;32m').
color([b| _], '[1;90m'). 

% Displays a stack

display_stack(H) :-
    character(H, CharCode),
    CharCode == 32,
    put_code_n(CharCode, 7).

display_stack(H) :-
    character(H, CharCode),                             % Assigns character to piece on top
    count(H, 'g', GreenPieces),                         % Count the number of green pieces in the stack
    (GreenPieces < 10 -> put_code(32); true),           % Adds one space if necessary
    put_code(32),                                       % Space
    print(GreenPieces),                                 % Prints number of green pieces
    color(H, Color),                                    % Assigns color to piece
    put_code(27), 
    print(Color),                                       % Apply color to piece
    put_code(CharCode),
    put_code(27),
    print('[0m'),                                       % Reset color
    length(H, N),                                       % Calculates height of stack
    print(N),                                           % Prints height of stack
    (N < 10 -> put_code(32); true),                     % Adds space if necessary
    put_code(32).                                       % Space

% Displays collumns ids (A, B, C...)

display_collumn_id([], _ID). % Finish recursion

display_collumn_id([_H|T], ID) :-
    put_code_n(32, 4),                 % 4 Spaces
    put_code(ID),                      % Displays ID (A, B, C...)
    put_code_n(32, 3),                 % 3 Spaces
    ID1 is ID + 1, 
    display_collumn_id(T, ID1).        % Recursion

% Prints a code N times

put_code_n(_C, 0). % Finish Recursion

put_code_n(C, N) :- 
    put_code(C),          % Print code
    N1 is N - 1,
    put_code_n(C, N1).    % Recursion

% Displays middle of top (─┬─)

display_top_middle([_H|[]]). % Finish recursion

display_top_middle([_H|T]) :-
    put_code_n(9472, 7), % ─
    put_code(9516), % ┬
    display_top_middle(T). % Recursion

% Displays top of the board (┌─┬─┐)

display_top([H|T]) :-
    put_code(32), % Space
    put_code(32), % Space
    put_code(9484), % ┌ 
    display_top_middle([H|T]), 
    put_code_n(9472, 7), % ─
    put_code(9488). % ┐

% Prints ID of row (1, 2, 3...)

display_row_id(ID) :-
    put_code(ID),
    put_code(32).

% Displays middle of a row

display_row_middle([]). % Finish Recursion

display_row_middle([H|T]) :-
    display_stack(H), % Displays cell
    put_code(9474), % │
    display_row_middle(T). % Recursion

% Displays a row of the board

display_row([H|T], ID) :-
    display_row_id(ID),
    put_code(9474), % │
    display_row_middle([H|T]).

% Displays middle of a line (─┼─)

display_line_middle([_H|[]]). % Stop recursion

display_line_middle([_H|T]) :- 
    put_code_n(9472, 7), % ─
    put_code(9532), % ┼
    display_line_middle(T). % Recursion

% Displays line between rows (│─┼─│)

display_line([H|T]) :-
    put_code(32), % Space
    put_code(32), % Space
    put_code(9474), % │
    display_line_middle([H|T]), % Displays middle of the line
    put_code_n(9472, 7), % ─
    put_code(9474). % │

% Displays bottom f board (─┴─)

display_bottom_middle([_H|[]]). % Stop recursion

display_bottom_middle([_H|T]) :-
    put_code_n(9472, 7), % ─
    put_code(9524), % ┴
    display_bottom_middle(T). % Recursion

% Displays bottom of board (└─┴─┘)

display_bottom([H|T]) :-
    put_code(32), % Space
    put_code(32), % Space
    put_code(9492), % └
    display_bottom_middle([H|T]), % Displays middle of bottom
    put_code_n(9472, 7), % ─
    put_code(9496). % ┘

% Displays middle of the board

display_board_middle([H|[]], _ID) :-
    display_row(H, _ID), nl. % Last row

display_board_middle([H|T], ID) :-
    display_row(H, ID), nl,            % Displays a row
    display_line(H), nl,               % Displays line between rows
    ID1 is ID + 1,
    display_board_middle(T, ID1).      % Recursion

% Displays the board of the game

display_board([H|T]) :-
    put_code(32),                      % Space
    put_code(32),                      % Space
    display_collumn_id(H, 65), nl,     % Displays collumns ids (A, B, C...)
    display_top(H), nl,                % Displays the top of the board
    display_board_middle([H|T], 49),   % Displays the middle of the board
    display_bottom(H).                 % Displays the bottom of the board

% Displays the game at a certain state

display_game(GameState, Player) :-
    display_board(GameState), nl,
    player(Player, P),
    format('~w is now playing.', [P]).  % Displays the board of the game

% Clears the screen

clear_screen :-
    write('\e[H\e[2J').
