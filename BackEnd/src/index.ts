import { sequelize } from "./config";
import {Router, Request, Response } from 'express'
import router from "./routes/routes";
import express from 'express';

const app = express();

app.use(express.json());

app.use('/api', router);




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

