const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const TO_EMAIL = 'hello@constructionflows.com';
const FROM_EMAIL = process.env.RESEND_FROM || 'ConstructionFlows <hello@constructionflows.com>';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function field(label, value) {
  const safeValue = escapeHtml(value || '—').replace(/\n/g, '<br />');
  return `
    <tr>
      <td style="padding:10px 12px;border:1px solid #E2E1DC;font-weight:700;background:#F2F1ED;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border:1px solid #E2E1DC;vertical-align:top;">${safeValue}</td>
    </tr>`;
}

function buildEmailHtml(data) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#111;line-height:1.5;">
      <h1 style="font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:-0.02em;">New ConstructionFlows workflow review request</h1>
      <p>A new lead submitted the ConstructionFlows request form.</p>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        ${field('Name', data.name)}
        ${field('Email', data.email)}
        ${field('Company', data.company)}
        ${field('Workflow interest', data.agent_interest)}
        ${field('Assessment result', data.quiz_result)}
        ${field('Message', data.message)}
        ${field('Source', data.source)}
      </table>
    </div>`;
}

function buildText(data) {
  return [
    'New ConstructionFlows workflow review request',
    '',
    `Name: ${data.name || '—'}`,
    `Email: ${data.email || '—'}`,
    `Company: ${data.company || '—'}`,
    `Workflow interest: ${data.agent_interest || '—'}`,
    `Assessment result: ${data.quiz_result || '—'}`,
    `Source: ${data.source || '—'}`,
    '',
    'Message:',
    data.message || '—'
  ].join('\n');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
  }

  const data = typeof req.body === 'object' && req.body ? req.body : {};
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const payload = {
    from: FROM_EMAIL,
    to: [TO_EMAIL],
    reply_to: email,
    subject: `New ConstructionFlows workflow review lead: ${name}`,
    html: buildEmailHtml({ ...data, name, email, message, source: data.source || 'ConstructionFlows contact page' }),
    text: buildText({ ...data, name, email, message, source: data.source || 'ConstructionFlows contact page' })
  };

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok) {
      return res.status(502).json({ error: 'Resend email failed', details: result });
    }

    return res.status(200).json({ ok: true, id: result.id });
  } catch (error) {
    return res.status(500).json({ error: 'Unexpected email error' });
  }
};
