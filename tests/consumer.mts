import { conjugateGradient } from '@lp-labs/conjugate-gradient';
if (Math.abs(conjugateGradient([[2]], [6]).solution[0] - 3) > 1e-10) throw new Error('CG');
// @ts-expect-error invalid argument must be rejected by declarations
conjugateGradient([['2']], [6]);
