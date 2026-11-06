import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('known SPD solution', () => {
  const r = api.conjugateGradient(
    [
      [4, 1],
      [1, 3],
    ],
    [1, 2],
  );
  assert.ok(Math.abs(r.solution[0] - 1 / 11) < 1e-12);
  assert.ok(Math.abs(r.solution[1] - 7 / 11) < 1e-12);
});
test('zero rhs', () => {
  assert.equal(api.conjugateGradient([[1]], [0]).iterations, 0);
});
test('negative curvature', () => {
  assert.throws(() => api.conjugateGradient([[-1]], [1]));
});
test('budget exhaustion', () => {
  assert.throws(() =>
    api.conjugateGradient(
      [
        [4, 1],
        [1, 3],
      ],
      [1, 2],
      1e-14,
      1,
    ),
  );
});
test('symmetry and RHS', () => {
  assert.throws(() =>
    api.conjugateGradient(
      [
        [1, 2],
        [0, 1],
      ],
      [1, 1],
    ),
  );
  assert.throws(() => api.conjugateGradient([[1]], []));
});
test('residual independent reconstruction', () => {
  const a = [
      [5, 1, 0],
      [1, 6, 1],
      [0, 1, 7],
    ],
    b = [1, 2, 3],
    r = api.conjugateGradient(a, b);
  for (let i = 0; i < 3; i++)
    assert.ok(Math.abs(a[i].reduce((s, v, j) => s + v * r.solution[j], 0) - b[i]) < 1e-10);
});
test('reported residual equals independent residual', () => {
  const a = [
      [4, 1],
      [1, 3],
    ],
    b = [1, 2],
    r = api.conjugateGradient(a, b);
  const residual = Math.hypot(
    ...a.map((row, i) => row.reduce((s, v, j) => s + v * r.solution[j], 0) - b[i]),
  );
  assert.equal(r.residualNorm, residual);
});
