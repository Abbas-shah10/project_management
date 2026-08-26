import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log(`Database connected successfully!`)
  } catch (error) {
    console.error('MongoDB Connected failed', error);
    process.exit(1);
  }
}

export default connectDb;