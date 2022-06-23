
import { capture, debug, grp, opt } from "./matcher";

const
    SELECT = "select",
    FROM = "from",
    WHERE = "where",
    GROUP = "group",
    BY = "by",
    HAVING = "having",
    ORDER = "order",
    LIMIT = "limit",
    OFFSET = "offset"

export const selectPattern = (pre: string = "") => debug("<***select***>")(grp(
    {
        next(input, output) {
            console.log("$$$ 💣select start")
            return true
        }
    },
    SELECT, capture(`${pre}select-select`),
    FROM, capture(`${pre}select-from`),
    opt(WHERE, capture(`${pre}select-where`)),
    opt(GROUP, BY, capture(`${pre}select-group-by`),),
    opt(HAVING, capture(`${pre}select-having`),),
    opt(ORDER, BY, capture(`${pre}select-order-by`)),
    opt(LIMIT, capture(`${pre}select-limit`),),
    opt(OFFSET, capture(`${pre}select-offset`),),
))
export const selectKeywords = [
    SELECT,
    FROM,
    WHERE,
    GROUP,
    BY,
    HAVING,
    ORDER,
    LIMIT,
    OFFSET,
]

