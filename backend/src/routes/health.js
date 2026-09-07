import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", service: "drive-safe-drive-home-backend" });
});

export default router;
