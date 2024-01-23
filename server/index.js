import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/server/user', userRouter);
app.use('/server/auth', authRouter);

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log('Servidor en puerto 3000');
});
