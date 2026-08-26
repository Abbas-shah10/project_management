import dotenv from 'dotenv';
import app from './app.js';
import connectDb from './db/connectDb.js';

dotenv.config();

const PORT = process.env.PORT || 8080;



connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on PORT http://localhost:${PORT}`)
    })

  })
  .catch((err) => {
    console.log("Error connecting to Database", err)
  })
