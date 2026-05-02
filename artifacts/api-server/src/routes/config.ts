import { Router } from "express";

const router = Router();

router.get("/config", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json({
    supabaseUrl: null,
    supabaseAnonKey: null,
  });
});

export default router;
