import { generateKsuid, generateRandomHexString } from '../crypto/ksuid'
import { generateNanoId, generateReadableNanoId } from '../crypto/nanoid'
import { base64UrlEncode } from './base64'
import { nowMs } from './dates'

export function randomOAuthState() {
  const randomValues = new Uint8Array(10)
  crypto.getRandomValues(randomValues)
  return base64UrlEncode(randomValues.toString())
}

export function randomKsuid(prefix = 'k'): string {
  return generateKsuid(prefix, '')
}

export function randomNanoId(prefix = 'n', length = 16): string {
  return prefix + generateNanoId('', length)
}

export function randomReadableNanoId(prefix = 'n', length = 16): string {
  return prefix + generateReadableNanoId('', length).replace(/-/g, '')
}

export function randomHexString(length = 16): string {
  return generateRandomHexString(length)
}

export function randomTimestampId(prefix = 't-', suffix = ''): string {
  const randHex = randomHexString(3)
  return `${prefix}${nowMs()}-${randHex}${suffix}`
}
