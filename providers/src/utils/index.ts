export function zeroX(input = "") {
  const { valid, output } = inputMatch(
    input,
    /^(?:0x)*([a-f0-9]+)$/i,
    "zeroXTransformer"
  )
  return (valid ? "0x" : "") + output
}

const inputMatch = (
  input: string,
  regexp: RegExp,
  conversorName: string
): { valid: boolean; output: string } => {
  if (typeof input !== "string") {
    throw new Error(
      `[${conversorName}] Expected string, input type: ${typeof input}`
    )
  }
  const match = input.match(regexp)
  if (!match) {
    return { valid: false, output: input }
  }
  return { valid: true, output: match[1] }
}
