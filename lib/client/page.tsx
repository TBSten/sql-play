import { NextPage, Redirect } from "next"
import { FC } from "react"
import { Gssp } from "./types"

export type PageOption = {}
export type SsrOption<PageProps> = {
    get: Gssp<PageProps>,
    login?: boolean,
}

/**
 * 
 * ```tsx
 * const page = createPage<{
 *  title: string,
 * }>()
 * 
 * const TopPage = page.component(({title})=>{
 *  return <div> top page </div>
 * })
 * export default TopPage
 * 
 * export const getServerSideProps = page.ssr((ctx)->{
 *  return {
 *      props:{
 *         title: 'top page'
 *      }
 *  }
 * })
 * ```
 */
export function createPage<PageProps = {}>(option?: PageOption) {
    // component
    const component = (Component: FC<PageProps>) => {
        const Ans: NextPage<PageProps> = (props) => {
            return <>
                <Component {...props} />
            </>
        }
        return Ans
    }
    //ssr
    const ssr = ({ get: gssp, login = false, }: SsrOption<PageProps>): Gssp<PageProps> => {
        const ans: Gssp<PageProps> = async (ctx) => {
            try {
                //check login
                if (login) {
                    const isLogin = true
                    if (login) {
                        return {
                            redirect: redirectLogin,
                        }
                    }
                }
                //get props
                const res = await gssp(ctx)
                return res
            } catch (error) {
                console.error(error);
                return {
                    redirect: redirectError,
                }
            }
        }
        return ans
    }
    return {
        component,
        ssr,
    }
}

const redirectError: Redirect = {
    permanent: false,
    destination: "/error",
}
const redirectLogin: Redirect = {
    permanent: false,
    destination: "/login"
}
