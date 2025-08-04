export function singleton<Value>(name: string, valueFactory: () => Value): Value {
  const yolo = globalThis as unknown as { __singletons: Record<string, unknown> }
  yolo.__singletons ??= {}
  yolo.__singletons[name] ??= valueFactory()
  return yolo.__singletons[name] as Value
}
