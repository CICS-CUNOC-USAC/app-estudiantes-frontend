export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') 
    .replace(/[^a-z0-9]/g, '') 
}

function bigrams(text: string): string[] {
  const b: string[] = []
  for (let i = 0; i < text.length - 1; i++) b.push(text.slice(i, i + 2))
  return b
}

export function diceCoefficient(a: string, b: string): number {
  if (!a || !b) return 0
  const bigA = bigrams(a)
  const bigB = bigrams(b)
  if (bigA.length === 0 || bigB.length === 0) return a === b ? 1 : 0

  const setB = [...bigB]
  let intersection = 0
  for (const bg of bigA) {
    const idx = setB.indexOf(bg)
    if (idx !== -1) {
      intersection++
      setB.splice(idx, 1)
    }
  }
  return (2 * intersection) / (bigA.length + bigB.length)
}
