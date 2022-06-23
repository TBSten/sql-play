import { capture, debug, grp, opt } from "./matcher";

const
    DELETE = "delete",
    FROM = "from",
    WHERE = "where"

export const deletePattern = (pre: string = "") => debug("<***delete***>")(grp(
    DELETE, FROM, capture(`${pre}delete-from`),
    opt(WHERE, capture(`${pre}delete-opt`)),
))
export const deleteKeywords = [
    DELETE, FROM, WHERE,
]
