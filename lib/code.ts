import { Completion } from "@codemirror/autocomplete"

const types = "array binary bit boolean char character clob date decimal double float int integer interval large national nchar nclob numeric object precision real smallint time timestamp varchar varying bool blob long longblob longtext medium mediumblob mediumint mediumtext tinyblob tinyint tinytext text bigint int2 int8 unsigned signed real"
    .toUpperCase().split(" ")

export function lines(...lines: string[]) {
    return lines.join("\n") + "\n"
}

export const autocompleteCodes: ({ code: string } & Completion)[] = [
    {
        code: lines(
            "CREATE TABLE ${name}(",
            "  ${列名} ${型} PRIMARY KEY,",
            "  ${}",
            ");"
        ),
        label: "CREATE TABLE",
    },
    {
        code: lines(
            "SELECT * ",
            "FROM ${表名} ;",
        ),
        label: "SELECT FROM",
    },
    {
        code: lines(
            "SELECT * ",
            "FROM ${表名} ",
            "WHERE ${条件} ;",
        ),
        label: "SELECT FROM WHERE",
    },
    {
        code: lines(
            "INSERT INTO ${表名}( ${列} ) ",
            "VALUES ( ${値} ) ;",
        ),
        label: "INSERT INTO VALUES",
    },
    {
        code: lines(
            "UPDATE ${表名}",
            "SET ${列名} = ${値} ;",
        ),
        label: "UPDATE SET",
    },
    {
        code: lines(
            "DELETE FROM ${表名}",
            "WHERE ${条件} ;",
        ),
        label: "DELETE FROM WHERE",
    },
    ...types.map(type => ({
        code: type,
        label: type,
        type: "keyword",
    }))
]

