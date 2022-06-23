
# orにおけるinputとbuf

input   1   2   3   4
buf     (none)

--- reset ---

input  [1]  2   3   4
buf     (none)
idx    -1
    ↓ nextInput() :1
input  [2]  3   4
buf     1
idx    -1
    ↓ nextInput() :2
input  [3]  4
buf     1   2
idx    -1
    ↓ nextInput() :3
input  [4]
buf     1   2   3
idx    -1

--- reset ---

input   4
buf    [1]   2   3
idx    0
    ↓ nextInput() :1
input   4
buf     1  [2]  3
idx     1
    ↓ nextInput() :2
input   4
buf     1   2  [3]
idx     2
    ↓ nextInput() :3
input   4
buf     1   2   3
idx     3
    ↓ nextInput() :4
input   (none)
buf     1   2   3   4
idx     4




# repeat

repeat(or("a","b")) において
( (a|b)* )

a b a b     => ok
    flg     in
    true    -
            a
    true    b
            a
    true    b
    false   (none)

a b a b X   => ok
    flg     in
    true    -
            a
            b
    true
            a
            b
    true
    false   X

a b a X     => no
    flg     int
    true    -
            a
            b
    true
            a
    false   X

a b a X     => no
b a X       => no
    flg     int
    true    -
    false   b
