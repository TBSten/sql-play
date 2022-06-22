
import { apiRoute } from "lib/server/api"

const handler = apiRoute({
  GET: (req, res) => {
    return res.json({ msg: "ok" })
  },
  onError: (req, res, err) => {
    return res.status(500).json({ msg: "error", err })
  },
})
export default handler
