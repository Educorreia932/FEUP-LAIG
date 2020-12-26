% Count the number of elements equal to N inside a list

count([], _C, 0).

count([C|T], C, N) :- 
    count(T, C, N1), 
    N is N1 + 1.            % Increment N because it is what we are looking for

count([X|T], C, N) :- 
    X \= C,                 % Different from what we are looking for, no need to increment N
    count(T, C, N).

% Builds a list with N elements and value X

build(_, 0, _).         % End of recursion

build(X, N, [X|T]) :-   % Adds N pieces to list
    N1 is N - 1,
    build(X, N1, T).    % Recursion

% Converts a list into a list of lists

create([], []).

create([H|T], [[H]|T2]) :-
    create(T, T2).

% Removes the first N elements of a list

remove_n(List, N, ShorterList) :-
    length(Prefix, N),
    append(Prefix, ShorterList, List).

% Checks if a list is empty 

is_empty(List) :-
    length(List, Length),
    Length =:= 0.

% Replaces the element of a list

replace([_|T], 0, X, [X|T]).

replace([H|T], I, X, [H|R]) :-
    I > -1, NI is I-1, 
    replace(T, NI, X, R), !.
    
replace(L, _, _, L).

% Verifies if a number is between two others excluding them

exclusive_between(Low, High, Value) :-
    L is Low + 1,
    H is High - 1,
    between(L, H, Value).

% Flattens a list by one-level

flatten([], []).

flatten([A|B],L) :- 
    is_list(A),
    flatten(B,B1), 
    !,
    append(A,B1,L).

flatten([A|B], [A|B1]) :- 
    flatten(B, B1).

% Returns the index of the maximum value of a list

max_list(L, M, I) :- 
    nth0(I, L, M), 
    \+ (member(E, L), E > M).
