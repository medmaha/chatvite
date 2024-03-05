import mongoose from "mongoose"

let cachedConnection = null
let cachedPromise = null

/**
 * Connects to the MongoDB Database
 */
async function connectToDatabase() {
    const cluster = process.env.CLUSTER_NAME
    const username = process.env.CLUSTER_USERNAME
    const password = process.env.CLUSTER_PASSWORD

    let connectionString

    return new Promise((resolve, reject) => {
        try {
            if (password) {
                connectionString = `mongodb+srv://${username}:${password}@techdeluxe.ywthmod.mongodb.net/${cluster}?retryWrites=true&w=majority`
            } else {
                connectionString = `mongodb://localhost:27017/${cluster}`
            }

            if (!cachedPromise) {
                const options = {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }

                mongoose.set("strictQuery", false)
                mongoose
                    .connect(connectionString, options)
                    .then((value) => {
                        cachedPromise = value
                        return resolve(value)
                    })
                    .catch((err) => {
                        throw new Error("db connection error:", err)
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
