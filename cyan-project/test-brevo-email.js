/**
 * CyanReserve — Brevo SMTP Email Tester
 * Run this script to test and verify your Brevo email credentials:
 *   node test-brevo-email.js <recipient-email-address>
 */

const fs = require('fs');
const path = require('path');

// 1. Manually parse .env variables (no external dependencies required)
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: .env file not found. Make sure it exists in the project root.');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      let val = match[2].trim();
      // Remove surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[match[1].trim()] = val;
    }
  });
  return env;
}

async function testBrevo() {
  const recipient = process.argv[2];
  if (!recipient) {
    console.error('❌ Error: Recipient email address is required.');
    console.log('\nUsage:');
    console.log('  node test-brevo-email.js <your-test-email@example.com>');
    process.exit(1);
  }

  console.log('⏳ Loading credentials from .env...');
  const env = loadEnv();
  
  const apiKey = env.BREVO_API_KEY;
  const fromEmail = env.BREVO_FROM_EMAIL || 'noreply@cyanreserve.com';
  const fromName = env.BREVO_FROM_NAME || 'CyanReserve';

  if (!apiKey || apiKey === 'your-brevo-api-key-here') {
    console.error('❌ Error: BREVO_API_KEY is not configured in your .env file.');
    console.log('👉 Please open .env and add your valid Brevo API v3 key.');
    process.exit(1);
  }

  console.log(`🔑 Brevo API Key: Loaded (starts with: ${apiKey.slice(0, 8)}...)`);
  console.log(`📧 Sender Profile: "${fromName}" <${fromEmail}>`);
  console.log(`🎯 Recipient: ${recipient}\n`);

  const payload = {
    sender: { email: fromEmail, name: fromName },
    to: [{ email: recipient, name: 'Cyan Test User' }],
    subject: '🍽 CyanReserve — Brevo Integration Test Successful!',
    htmlContent: `
      <div style="background-color: #09090b; padding: 40px; font-family: sans-serif; color: #e4e4e7; max-width: 600px; margin: 0 auto; border-radius: 20px; border: 1px solid #27272a;">
        <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">Congratulations! 🎉</h1>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">
          Your Brevo SMTP integration with <strong>CyanReserve</strong> is working perfectly.
        </p>
        <div style="background-color: #18181b; border: 1px solid #27272a; padding: 20px; border-radius: 12px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #71717a; padding: 6px 0;">SMTP Provider</td>
              <td style="color: #f4f4f5; text-align: right; font-weight: bold;">Brevo (Sendinblue)</td>
            </tr>
            <tr>
              <td style="color: #71717a; padding: 6px 0;">Connection Method</td>
              <td style="color: #f4f4f5; text-align: right; font-weight: bold;">REST API (v3 SMTP)</td>
            </tr>
            <tr>
              <td style="color: #71717a; padding: 6px 0;">Sender Account</td>
              <td style="color: #f4f4f5; text-align: right; font-weight: bold;">${fromEmail}</td>
            </tr>
          </table>
        </div>
        <p style="color: #a1a1aa; font-size: 12px;">
          If this sender is not verified in your Brevo account, you might receive success responses here, but the email will not be delivered to the inbox. Please double check that your sender domain/email is fully verified.
        </p>
      </div>
    `
  };

  console.log('✈ Sending test email payload to Brevo API...');

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok) {
      console.log('\n✅ SUCCESS!');
      console.log('📩 Brevo accepted the email. Message ID:', result.messageId);
      console.log('👉 Please check your spam folder if the email does not show in your inbox within a minute.');
    } else {
      console.error('\n❌ FAILED!');
      console.error(`Status Code: ${response.status} (${response.statusText})`);
      console.error('Error Details:', JSON.stringify(result, null, 2));
      console.log('\n💡 Troubleshooting Tips:');
      console.log('1. Verify your API key is correct and active.');
      console.log(`2. Confirm that "${fromEmail}" is verified as a sender in Brevo (Senders & IP -> Senders).`);
    }
  } catch (err) {
    console.error('\n❌ Network or Connection Error:', err.message);
  }
}

testBrevo();
