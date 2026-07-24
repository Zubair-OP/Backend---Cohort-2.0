import mongoose from "mongoose"

export const connectToDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI

        if (!mongoUri) {
            throw new Error('MONGO_URI is not configured')
        }

        if (mongoose.connection.readyState === 1) {
            return
        }

        await mongoose.connect(mongoUri)
        console.log('MongoDB Connected');

    } catch (error) {
        console.log('error in connecting', error)
        throw error
    }
}

export default connectToDB