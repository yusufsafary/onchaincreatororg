import { Router } from "express";
import { db } from "@workspace/db";
import { waitlistTable } from "@workspace/db";

const router = Router();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post("/waitlist", async (req, res) => {
  const { email, role, handle, chain } = req.body ?? {};

  if (!email || !isValidEmail(String(email))) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  if (!["creator", "project"].includes(role)) {
    res.status(400).json({ error: "Role must be creator or project" });
    return;
  }

  try {
    await db.insert(waitlistTable).values({
      email: String(email).toLowerCase().trim(),
      role: role as "creator" | "project",
      handle: handle ? String(handle) : null,
      chain: chain ? String(chain) : null,
    });
    res.json({ success: true, message: "Added to waitlist!" });
  } catch (err: unknown) {
    const pgError = err as { code?: string };
    if (pgError?.code === "23505") {
      res.json({ success: true, message: "Already on the waitlist!" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
