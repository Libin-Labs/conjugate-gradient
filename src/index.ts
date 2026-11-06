function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
function matrix(a: readonly (readonly number[])[], square = true): number[][] {
  if (
    !Array.isArray(a) ||
    !a.length ||
    a.length > 64 ||
    !Array.isArray(a[0]) ||
    !a[0].length ||
    a[0].length > 64
  )
    throw new RangeError('Matrix size1..64');
  const n = a[0].length;
  if (square && a.length !== n) throw new RangeError('Square matrix required');
  for (const row of a) {
    if (!Array.isArray(row) || row.length !== n)
      throw new RangeError('Rectangular dense matrix required');
    for (const v of row) finite(v);
  }
  return a.map((row) => [...row]);
}
function tolerance(t: number): number {
  return finite(t, Number.MIN_VALUE, 1);
}
export function conjugateGradient(
  input: readonly (readonly number[])[],
  rhs: readonly number[],
  epsilon = 1e-10,
  maxIterations = 1000,
): { solution: number[]; iterations: number; residualNorm: number } {
  const a = matrix(input),
    n = a.length;
  tolerance(epsilon);
  integer(maxIterations, 1, 10000);
  if (!Array.isArray(rhs) || rhs.length !== n) throw new RangeError('RHS length');
  for (const v of rhs) finite(v);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < i; j++)
      if (Math.abs(a[i]![j]! - a[j]![i]!) > epsilon) throw new RangeError('Symmetry required');
  const x = Array<number>(n).fill(0);
  let r = [...rhs],
    p = [...r];
  const dot = (u: readonly number[], v: readonly number[]) =>
    finite(u.reduce((s, t, i) => finite(s + t * v[i]!), 0));
  let rr = dot(r, r);
  for (let iteration = 0; iteration <= maxIterations; iteration++) {
    const residualNorm = Math.sqrt(rr);
    if (residualNorm <= epsilon) {
      const actualResidual = a.map((row, i) => finite(dot(row, x) - rhs[i]!));
      const actualNorm = finite(Math.hypot(...actualResidual));
      if (actualNorm > epsilon)
        throw new RangeError('Recomputed residual exceeds convergence tolerance');
      return { solution: x, iterations: iteration, residualNorm: actualNorm };
    }
    if (iteration === maxIterations) throw new RangeError('Convergence budget exceeded');
    const ap = a.map((row) => dot(row, p)),
      curvature = dot(p, ap);
    if (curvature <= 0) throw new RangeError('Nonpositive search curvature');
    const alpha = finite(rr / curvature);
    for (let i = 0; i < n; i++) {
      x[i] = finite(x[i]! + alpha * p[i]!);
      r[i] = finite(r[i]! - alpha * ap[i]!);
    }
    const next = dot(r, r),
      beta = finite(next / rr);
    p = r.map((v, i) => finite(v + beta * p[i]!));
    rr = next;
  }
  throw new RangeError('Unreachable convergence state');
}
