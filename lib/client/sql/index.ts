import { exec, or } from "./matcher";
import { selectKeywords, selectPattern } from "./select";


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


const patterns = {
    select: selectPattern,
}
const keywords: Record<keyof typeof patterns, string[]> = {
    select: selectKeywords,
}

export const analyzeSql = (sql: string): StatementDetail[] => {
    const ans: StatementDetail[] = []
    // sql -> statement[]
    console.log("exec", sql);
    const res = exec(or(selectPattern, "exit"), sql, selectKeywords)
    console.log(res)
    return ans
}


