

import { capture, debug, grp, opt, or } from "./matcher"
import { selectKeywords, selectPattern } from "./select"

const
    INSERT = "insert",
    INTO = "into",
    START_BUCKET = "(",
    END_BUCKET = ")",
    VALUES = "values"


export const insertPattern = (pre: string = "") => debug("<***insert***>")(grp(
    INSERT, INTO, capture(`${pre}insert-table`), opt("(", capture(`${pre}insert-columns`), ")"),
    or(
        grp(
            VALUES, START_BUCKET, capture(`${pre}insert-values`), END_BUCKET,
        ),
        grp(
            selectPattern("insert-"),
        ),
    ),
))
export const insertKeywords = [
    INSERT,
    INTO,
    START_BUCKET,
    END_BUCKET,
    VALUES,
    ...selectKeywords,
]