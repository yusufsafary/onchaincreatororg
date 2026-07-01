import { Router } from "express";

const router = Router();

router.get("/config", (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
  });
});

export default router;
