import mongoose from 'mongoose'

let connectionPromise;

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is required to connect to MongoDB');
  }

  if (!connectionPromise || mongoose.connection.readyState === 0) {
    connectionPromise = mongoose.connect(mongoUri)
      .then(() => {
        console.log('Database connected successfully!');
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  await connectionPromise;
}

export default connectDb;