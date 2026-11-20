import { hash, verify } from '@node-rs/argon2'

/**
 * Argon2id password hashing.
 * Parameters follow the OWASP Password Storage Cheat Sheet minimum
 * (m=19 MiB, t=2, p=1). @node-rs/argon2 defaults to the Argon2id variant;
 * `isArgon2idHash` double-checks the PHC prefix on every stored value.
 */
const ARGON2_OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 } as const

export const PASSWORD_MIN_LENGTH = 6
export const PASSWORD_MAX_LENGTH = 128

const COMMON_PASSWORDS = new Set([
  '123456', '12345678', '123456789', 'password', 'password1', 'password123', 'passw0rd123', '1234567890', '12345678910', 'qwertyuiop',
  'iloveyou123', 'admin12345', 'admin1234', 'welcome123', 'letmein123', 'mithilamilan', 'mithila123',
  'mithilaadmin@2026', 'abcd123456', 'changeme123',
])

export function isArgon2idHash(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('$argon2id$')
}

/** Returns an error message when the password is unacceptable, otherwise null. */
export function validatePasswordStrength(password: string, _email?: string): string | null {
  if (typeof password !== 'string') return 'Password is required.'
  if (password.length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
  if (password.length > PASSWORD_MAX_LENGTH) return `Password must be at most ${PASSWORD_MAX_LENGTH} characters long.`
  const lowered = password.toLowerCase()
  if (COMMON_PASSWORDS.has(lowered)) return 'This password is too common. Please choose a different one.'
  return null
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS)
}

/** Constant-failure verification: returns false for any malformed / non-Argon2id stored value. */
export async function verifyPassword(storedHash: unknown, password: unknown): Promise<boolean> {
  if (!isArgon2idHash(storedHash) || typeof password !== 'string' || password.length === 0 || password.length > PASSWORD_MAX_LENGTH) {
    return false
  }
  try {
    return await verify(storedHash, password)
  } catch {
    return false
  }
}

let dummyHashPromise: Promise<string> | null = null

/** Burns comparable CPU time when the account does not exist, to blunt user-enumeration by timing. */
export async function burnPasswordCheck(password: unknown): Promise<void> {
  dummyHashPromise ??= hashPassword('mm-timing-equalisation-placeholder')
  await verifyPassword(await dummyHashPromise, password)
}
