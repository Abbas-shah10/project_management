import 'dotenv/config';
import app from './app.js';
import connectDb from './db/connectDb.js';

const PORT = process.env.PORT || 8080;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on PORT http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to Database', err);
    process.exitCode = 1;
  });
