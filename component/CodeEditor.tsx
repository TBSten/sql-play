

import { autocompletion, CompletionSource, snippetCompletion } from "@codemirror/autocomplete";
import { sql, SQLite } from "@codemirror/lang-sql";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { autocompleteCodes } from "lib/code";
import { FC, useEffect, useState } from "react";



const myCompletions: CompletionSource = (context) => {
    let word = context.matchBefore(/\w*/)
    if (!word) return null
    if (word.from == word.to && !context.explicit) return null
    return {
        from: word.from,
        options: Object.values(autocompleteCodes).map(({ code, ...comp }) => ({
            type: "keyword",
            ...snippetCompletion(code, comp),
        })),
    }
};

export const autocompleteExtension = autocompletion({
    override: [myCompletions],
})
export const sqlExtension = sql({
    upperCaseKeywords: true,
    dialect: SQLite,
})
export const extensions = [
    autocompleteExtension,
    sqlExtension,
]
interface CodeEditorProps {
    code: string;
    onChange?: (code: string) => unknown,
    onUpdateState?: (state: EditorState) => unknown,
    onUpdateView?: (state: EditorView) => unknown,
}

const CodeEditor: FC<CodeEditorProps> = ({ code, onChange, onUpdateState, onUpdateView, }) => {
    return (
        <>
            <CodeMirror
                value={code}
                extensions={extensions}
                onChange={code => onChange && onChange(code)}
                onUpdate={(update) => {
                    onUpdateState && onUpdateState(update.state)
                    onUpdateView && onUpdateView(update.view)
                }}
                height="100vh"
            />
        </>
    );
}
export default CodeEditor

export function useCodeEditor(isLightMode: boolean = true) {
    const [state, setState] = useState<null | EditorState>(null)
    const [view, setView] = useState<null | EditorView>(null)
    useEffect(() => {
        if (isLightMode) document.documentElement.setAttribute('data-color-mode', 'light')
    }, [isLightMode])
    return {
        state,
        view,
        props: {
            onUpdateState: (state) => {
                setState(state)
            },
            onUpdateView: (view) => {
                setView(view)
            }
        } as Partial<CodeEditorProps>,
    }
}
