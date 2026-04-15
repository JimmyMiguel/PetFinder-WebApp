import { sequelize } from "./config";
import {Router, Request, Response } from 'express'
 import express from 'express';
import authRouter from "./routes/authMe";
import login from "./routes/login";
import register from "./routes/register";
import User from "./models/users";
 import profile from "./routes/users";
const app = express();

app.use(express.json());

 app.use('/api',authRouter)
 app.use('/api',login)
 app.use('/api',register)
 app.use('/api',profile)


const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
     try {
      await sequelize.authenticate();
      console.log('✅ DB Conectada');
    } catch (e) {
      console.error('❌ Error DB:', e);
    }
  });

