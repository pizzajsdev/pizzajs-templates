import { customAlphabet, nanoid } from 'nanoid'

const DEFAULT_NANOID_SIZE = 16

export function generateNanoId(prefix = '', size = DEFAULT_NANOID_SIZE): string {
  return `${prefix}${nanoid(size)}`
}

const readableAlphabet = 'AaBbCcDdEeFfGgHhIiJjKkLMmNnOPpQqRrSsTtUuVvWwXxYyZz2345678'
const readableNanoid = customAlphabet(readableAlphabet, DEFAULT_NANOID_SIZE)

export function generateReadableNanoId(prefix = '', size = DEFAULT_NANOID_SIZE): string {
  return `${prefix}${readableNanoid(size)}`
}
