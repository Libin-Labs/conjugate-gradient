# @lp-labs/conjugate-gradient

Bounded conjugate-gradient solving with curvature diagnostics.

Original, standalone MIT TypeScript implementation with **zero runtime or peer dependencies**. ESM/CommonJS exports and separate declarations; Node18+ and compatible ES2022 browsers. No service, filesystem, network, clock or browser globals accessed on import. Compiler/formatter dependencies are development-only.

## Install

```sh
npm install @lp-labs/conjugate-gradient
```

## Working example

```js
import { conjugateGradient } from '@lp-labs/conjugate-gradient';
if (Math.abs(conjugateGradient([[2]], [6]).solution[0] - 3) > 1e-10) throw new Error('CG');
```

CommonJS: `const api = require('@lp-labs/conjugate-gradient')`.

## Behavior, customization and limits

Dense finite matrix arrays1..64 each dimension, copied before work; nonfinite intermediates throw. Default absolute tolerance1e-12, positive<=1; rescale ill-conditioned input and inspect residuals in your application, no condition/error guarantee. conjugateGradient(A,b,epsilon=1e-10,maxIterations=1000) starts zero, requires symmetric matrix and positive search curvature when iterating. Returns {solution,iterations,residualNorm}, absolute residual threshold. Returned residual is independently recomputed as norm(A*x-b); a failed recomputation throws. Stops or throws on exhaustion, breakdown, nonpositive curvature. Does not certify global SPD (zero RHS may finish without curvature test). maxIterations1..10000, O(iterations*n squared), no preconditioner.

Use the explicit function arguments and public types below to customize the documented behavior. There are no hidden environment settings or sibling-library requirements. Array inputs must be dense; sparse entries are invalid. Inputs are validated before a successful result is returned. Outputs do not mutate caller-owned inputs. Hostile proxies/getters and concurrent mutation are outside the contract.

## Errors and integration

Invalid data never produces an empty success-shaped substitute. TypeError reports incompatible runtime types/nonfinite numbers; RangeError reports unsupported ranges, invalid syntax, inconsistent states and exceeded budgets. Functions that explicitly return null, false or empty arrays describe those legitimate outcomes above. Errors propagate to callers; UI applications should catch at their boundary and visibly notify users. Numerical calculations use JavaScript IEEE754 unless the API explicitly uses bigint; compare approximate numerical results with application-appropriate tolerances.

## Complete public API

```ts
export declare function conjugateGradient(
  input: readonly (readonly number[])[],
  rhs: readonly number[],
  epsilon?: number,
  maxIterations?: number,
): {
  solution: number[];
  iterations: number;
  residualNorm: number;
};
```

## Performance and portability

Complexity and resource ceilings are specified above. Buffered synchronous algorithms do not create workers or timers; callers can move expensive work to their own worker. Limits are enforced, not silently truncated. No runtime imports from any other library. No compatibility or completeness claims beyond the stated scope.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
