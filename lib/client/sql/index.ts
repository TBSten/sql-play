import { distinct } from "lib/util";
import { deleteKeywords, deletePattern } from "./delete";
import { insertKeywords, insertPattern } from "./insert";
import { capture, exec, grp, opt, or, repeat } from "./matcher";
import { selectKeywords, selectPattern } from "./select";
import { updateKeywords, updatePatten } from "./update";


export interface StatementDetail {
    type: string;
}
export interface SelectStatementDetail extends StatementDetail {
    type: "select";
    select: string[];
    from: string[];
    where: string[];
    groupBy: string[];
    having: string[];
    orderBy: [string, "asc" | "desc"][];
    offset: number;
    limit: number;
}
export interface UpdateStatementDetail extends StatementDetail {
    type: "update";
    update: string;
    set: [string, string][]; //set string = string
    where: string[];
}
export interface InsertStatementDetail extends StatementDetail {
    type: "insert";
    insertInto: [string, string[]]; // [table,[col1,col2,...]]
    values?: string[];
    select?: SelectStatementDetail;
}
export interface DeleteStatementDetail extends StatementDetail {
    type: "delete";
    deleteFrom: string;
    where: string[];
}
export interface CreateTableStatementDetail extends StatementDetail {
    type: "createTable";
    createTable: string;
    columns: [string, string][]; // [col1,type1][]
}


const _patterns = {
    select: selectPattern(),
    insert: insertPattern(),
    update: updatePatten(),
    delete: deletePattern(),
}
const _keywords: Record<keyof typeof _patterns, string[]> = {
    select: selectKeywords,
    insert: insertKeywords,
    update: updateKeywords,
    delete: deleteKeywords,
}
const statementPattern = capture("<<TEST>>", or(...Object.values(_patterns)))

const SEMI = ";"
// const sqlPattern = repeat(opt(pattern), SEMI)
const sqlPattern = grp(
    statementPattern,
    repeat(SEMI),
    repeat(
        statementPattern,
        opt(repeat(SEMI))
    )
)
// const keywords = Array.from(new Set(...Object.values(_keywords), SEMI))
const keywords = distinct([...Object.values(_keywords).flat().map(word => word + " "), SEMI])

export const analyzeSql = (sql: string): StatementDetail[] => {
    const ans: StatementDetail[] = []
    // sql -> statement[]
    console.log("exec", `<<${sql}>>`);
    console.log("keywords", keywords);
    const res = exec(sqlPattern, sql, [...keywords, "a", "b"])
    console.log(res)
    return ans
}


