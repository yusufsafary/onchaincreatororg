import { Router } from "express";
import { Resend } from "resend";
import { db } from "@workspace/db";
import { waitlistTable } from "@workspace/db";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "OnchainCreator <noreply@onchaincreator.org>";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildConfirmationEmail(email: string, role: "creator" | "project"): string {
  const isCreator = role === "creator";
  const headline = isCreator
    ? "You're on the list, Creator 🎉"
    : "Your project is on the list 🎉";
  const bodyLine = isCreator
    ? "You're now on the waitlist for <strong>OnchainCreator</strong> — the marketplace where Web3 creators get discovered and paid for their content."
    : "Your project is now on the waitlist for <strong>OnchainCreator</strong> — the marketplace connecting Web3 projects with verified creators.";
  const nextStep = isCreator
    ? "We'll reach out when your creator slot opens. In the meantime, follow us on X for updates."
    : "We'll reach out to set up your project profile when your slot opens. Expect paid campaigns live soon.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headline}</title>
</head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#141414;border:1px solid #242424;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;border-bottom:1px solid #242424;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;vertical-align:middle;">
                    <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="30" height="30" rx="7" fill="#090909"/>
                      <circle cx="9" cy="15" r="5" stroke="#E8F000" stroke-width="2.2" fill="none"/>
                      <line x1="14.2" y1="12.5" x2="15.8" y2="12.5" stroke="#E8F000" stroke-width="2.2" stroke-linecap="round"/>
                      <line x1="14.2" y1="17.5" x2="15.8" y2="17.5" stroke="#E8F000" stroke-width="2.2" stroke-linecap="round"/>
                      <circle cx="21" cy="15" r="5.5" fill="#E8F000"/>
                      <circle cx="21" cy="15" r="2.4" fill="#090909"/>
                    </svg>
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-size:15px;font-weight:700;color:#F5F5F5;letter-spacing:-0.3px;">OnchainCreator</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 28px;">
              <!-- Badge -->
              <div style="display:inline-block;background:#E8F00018;border:1px solid #E8F00040;border-radius:100px;padding:4px 12px;margin-bottom:24px;">
                <span style="font-size:11px;font-weight:600;color:#E8F000;letter-spacing:0.08em;text-transform:uppercase;">
                  ${isCreator ? "Creator Waitlist" : "Project Waitlist"}
                </span>
              </div>
              <h1 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#F5F5F5;line-height:1.2;letter-spacing:-0.5px;">
                ${headline}
              </h1>
              <p style="margin:0 0 20px;font-size:15px;color:#8A8A8A;line-height:1.6;">
                ${bodyLine}
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#8A8A8A;line-height:1.6;">
                ${nextStep}
              </p>
              <!-- CTA -->
              <a href="https://onchaincreator.org" style="display:inline-block;background:#E8F000;color:#0D0D0D;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:100px;">
                Visit OnchainCreator →
              </a>
            </td>
          </tr>
          <!-- Divider row -->
          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px;background:#242424;"></div>
            </td>
          </tr>
          <!-- What to expect -->
          <tr>
            <td style="padding:24px 32px 28px;">
              <p style="margin:0 0 16px;font-size:11px;font-weight:600;color:#555;letter-spacing:0.1em;text-transform:uppercase;">What happens next</p>
              <table cellpadding="0" cellspacing="0" width="100%">
                ${isCreator ? `
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:20px;height:20px;background:#E8F00015;border-radius:50%;text-align:center;line-height:20px;font-size:10px;color:#E8F000;font-weight:700;margin-right:10px;">1</span>
                    <span style="font-size:14px;color:#8A8A8A;">We review your profile &amp; reach history</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:20px;height:20px;background:#E8F00015;border-radius:50%;text-align:center;line-height:20px;font-size:10px;color:#E8F000;font-weight:700;margin-right:10px;">2</span>
                    <span style="font-size:14px;color:#8A8A8A;">You get access to live campaigns</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:20px;height:20px;background:#E8F00015;border-radius:50%;text-align:center;line-height:20px;font-size:10px;color:#E8F000;font-weight:700;margin-right:10px;">3</span>
                    <span style="font-size:14px;color:#8A8A8A;">Complete campaigns, get paid in USD</span>
                  </td>
                </tr>` : `
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:20px;height:20px;background:#E8F00015;border-radius:50%;text-align:center;line-height:20px;font-size:10px;color:#E8F000;font-weight:700;margin-right:10px;">1</span>
                    <span style="font-size:14px;color:#8A8A8A;">We set up your project profile</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:20px;height:20px;background:#E8F00015;border-radius:50%;text-align:center;line-height:20px;font-size:10px;color:#E8F000;font-weight:700;margin-right:10px;">2</span>
                    <span style="font-size:14px;color:#8A8A8A;">Launch campaigns to verified creators</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;vertical-align:top;">
                    <span style="display:inline-block;width:20px;height:20px;background:#E8F00015;border-radius:50%;text-align:center;line-height:20px;font-size:10px;color:#E8F000;font-weight:700;margin-right:10px;">3</span>
                    <span style="font-size:14px;color:#8A8A8A;">Track content performance &amp; pay creators</span>
                  </td>
                </tr>`}
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#0D0D0D;border-top:1px solid #1C1C1C;">
              <p style="margin:0;font-size:12px;color:#555;line-height:1.6;">
                You received this because you signed up at
                <a href="https://onchaincreator.org" style="color:#E8F000;text-decoration:none;">onchaincreator.org</a>.
                Not you? You can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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

  const normalizedEmail = String(email).toLowerCase().trim();
  const normalizedRole = role as "creator" | "project";

  let alreadyOnList = false;

  try {
    await db.insert(waitlistTable).values({
      email: normalizedEmail,
      role: normalizedRole,
      handle: handle ? String(handle) : null,
      chain: chain ? String(chain) : null,
    });
  } catch (err: unknown) {
    const pgError = err as { code?: string };
    if (pgError?.code === "23505") {
      alreadyOnList = true;
    } else {
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  }

  // Send confirmation email (fire-and-forget — don't block the response)
  resend.emails.send({
    from: FROM_EMAIL,
    to: normalizedEmail,
    subject: normalizedRole === "creator"
      ? "You're on the OnchainCreator waitlist 🎉"
      : "Your project is on the OnchainCreator waitlist 🎉",
    html: buildConfirmationEmail(normalizedEmail, normalizedRole),
  }).catch(() => {
    // Email failure is non-critical — log silently
  });

  res.json({
    success: true,
    message: alreadyOnList ? "Already on the waitlist!" : "Added to waitlist!",
  });
});

export default router;
