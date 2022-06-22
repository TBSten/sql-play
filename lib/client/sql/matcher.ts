

const matcherConfig = {
    noneCase: false,
}

function regexpFlg() {
    let flg = matcherConfig.noneCase ? "i" : ""
    return flg
}

export function toTokens(src: string, keywords: string[]): string[] {
    let flg = regexpFlg()
    return src.split(new RegExp(`(${keywords.map(word => word + " ").join("|")})`, flg)).filter(x => x && !x.match(/^\s+$/g)).map(x => x.trim())
}

export type MatcherInput = {
    getCursor: () => number;
    next: () => string;
    back: () => void;
    test: () => void;
}
export interface Matcher {
    // next(output: MatcherOutput, nextInput: () => string): boolean;
    next(input: MatcherInput, output: MatcherOutput): boolean;
}
export class MatcherOutput {
    _buf: string[] = []
    _captured: Record<string, string> = {}
    out(value: string) {
        this._buf.push(value)
    }
    capture(name: string, value: string) {
        this._captured[name] = value
    }
}

export const is = (word: string): Matcher => {
    return {
        next(input: MatcherInput, output: MatcherOutput): boolean {
            const inputed = input.next()
            // const isOk = input === word
            let flg = regexpFlg()
            const m = new RegExp(`^(${word})$`, flg).exec(inputed)
            const isOk = !!m
            if (isOk) {
                output.out(inputed)
            }
            return isOk
        }
    }
}
export const any = (): Matcher => {
    return {
        next(input: MatcherInput, output: MatcherOutput): boolean {
            const inputed = input.next()
            const ok = !!inputed && inputed.length >= 1
            if (ok) output.out(inputed)
            return ok
        }
    }
}
export const optional = (...matchers: (string | Matcher)[]): Matcher => {
    return {
        next(input: MatcherInput, output: MatcherOutput): boolean {
            const startCur = input.getCursor()
            const matcher = toMatcher(matchers) // group matcherになる
            const ok = matcher.next(input, output)
            while (!ok && input.getCursor() > startCur) {
                input.back()
            }
            console.log("optional",);
            input.test()
            return ok
        }
    }
}
export const opt = optional
export const or = (...matchers: (string | Matcher)[]): Matcher => {
    return {
        next(input, output): boolean {
            // let buf: string[] = []
            // let idx = -1
            matchers.forEach(matcher => {
                const startCursor = input.getCursor()
                ans = ans || toMatcher(matcher).next(input, output)
                while (input.getCursor() > startCursor) {
                    input.back()
                }
            })
            return ans
        }
    }
}
export const group = (...matchers: (string | Matcher)[]): Matcher => {
    return {
        next(input, output): boolean {
            let flg = true
            matchers.forEach(matcher => {
                flg = flg && toMatcher(matcher).next(input, output)
            })
            return flg
        }
    }
}
export const grp = group
//capture
export function capture(matcher: Matcher): Matcher {
    return {
        next(output, nextInput): boolean {
            return matcher.next(output, nextInput)
        }
    }
}
//repeat

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
            cur--
        },
        getCursor() {
            return cur
        },
        test() {
            console.log(">>>", _tokens, cur)
        }
    }
    const output = new MatcherOutput()
    const ok = matcher.next(input, output)
    return {
        tokens: _tokens,
        ok,
        output,
    }
}

// function test() {
//     console.clear()
//     matcherConfig.noneCase = true
//     const pat = grp(
//         "select", any(),
//         "from", any(),
//         opt("where", any()),
//         opt("group", "by", any(),),
//         opt("having", any(),),
//         opt("order", "by", any()),
//         opt("limit", any(),),
//         opt("offset", any(),),
//     )
//     const res = exec(pat, "SELECT col1, col2 FROM ORDER BY XXX ASC", [
//         "select", "from", "where", "group", "by", "order", "by", "limit", "offset"
//     ])
//     console.log(res);
// }
// test()


