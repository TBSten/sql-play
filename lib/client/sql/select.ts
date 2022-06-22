import { any, capture, grp, opt } from "./matcher";

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

export const selectPattern = grp(
    SELECT, capture(any()),
    FROM, any(),
    opt(WHERE, any()),
    opt(GROUP, BY, any(),),
    opt(HAVING, any(),),
    opt(ORDER, BY, any()),
    opt(LIMIT, any(),),
    opt(OFFSET, any(),),
)
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

