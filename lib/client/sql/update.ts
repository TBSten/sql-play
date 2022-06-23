import { capture, debug, grp, opt } from "./matcher";

const
    UPDATE = "update",
    SET = "set",
    WHERE = "where"

export const updatePatten = (pre: string = "") => debug("<***update***>")(grp(
    UPDATE, capture(`${pre}update-update`),
    SET, capture(`${pre}update-set`),
    opt(WHERE, capture(`${pre}update-where`)),
))
export const updateKeywords = [
    UPDATE, SET, WHERE,
]
