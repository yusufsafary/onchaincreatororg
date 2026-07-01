const SITE_URL = process.env.SITE_URL || 'https://onchaincreator.org';
const FROM_EMAIL = process.env.FROM_EMAIL || 'OnchainCreator <noreply@onchaincreator.org>';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function emailHtml(magicLink, email) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;min-height:100vh;">
<tr><td align="center" style="padding:40px 16px;">
<table width="100%" style="max-width:520px;background:#141414;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
<tr>
  <td style="padding:32px 36px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:10px;">
        <svg width="28" height="28" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="30" height="30" rx="7" fill="#090909"/>
          <circle cx="9" cy="15" r="5" stroke="#E8F000" stroke-width="2.2" fill="none"/>
          <line x1="14.2" y1="12.5" x2="15.8" y2="12.5" stroke="#E8F000" stroke-width="2.2" stroke-linecap="round"/>
          <line x1="14.2" y1="17.5" x2="15.8" y2="17.5" stroke="#E8F000" stroke-width="2.2" stroke-linecap="round"/>
          <circle cx="21" cy="15" r="5.5" fill="#E8F000"/>
          <circle cx="21" cy="15" r="2.4" fill="#090909"/>
        </svg>
      </td>
      <td><span style="font-size:15px;font-weight:700;color:#ffffff;letter-spacing:-0.4px;">OnchainCreator</span></td>
    </tr></table>
  </td>
</tr>
<tr>
  <td style="padding:36px 36px 28px;">
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Your sign-in link</p>
    <p style="margin:0 0 28px;font-size:14px;color:#888;line-height:1.6;">
      Click the button below to sign in to OnchainCreator. This link expires in 60 minutes and can only be used once.
    </p>
    <table cellpadding="0" cellspacing="0"><tr><td>
      <a href="${magicLink}" style="display:inline-block;padding:13px 28px;background:#E8F000;color:#0D0D0D;font-size:14px;font-weight:700;text-decoration:none;border-radius:6px;letter-spacing:-0.2px;">
        Sign in to OnchainCreator
      </a>
    </td></tr></table>
    <p style="margin:24px 0 0;font-size:12px;color:#555;line-height:1.6;">
      Or copy this link into your browser:<br/>
      <span style="word-break:break-all;color:#777;">${magicLink}</span>
    </p>
  </td>
</tr>
<tr>
  <td style="padding:20px 36px;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
      If you did not request this link, you can safely ignore this email. No account will be created.<br/>
      onchaincreator.org
    </p>
  </td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email } = req.body || {};
  if (!email || !isValidEmail(String(email))) {
    res.status(400).json({ error: 'Valid email is required' });
    return;
  }

  const cleanEmail = String(email).toLowerCase().trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !serviceRoleKey || !resendKey) {
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    // 1. Generate magic link via Supabase Admin REST API
    const supabaseRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/generate_link`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          type: 'magiclink',
          email: cleanEmail,
          options: { redirect_to: `${SITE_URL}/#dashboard` },
        }),
      }
    );

    if (!supabaseRes.ok) {
      const errBody = await supabaseRes.json().catch(() => ({}));
      console.error('Supabase generate_link error:', errBody);
      res.status(500).json({ error: 'Could not generate sign-in link' });
      return;
    }

    const supabaseData = await supabaseRes.json();
    const magicLink =
      supabaseData.action_link ||
      supabaseData.properties?.action_link;

    if (!magicLink) {
      console.error('No action_link in Supabase response:', supabaseData);
      res.status(500).json({ error: 'Could not generate sign-in link' });
      return;
    }

    // 2. Send email via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: cleanEmail,
        subject: 'Your OnchainCreator sign-in link',
        html: emailHtml(magicLink, cleanEmail),
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.json().catch(() => ({}));
      console.error('Resend error:', errBody);
      res.status(500).json({ error: 'Could not send email' });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error('magic-link error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
