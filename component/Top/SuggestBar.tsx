import { SelectionRange } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Box, Chip, ChipProps, Tooltip, useTheme } from "@mui/material";
import { lines } from "lib/code";
import { FC, useCallback, useMemo } from "react";

export interface Suggestion {
    label: string;
    onClick: () => unknown;
    color?: ChipProps["color"];
    tooltip?: string;
}
export interface SuggestBarProps {
    suggestions?: Suggestion[];
}
export const suggest = (label: string, onClick: () => unknown, sug: Partial<Suggestion> = {}): Suggestion => {
    return { label, onClick, color: "default", ...sug }
}
export const defaultSuggestions: Suggestion[] = []

export const SuggestBar: FC<SuggestBarProps> = ({ suggestions = defaultSuggestions }) => {
    const theme = useTheme()
    if (!suggestions.length) return null
    return (
        <Box
            position="fixed"
            left={0}
            bottom={0}
            width="100%"
            borderTop={`solid 1px ${theme.palette.grey[300]}`}
            bgcolor={theme.palette.common.white}
            px={1}
            py={0.5}
            overflow="auto"
            display="flex"
            alignItems="center"
        >
            <Box minWidth="fit-content">
                提案:
            </Box>
            {suggestions.map(({ label, onClick, tooltip = "", color = "default" }) => (
                <Box key={label} component="span" px={0.5} >
                    <Tooltip title={tooltip}>
                        <Chip label={label} variant="outlined" onClick={onClick} color={color} />
                    </Tooltip>
                </Box>
            ))}
            {suggestions.length <= 0 && "なし"}
        </Box >
    );
}

export interface UseSuggestArg {
    mode?: "edit" | "execute",
    view?: EditorView | null,
    selection?: SelectionRange | null
}
export function useSuggest({ mode = "edit", view, selection }: UseSuggestArg) {
    const from = selection?.from ?? 0
    const to = selection?.to ?? 0
    const dispatchInsertCode = useCallback((code: string) => {
        view?.dispatch({
            changes: { from, to, insert: code, },
        })
    }, [from, to, view])
    const editSuggestions = useMemo(() => [
        suggest("表を作成", () => {
            dispatchInsertCode(lines(
                "-- 表を作成",
                "CREATE TABLE <表名>(",
                "  <主キー> <型> PRIMARY KEY,",
                "  <列名> <型>,",
                "  FOREIGN KEY (<外部キー>)",
                "    REFERENCES <参照先テーブル>(<主キー>)",
                ");",
            ))
        }, { tooltip: "表を作成" }),
        suggest("行一覧を取得", () => {
            dispatchInsertCode(lines(
                "-- 行一覧を取得",
                "SELECT *",
                "FROM <表名>;",
            ))
        }, { color: 'primary' }),
        suggest("条件を絞って行を取得", () => {
            dispatchInsertCode(lines(
                "-- 条件を絞って行を取得",
                "SELECT 列名1, 列名2, 列名3",
                "FROM <表名>",
                "WHERE <条件>;",
            ))
        }),
        suggest("行を追加", () => {
            dispatchInsertCode(lines(
                "-- 行を追加",
                "INSERT INTO <表名>(<列名1>, <列名2>)",
                "VALUES（<値1>, <値2> ）;",
            ))
        }),
        suggest("行を削除", () => {
            dispatchInsertCode(lines(
                "-- 行を削除",
                "DELETE FROM <表名>",
                "WHERE <条件> ;",
            ))
        }),
        suggest("行を更新", () => {
            dispatchInsertCode(lines(
                "-- 行を更新",
                "UPDATE <表名> ",
                "SET <列名>=<値>",
                "WHERE <条件> ;",
            ))
        }),
    ], [dispatchInsertCode])

    const exeSuggestions = useMemo(() => [
        // suggest("SQLを実行", () => { }),
    ], [])
    return mode === "edit" ? editSuggestions : exeSuggestions;
}
