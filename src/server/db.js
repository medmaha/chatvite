import mongoose from "mongoose"

let cachedConnection = null
let cachedPromise = null

async function connectToDatabase() {
    const localConnectionString = "mongodb://localhost:27017/chatfuse"
    const connectionString =
        "mongodb+srv://medmaha:medmaha@cluster0.n6wbg5o.mongodb.net"

    if (cachedConnection) {
        return cachedConnection
    }

    if (!cachedPromise) {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }

        mongoose.set("strictQuery", false)
        cachedPromise = mongoose.connect(connectionString, options)
    }

    cachedConnection = await cachedPromise

    return cachedConnection
}

export default connectToDatabase
