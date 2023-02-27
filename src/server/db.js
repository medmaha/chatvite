import mongoose from "mongoose"

let cachedConnection = null
let cachedPromise = null

async function connectToDatabase() {
    let stringUrl = "mongodb://localhost:27017/chatfuse"

    if (process.env.NODE_ENV === "production") {
        const cluster = process.env.CLUSTER_NAME
        const username = process.env.CLUSTER_USERNAME
        const password = process.env.CLUSTER_PASSWORD
        stringUrl = `mongodb+srv://${username}:${password}@${cluster}.faze1zl.mongodb.net`
    }

    if (cachedConnection) {
        return cachedConnection
    }

    if (!cachedPromise) {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        mongoose.set("strictQuery", false)
        cachedPromise = mongoose.connect(stringUrl, options)
    }

    cachedConnection = await cachedPromise

    return cachedConnection
}

export default connectToDatabase
