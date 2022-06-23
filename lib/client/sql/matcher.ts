

const matcherConfig = {
    noneCase: false,
}

function regexpFlg() {
    let flg = matcherConfig.noneCase ? "i" : ""
    return flg
}
function esc(str: string) {
    return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
}

const ignore = "\\n"
export function toTokens(src: string, keywords: string[]): string[] {
    let flg = regexpFlg()
    const pt = `(${keywords.map(word => esc(word)).concat(ignore).join("|")})`
    return src.split(new RegExp(pt, flg)).filter(x => x && !x.match(/^\s+$/g)).map(x => x.trim())
}

export interface Matcher {
    next(input: MatcherInput, output: MatcherOutput): boolean;
    debug?: string;
}

export type MatcherInput = {
    getCursor: () => number;
    next: () => string;
    back: () => void;
    test: () => void;
    isEmpty: () => boolean;
}

export class MatcherOutput {
    _buf: string[] = []
    _captured: Record<string, string[]> = {}
    out(value: string) {
        this._buf.push(value)
    }
    capture(name: string, ...value: string[]) {
        if (!this._captured[name]) {
            this._captured[name] = []
        }
        this._captured[name].push(...value)
    }
    getCapture(name: string): string[] | null {
        return this._captured[name] ?? null
    }
    getOut(): string[] {
        return this._buf
    }
}

export const is = (word: string): Matcher => {
    return {
        debug: `"${word}"`,
        next(input: MatcherInput, output: MatcherOutput): boolean {
            const inputed = input.next()
            // const isOk = input === word
            let flg = regexpFlg()
            const m = new RegExp(`^(${esc(word)})$`, flg).exec(inputed)
            const isOk = !!m
            if (isOk) {
                output.out(inputed)
            }
            console.log("@@@", word, "is", inputed, new RegExp(`^(${esc(word)})$`, flg).exec(inputed) ? "yes" : "no", isOk)
            return isOk
        }
    } as Matcher
}
export const any = (): Matcher => {
    return {
        debug: "any",
        next(input: MatcherInput, output: MatcherOutput): boolean {
            const inputed = input.next()
            const ok = !!inputed && inputed.length >= 1
            if (ok) output.out(inputed)
            console.log("@@@", inputed, "any", ok)
            return ok
        }
    } as Matcher
}
export const optional = (...matchers: (string | Matcher)[]): Matcher => {
    return {
        debug: `(${matchers.map(mat => toMatcher(mat).debug ?? "???").join(" , ")})?`,
        next(input: MatcherInput, output: MatcherOutput): boolean {
            const startCur = input.getCursor()
            const matcher = toMatcher(matchers) // group matcherになる
            const ok = matcher.next(input, output)
            while (!ok && input.getCursor() > startCur) {
                input.back()
            }
            return true
        }
    }
}
export const opt = optional
export const or = (...matchers: (string | Matcher)[]): Matcher => {
    return {
        debug: `${matchers.map(mat => toMatcher(mat).debug ?? "???").join(" | ")} `,
        next(input, output): boolean {
            let ans = false
            matchers.forEach(matcher => {
                if (ans) return
                const startCursor = input.getCursor()
                const res = toMatcher(matcher).next(input, output)
                ans = ans || res
                if (!ans) {
                    while (input.getCursor() > startCursor) {
                        input.back()
                    }
                }
            })
            return ans
        }
    }
}
export const group = (...matchers: (string | Matcher)[]): Matcher => {
    return {
        debug: `${matchers.map(mat => toMatcher(mat).debug ?? "???").join(" ")} `,
        next(input, output): boolean {
            let flg = true
            matchers.forEach(matcher => {
                if (!flg) return
                flg = flg && toMatcher(matcher).next(input, output)
            })
            return flg
        }
    }
}
export const grp = group
//capture
export function capture(name: string, matcher: Matcher = any()): Matcher {
    return {
        debug: `(<${name}>:${toMatcher(matcher).debug ?? "???"})`,
        next(input, output): boolean {
            const captureStart = output._buf.length
            const ans = matcher.next(input, output)
            const captureEnd = output._buf.length
            const capture = output._buf.slice(captureStart, captureEnd)
            output.capture(name, ...capture)
            return ans
        }
    }
}
//repeat
export function repeat(...matchers: (string | Matcher)[]): Matcher {
    return {
        debug: `(${toMatcher(matchers).debug ?? "???"})*`,
        next(input, output): boolean {
            if (matchers.length <= 0) return true
            console.log("🍅🍅🍅 repeat start", input.getCursor(), toMatcher(matchers).debug);
            input.test()
            const _matchers = matchers.map(mat => toMatcher(mat))
            const expect = _matchers.length
            let whileFlg = true
            let start = input.getCursor()
            let idx = start
            while (whileFlg) {
                for (let matcher of _matchers) {
                    whileFlg = matcher.next(input, output) && !input.isEmpty()
                    console.log("in for loop", idx);
                    idx++
                    if (!whileFlg) break
                    start = idx
                }
            }
            console.log(start, idx, input.getCursor());
            // input.back() //何回backする？
            console.log(input.getCursor());
            console.log("🍅🍅🍅 repeat end", input.getCursor());
            input.test()
            return true
        }
    }
}
// repeatRange("a","b")(0,10)  //0-10回"ab"を繰り返す

// joinRepeat("a","b")(",")  // grp(("a","b"),repeat(",",grp("a","b")))) と同じ
export const joinRepeat = (...matchers: (string | Matcher)[]) => (join: string | Matcher) => (
    grp(toMatcher(matchers), repeat(toMatcher(join), toMatcher(matchers)))
)
export const debug = (name: string) => (...matchers: (string | Matcher)[]) => (
    {
        ...toMatcher(matchers),
        debug: name,
    }
)

export function toMatcher(arg: string | Matcher | (string | Matcher)[]): Matcher {
    if (typeof arg === "string") {
        return is(arg)
    }
    if (arg instanceof Array) {
        return group(...arg)
    }
    if (typeof arg?.next === "function") {
        return arg
    }
    console.error(arg, "is not matcher")
    throw new Error(`${arg} is not matcher`)
}

export function exec(
    matcher: Matcher,
    tokens: string | string[],
    keywords: string[] = [],
) {
    matcherConfig.noneCase = true
    const _tokens = typeof tokens === "string" ? toTokens(tokens, keywords) : tokens
    let cur = 0
    const input: MatcherInput = {
        next() {
            const ans = _tokens[cur]
            cur++
            return ans
        },
        back() {
            console.log("back", cur, "->", cur - 1);
            cur--
        },
        getCursor() {
            return cur
        },
        test() {
            console.log(">>>", _tokens, cur)
        },
        isEmpty() {
            return cur >= _tokens.length
        },
    }
    const output = new MatcherOutput()
    const ok = matcher.next(input, output) && input.isEmpty()
    console.log("isEmpty", input.isEmpty(), cur);
    return {
        tokens: _tokens,
        ok,
        input,
        cur,
        output,
    }
}


(() => {
    console.clear()
    const pat = grp("a", "b", repeat("c", "d", "e", "f"), "c", "d", "x")
    const str = "abcdefcdx"
    const result = exec(pat, str, ["a", "b", "c", "d", "e", "f"])
    console.log(result)
})()


