// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cors from "cors"

const cors = Cors({
    methods: ["POST", "GET", "HEAD"],
    origin: "*",
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res) {
    return new Promise((resolve, reject) => {
        cors(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
}

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*")
    try {
        await runMiddleware(req, res, cors)
    } catch (error) {
        console.error(error.message)
    }
    res.status(200).json({ name: "Chatvite App" })
}
