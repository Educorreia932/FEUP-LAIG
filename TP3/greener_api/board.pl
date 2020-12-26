:- use_module(library(system)).

% Checks if two pair of coordinates correspond to the same cell

is_same_cell(I0, J0, I1, J1) :-
    I0 =:= I1,  % Same Row
    J0 =:= J1.  % Same Column

% Returns the stack present int the cell with coordinates I, J from the board

get_cell(Board, I, J, Stack) :-
    nth0(I, Board, Row),        % Select row
    nth0(J, Row, Stack).        % Select stack from row

% Converts a column's letter to an index

column_index(ColumnIn, ColumnOut) :-
    atom_length(ColumnIn, Length),      % Get length of column
    Length =:= 1,                       % Make sure column is one character long
    char_code(ColumnIn, Code),
    ColumnOut is Code - 65.             % Translate Column 

% List of all pieces

pieces(W, G, B, Pieces) :-
    build(w, W, L1),        % Creates list with W white pieces
    build(g, G, L2),        % Creates list with G green pieces
    build(b, B, L3),        % Creates list with B black pieces
    append(L1, L2, L),      % Appends lists
    append(L, L3, Pieces).  % Appends lists

% Returns a shuffled list from a list of pieces

shuffle_board(Shuffled, Columns, Rows) :-
    Size = Columns * Rows,                 % Calculates size of board
    W is div(Size, 4),                      % Calculates number of white pieces
    B = W,                                  % Number of black pieces is the same as white pieces
    G = Size - (W + B),                     % Calculates number of green pieces
    pieces(W, G, B, Pieces),                % Creates list with all pieces
    random_permutation(Pieces, Shuffled).   % Shuffles list of pieces.

% Fills a row with pieces

fill_row(Pieces, Columns, FilledRow) :-
    prefix_length(Pieces, Row, Columns),
    create(Row, FilledRow).

% Fills board row by row using a list of pieces

fill_board(_, _, 0, _).

fill_board(Pieces, Columns, Rows, Board) :-
    fill_row(Pieces, Columns, FilledRow),
    remove_n(Pieces, Columns, P),              
    append(FilledBoard, [FilledRow], Board),
    R is Rows - 1,
    fill_board(P, Columns, R, FilledBoard).

% Generates random game board, filling it with pieces

generate_board(Columns, Rows, Board) :-
    shuffle_board(Shuffled, Columns, Rows),            % Shuffles all pieces from the list
    fill_board(Shuffled, Columns, Rows, Board).       % Fills board with the pieces from list

% Returns the board's width and height

board_dimensions(Board, Width, Height) :- 
    length(Board, Height),
    nth0(0, Board, Row),      
    length(Row, Width).