/**
 * CyanReserve – Brevo Email Service
 * Handles all transactional emails via the Brevo (Sendinblue) REST API.
 *
 * Required environment variables:
 *   BREVO_API_KEY       – Your Brevo v3 API key
 *   BREVO_FROM_EMAIL    – Verified sender address (e.g. noreply@cyanreserve.com)
 *   BREVO_FROM_NAME     – Sender display name   (e.g. CyanReserve)
 *   NEXT_PUBLIC_APP_URL – App public URL         (e.g. https://cyanreserve.com)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

interface BrevoEmailAddress {
  email: string;
  name?: string;
}

interface BrevoSendPayload {
  sender: BrevoEmailAddress;
  to: BrevoEmailAddress[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

// ─── Core sender ─────────────────────────────────────────────────────────────

async function sendBrevoEmail(payload: BrevoSendPayload): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey || apiKey === 'your-brevo-api-key-here') {
    console.warn('[CyanReserve Email] BREVO_API_KEY not configured – email skipped.');
    return { success: false, error: 'Brevo API key not configured.' };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept':       'application/json',
        'api-key':      apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      console.error('[CyanReserve Email] Brevo API error:', errorBody);
      return { success: false, error: JSON.stringify(errorBody) };
    }

    console.log('[CyanReserve Email] Email sent successfully to', payload.to.map(t => t.email).join(', '));
    return { success: true };
  } catch (err: any) {
    console.error('[CyanReserve Email] Network / fetch error:', err.message);
    return { success: false, error: err.message };
  }
}

// ─── Shared HTML wrapper ──────────────────────────────────────────────────────

function emailWrapper(bodyHtml: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CyanReserve</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7; }
    .container { max-width: 600px; margin: 40px auto; background: #18181b; border-radius: 24px; overflow: hidden; border: 1px solid #27272a; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 36px 40px; text-align: center; }
    .header-logo { font-size: 22px; font-weight: 900; color: #09090b; letter-spacing: -0.5px; }
    .header-tag  { font-size: 10px; font-weight: 700; color: #09090b; opacity: 0.7; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; }
    .body  { padding: 40px; }
    .title { font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 12px; line-height: 1.3; }
    .subtitle { font-size: 14px; color: #a1a1aa; font-weight: 300; line-height: 1.7; margin-bottom: 28px; }
    .card  { background: #09090b; border: 1px solid #27272a; border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    .card-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #27272a; font-size: 13px; }
    .card-row:last-child { border-bottom: none; }
    .card-label { color: #71717a; font-weight: 500; }
    .card-value { color: #f4f4f5; font-weight: 700; text-align: right; }
    .badge { display: inline-block; background: #f59e0b; color: #09090b; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; }
    .btn { display: block; width: fit-content; margin: 24px auto 0; background: linear-gradient(135deg, #f59e0b, #d97706); color: #09090b; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 14px; text-decoration: none; text-align: center; }
    .divider { border: none; border-top: 1px solid #27272a; margin: 28px 0; }
    .footer { padding: 24px 40px; background: #09090b; text-align: center; font-size: 11px; color: #52525b; line-height: 1.8; }
    .footer a { color: #f59e0b; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-logo">🍽 CyanReserve</div>
      <div class="header-tag">Premium Fine Dining</div>
    </div>

    <div class="body">
      ${bodyHtml}
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} CyanReserve · Premium Fine Dining Reservations</p>
      <p style="margin-top:6px"><a href="${appUrl}">Visit CyanReserve</a> · <a href="${appUrl}/restaurants">Explore Restaurants</a></p>
      <p style="margin-top:10px;font-size:10px;color:#3f3f46;">You are receiving this email because you have an account with CyanReserve.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ─── 1. Welcome email (sent after successful registration) ───────────────────

export async function sendWelcomeEmail(user: {
  name: string;
  email: string;
  role: string;
}): Promise<{ success: boolean; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const rolePretty = user.role === 'owner' ? 'Restaurant Owner' : 'Dining Guest';

  const bodyHtml = `
    <h1 class="title">Welcome to CyanReserve, ${user.name.split(' ')[0]}! 🎉</h1>
    <p class="subtitle">
      Your <strong>${rolePretty}</strong> account has been created. You now have access to exclusive dining reservations at Michelin-star restaurants and premium culinary venues.
    </p>

    <div class="card">
      <div class="card-row">
        <span class="card-label">Account Name</span>
        <span class="card-value">${user.name}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Email</span>
        <span class="card-value">${user.email}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Account Type</span>
        <span class="card-value"><span class="badge">${rolePretty}</span></span>
      </div>
    </div>

    <hr class="divider" />

    <p style="font-size:13px;color:#a1a1aa;line-height:1.7;">
      Here's what you can do now:
    </p>
    <ul style="margin:12px 0 0 18px;font-size:13px;color:#a1a1aa;line-height:2;">
      <li>Browse curated fine dining restaurants</li>
      <li>Book tables instantly with real-time confirmations</li>
      <li>Pre-order signature dishes before you arrive</li>
      <li>Save favourite restaurants and track booking history</li>
    </ul>

    <a href="${appUrl}/restaurants" class="btn">Explore Restaurants →</a>
  `;

  return sendBrevoEmail({
    sender: {
      email: process.env.BREVO_FROM_EMAIL ?? 'noreply@cyanreserve.com',
      name:  process.env.BREVO_FROM_NAME  ?? 'CyanReserve',
    },
    to: [{ email: user.email, name: user.name }],
    subject: `Welcome to CyanReserve, ${user.name.split(' ')[0]}! 🍽`,
    htmlContent: emailWrapper(bodyHtml),
    textContent: `Welcome to CyanReserve, ${user.name}! Your ${rolePretty} account is ready. Visit: ${appUrl}/restaurants`,
  });
}

// ─── 2. Booking confirmation email (sent after successful reservation) ────────

export async function sendBookingConfirmationEmail(booking: {
  customerName: string;
  customerEmail: string;
  restaurantName: string;
  restaurantImage?: string;
  date: string;
  time: string;
  guests: number;
  id: string;
  specialRequests?: string;
  preOrderItems?: Array<{ name: string; quantity: number; price: number }>;
}): Promise<{ success: boolean; error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const firstName = booking.customerName.split(' ')[0];

  // Format date nicely
  let dateFormatted = booking.date;
  try {
    dateFormatted = new Date(booking.date).toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch {}

  // Pre-order table rows
  const preOrderHtml = (booking.preOrderItems && booking.preOrderItems.length > 0)
    ? `
      <hr class="divider" />
      <p style="font-size:12px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Pre-ordered Dishes</p>
      <div class="card">
        ${booking.preOrderItems.map(item => `
          <div class="card-row">
            <span class="card-label">${item.name} × ${item.quantity}</span>
            <span class="card-value">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="card-row">
          <span class="card-label" style="font-weight:700;color:#f4f4f5;">Total Pre-order</span>
          <span class="card-value" style="color:#f59e0b;font-size:15px;">
            $${booking.preOrderItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}
          </span>
        </div>
      </div>
    `
    : '';

  const specialRequestsHtml = booking.specialRequests
    ? `<p style="font-size:13px;color:#a1a1aa;margin-top:16px;background:#09090b;border:1px solid #27272a;border-radius:12px;padding:14px;"><strong style="color:#f4f4f5;">Special Requests:</strong> ${booking.specialRequests}</p>`
    : '';

  const bodyHtml = `
    <h1 class="title">Booking Confirmed! ✅</h1>
    <p class="subtitle">
      Hi ${firstName}, your table reservation at <strong style="color:#f59e0b">${booking.restaurantName}</strong> has been received and is pending confirmation from the restaurant.
    </p>

    <div class="card">
      <div class="card-row">
        <span class="card-label">Booking Reference</span>
        <span class="card-value" style="font-family:monospace;color:#f59e0b;">#${booking.id.toUpperCase()}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Restaurant</span>
        <span class="card-value">${booking.restaurantName}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Date</span>
        <span class="card-value">${dateFormatted}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Time</span>
        <span class="card-value">${booking.time}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Party Size</span>
        <span class="card-value">${booking.guests} ${booking.guests === 1 ? 'Guest' : 'Guests'}</span>
      </div>
      <div class="card-row">
        <span class="card-label">Status</span>
        <span class="card-value"><span class="badge" style="background:#f59e0b">Pending Confirmation</span></span>
      </div>
    </div>

    ${specialRequestsHtml}
    ${preOrderHtml}

    <hr class="divider" />

    <p style="font-size:13px;color:#a1a1aa;line-height:1.7;">
      The restaurant will review and confirm your reservation shortly. You will receive another email when confirmed. You can also view and manage your bookings from your dashboard.
    </p>

    <a href="${appUrl}/dashboard/customer" class="btn">View My Bookings →</a>
  `;

  return sendBrevoEmail({
    sender: {
      email: process.env.BREVO_FROM_EMAIL ?? 'noreply@cyanreserve.com',
      name:  process.env.BREVO_FROM_NAME  ?? 'CyanReserve',
    },
    to: [{ email: booking.customerEmail, name: booking.customerName }],
    subject: `Booking Confirmed at ${booking.restaurantName} – #${booking.id.toUpperCase()}`,
    htmlContent: emailWrapper(bodyHtml),
    textContent: `Hi ${firstName}! Your table at ${booking.restaurantName} on ${booking.date} at ${booking.time} for ${booking.guests} guests has been received. Booking ref: ${booking.id}. View at: ${appUrl}/dashboard/customer`,
  });
}
