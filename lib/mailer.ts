/**
 * Transactional e-mail boundary.
 *
 * No e-mail provider is configured in this project yet. Until one is wired in here,
 * password-reset links are NEVER returned in an API response. In non-production
 * environments the link is printed to the server console so developers can test the flow;
 * in production nothing is logged (the token would be a credential).
 *
 * TODO(before launch): send via a real provider (SES / Resend / SMTP) inside this function.
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  if (process.env.NODE_ENV !== 'production' && process.env.MM_LOG_RESET_LINKS === '1') {
    console.info(`[dev-mailer] password reset for ${to}: ${resetUrl}`)
  }
}
