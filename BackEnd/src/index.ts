import { sequelize } from "./config";
import { Router, Request, Response } from "express";
import express from "express";
import authRouter from "./routes/authUser/authMe";
import login from "./routes/authUser/login";
import register from "./routes/authUser/register";
 import profile from "./routes/authUser/users";
import editProfile from "./routes/authUser/editUser";
import deletePets from "./routes/pets/deletePets";
import editPets from "./routes/pets/editPets";
import getPest from "./routes/pets/getPest";
import mapPets from "./routes/pets/mapPets";
import onePets from "./routes/pets/onePets";
import postPets from "./routes/pets/postPets";
import adoptPets from "./routes/petsNotification/adoptPets";
import alertPets from "./routes/petsNotification/alertPets";
import cors from "cors";


const app = express();
app.use(cors());

app.use(express.json());

app.use("/api", authRouter);
app.use("/api", login);
app.use("/api", register);
app.use("/api", profile);
app.use("/api", editProfile);
app.use("/api", deletePets);
app.use("/api", editPets);
app.use("/api", getPest);
app.use("/api/pets", mapPets);
app.use("/api", onePets);
app.use("/api", postPets);
app.use("/api", adoptPets);
app.use("/api", alertPets);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("✅ DB Conectada");
  } catch (e) {
    console.error("❌ Error DB:", e);
  }
});
