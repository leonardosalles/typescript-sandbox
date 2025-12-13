export function runTransformer(transformer: string, payload: any) {
  const fn = new Function("payload", transformer);
  return fn(payload);
}

export function evaluateCondition(condition: string, ctx: any) {
  return new Function("ctx", `return ${condition}`)(ctx);
}
