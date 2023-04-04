import mongoose from "mongoose"

let cachedConnection = null
let cachedPromise = null

async function connectToDatabase() {
    const cluster = process.env.CLUSTER_NAME
    const username = process.env.CLUSTER_USERNAME
    const password = process.env.CLUSTER_PASSWORD

    let stringUrl

    return new Promise((resolve, reject) => {
        try {
            if (password) {
                stringUrl = `mongodb+srv://${username}:${password}@techdeluxe.ywthmod.mongodb.net/${cluster}?retryWrites=true&w=majority`
            } else {
                stringUrl = `mongodb://localhost:27017/${cluster}`
            }

            if (!cachedPromise) {
                const options = {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }

                mongoose.set("strictQuery", false)
                mongoose
                    .connect(stringUrl, options)
                    .then((value) => {
                        cachedPromise = value
                        return resolve(value)
                    })
                    .catch((err) => {
                        throw new Error("db connection error:", err.message)
                    })
            } else resolve(cachedConnection)
        } catch (error) {
            cachedPromise = null
            reject(error.message)
            throw new Error(error.message)
        }
    })
}

export default connectToDatabase
