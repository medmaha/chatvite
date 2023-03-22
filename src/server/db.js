import mongoose from "mongoose"

let cachedConnection = null
let cachedPromise = null

async function connectToDatabase() {
    const cluster = process.env.CLUSTER_NAME
    const username = process.env.CLUSTER_USERNAME
    const password = process.env.CLUSTER_PASSWORD

    let stringUrl
    if (password) {
        stringUrl = `mongodb+srv://${username}:${password}@${cluster}.1yqj89a.mongodb.net/?retryWrites=true&w=majority`
    } else {
        stringUrl = `mongodb://localhost:27017/${cluster}`
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
