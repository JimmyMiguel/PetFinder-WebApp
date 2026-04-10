// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';

const router = Router();

// Definir un endpoint de prueba
router.get('/test', (req: Request, res: Response) => {
  res.json({ message: "El router de usuarios funciona" });
});

export default router;
