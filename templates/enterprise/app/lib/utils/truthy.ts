export const truthyEnvValues = ['1', 'true', 'yes', 'ok', 'on'] as const
export const falsyEnvValues = ['0', 'false', 'no', 'off'] as const

export function isTruthyValue(value: any) {
  return truthyEnvValues.includes(String(value).trim().toLowerCase() as any)
}

export function isFalsyValue(value: any) {
  return falsyEnvValues.includes(String(value).trim().toLowerCase() as any)
}
