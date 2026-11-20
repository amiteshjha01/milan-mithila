import { OAuth2Client } from 'google-auth-library'

const GOOGLE_ISSUERS = ['accounts.google.com', 'https://accounts.google.com']

export class GoogleAuthNotConfiguredError extends Error {}

export interface VerifiedGoogleIdentity {
  sub: string
  email: string
  emailVerified: boolean
  name: string
  picture?: string
}

let client: OAuth2Client | null = null

/**
 * Verifies a Google ID token completely on the server:
 *  - RS256 signature against Google's published certificates,
 *  - `aud` must equal our GOOGLE_CLIENT_ID,
 *  - `iss` must be accounts.google.com,
 *  - `exp` / `iat` must be valid,
 *  - `email_verified` must be true.
 * Throws on ANY failure. Client-supplied email/name are never trusted.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<VerifiedGoogleIdentity> {
  const audience = process.env.GOOGLE_CLIENT_ID
  if (!audience) throw new GoogleAuthNotConfiguredError('GOOGLE_CLIENT_ID is not configured')
  if (typeof idToken !== 'string' || idToken.length < 20 || idToken.length > 4096) throw new Error('Malformed token')

  client ??= new OAuth2Client(audience)
  const { certs } = await client.getFederatedSignonCertsAsync()
  const ticket = await client.verifySignedJwtWithCertsAsync(idToken, certs, audience, GOOGLE_ISSUERS)
  const payload = ticket.getPayload()
  if (!payload || !payload.sub || !payload.email) throw new Error('Incomplete token payload')
  if (payload.aud !== audience) throw new Error('Audience mismatch')
  if (!payload.iss || !GOOGLE_ISSUERS.includes(payload.iss)) throw new Error('Issuer mismatch')
  if (!payload.exp || payload.exp * 1000 <= Date.now()) throw new Error('Token expired')
  if (payload.email_verified !== true) throw new Error('Email not verified by Google')

  return {
    sub: payload.sub,
    email: payload.email.toLowerCase().trim(),
    emailVerified: true,
    name: (payload.name || payload.email.split('@')[0]).slice(0, 120),
    picture: payload.picture,
  }
}

export function resetGoogleClientForTests() {
  client = null
}
