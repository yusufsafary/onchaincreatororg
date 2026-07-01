function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function buildHtml(role) {
  const isCreator = role === "creator";
  const headline = isCreator ? "You&#39;re on the list, Creator &#127881;" : "Your project is on the list &#127881;";
  const bodyLine = isCreator
    ? "You&#39;re now on the waitlist for <strong>OnchainCreator</strong> &mdash; the marketplace where Web3 creators get discovered and paid for their content."
    : "Your project is now on the waitlist for <strong>OnchainCreator</strong> &mdash; the marketplace connecting Web3 projects with verified creators.";
  const nextStep = isCreator
    ? "We&#39;ll reach out when your creator slot opens. Follow us on X for updates."
    : "We&#39;ll reach out to set up your project profile when your slot opens.";
  const steps = isCreator
    ? [["1","Review your profile &amp; reach history"],["2","Get access to live campaigns"],["3","Complete campaigns, get paid in USD"]]
    : [["1","Set up your project profile"],["2","Launch campaigns to verified creators"],["3","Track performance &amp; pay creators"]];

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:48px 16px;"><tr><td align="center">
<table width="100%" style="max-width:560px;background:#141414;border:1px solid #242424;border-radius:16px;overflow:hidden;">
<tr><td style="padding:32px 32px 24px;border-bottom:1px solid #242424;">
<span style="font-size:15px;font-weight:700;color:#F5F5F5;">&#9711; OnchainCreator</span>
</td></tr>
<tr><td style="padding:32px 32px 28px;">
<div style="display:inline-block;background:#E8F00018;border:1px solid #E8F00040;border-radius:100px;padding:4px 12px;margin-bottom:24px;">
<span style="font-size:11px;font-weight:600;color:#E8F000;letter-spacing:0.08em;text-transform:uppercase;">${isCreator ? "Creator Waitlist" : "Project Waitlist"}</span></div>
<h1 style="margin:0 0 16px;font-size:26px;font-weight:900;color:#F5F5F5;line-height:1.2;">${headline}</h1>
<p style="margin:0 0 20px;font-size:15px;color:#8A8A8A;line-height:1.6;">${bodyLine}</p>
<p style="margin:0 0 28px;font-size:15px;color:#8A8A8A;line-height:1.6;">${nextStep}</p>
<a href="https://onchaincreator.org" style="display:inline-block;background:#E8F000;color:#0D0D0D;font-size:14px;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:100px;">Visit OnchainCreator &rarr;</a>
</td></tr>
<tr><td style="padding:0 32px;"><div style="height:1px;background:#242424;"></div></td></tr>
<tr><td style="padding:24px 32px 28px;">
<p style="margin:0 0 16px;font-size:11px;font-weight:600;color:#555;letter-spacing:0.1em;text-transform:uppercase;">What happens next</p>
${steps.map(([n,t])=>`<p style="margin:0 0 8px;font-size:14px;color:#8A8A8A;"><strong style="color:#E8F000;">${n}.</strong> ${t}</p>`).join("")}
</td></tr>
<tr><td style="padding:20px 32px;background:#0D0D0D;border-top:1px solid #1C1C1C;">
<p style="margin:0;font-size:12px;color:#555;">You signed up at <a href="https://onchaincreator.org" style="color:#E8F000;text-decoration:none;">onchaincreator.org</a>. Not you? Ignore this.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, role } = req.body || {};

  if (!email || !isValidEmail(String(email))) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  if (!["creator", "project"].includes(role)) {
    res.status(400).json({ error: "Role must be creator or project" });
    return;
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const subject = role === "creator"
    ? "You're on the OnchainCreator waitlist \uD83C\uDF89"
    : "Your project is on the OnchainCreator waitlist \uD83C\uDF89";

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "OnchainCreator <noreply@onchaincreator.org>",
          to: normalizedEmail,
          subject,
          html: buildHtml(role),
        }),
      });
    } catch (_) {
      // non-critical
    }
  }

  res.status(200).json({ success: true, message: "Added to waitlist!" });
};
