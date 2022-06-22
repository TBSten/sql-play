
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
