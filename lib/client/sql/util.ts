import { joinRepeat, or } from "./matcher"

const relationPt = joinRepeat()(or(""))
const logicPt = joinRepeat()(or(""))

export const conditionPattern = logicPt
export const conditionKeywords = []

