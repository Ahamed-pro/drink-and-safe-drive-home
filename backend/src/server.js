import "dotenv/config";
import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.js";
import adminsRouter from "./routes/admins.js";
import distanceRouter from "./routes/distance.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/admins", adminsRouter);
app.use("/api/distance", distanceRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Drink & Safe Drive Home backend running on port ${PORT}`);
});