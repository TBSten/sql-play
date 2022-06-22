import { message } from "lib/message";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import NextCors from "nextjs-cors";

type Method = "GET" | "POST" | "PUT" | "DELETE"
export type ApiRouteOption = {
    [key in Method]?: NextApiHandler;
} & {
    cors?: Method[];
    onError?: (
        req: NextApiRequest,
        res: NextApiResponse,
        err: unknown
    ) => Promise<unknown> | unknown;
};

/**
 * ```tsx
 * const handler = apiRoute({
 *  get: async (ctx)=>({
 *      title: "",
 *  }),
 *  post: async (ctx)=>{
 *      await updateData(ctx.body.data)
 *      return {
 *         msg:"ok",
 *      }
 *  },
 *  cors:["GET","POST"]
 * })
 * export default handler
 * ```
 */
export function apiRoute(option: ApiRouteOption = {}) {
    const { cors, onError, ...methodRoutes } = option
    const handler: NextApiHandler = async (req, res) => {
        try {
            //cors
            if (cors) {
                await NextCors(req, res, {
                    origin: "*",
                    methods: cors,
                    optionsSuccessStatus: 200,
                })
            }
            let method = req.method?.toUpperCase() ?? "none method";
            method = method.toUpperCase()
            if (method in methodRoutes) {
                const route = methodRoutes[method as Method]
                return await route!(req, res)
            } else {
                return res.status(405)
                    .json(response("invalid method"))
            }
        } catch (err) {
            console.error(err);
            res.status(500)
            if (onError) {
                return await onError(req, res, err)
            } else {
                return res.json(response("unknown error"))
            }
        }
    }
    return handler
}

function response(msg: unknown = message.error.unknown, data: object = {}) {
    return {
        msg,
        ...data,
    }
}
