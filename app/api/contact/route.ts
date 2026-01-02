import { NextRequest, NextResponse } from 'next/server';

// Server-side contact handler using Resend (https://resend.com)
// Requires: set RESEND_API_KEY in Vercel environment variables.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Ensure API key is configured
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY not configured. Email not sent.');
      return NextResponse.json(
        { error: 'Email service not configured. Please set RESEND_API_KEY.' },
        { status: 500 }
      );
    }

    // Determine destination email (fallback to portfolio owner)
    const toEmail = process.env.CONTACT_TO_EMAIL || 'devsaadm@gmail.com';

    // Dynamically import Resend so build won't crash when package missing during static analysis
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const safeHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <no-reply@yourdomain.com>',
      to: toEmail,
      subject: `Portfolio Contact: ${subject}`,
      html: safeHtml,
    });

    console.log('Contact form submitted and email sent:', { name, email, subject });

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email. Please try again later.' }, { status: 500 });
  }
}

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

