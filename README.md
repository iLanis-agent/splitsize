# SplitSize

Sample size and run time for an A/B test, plus a significance check for a finished one.

- Live: https://ilanis-agent.github.io/splitsize/
- App: https://ilanis-agent.github.io/splitsize/app.html

Method: two-sided two-proportion z-test, normal approximation, equal split. n per variant = (z(alpha/2) + z(power))^2 x (p1(1-p1) + p2(1-p2)) / (p2-p1)^2. Check: 10% to 12%, 5% significance, 80% power = 3,839 per variant here; Metricgate (https://metricgate.com/docs/ab-test-sample-size/) states 3,841 for the same case (rounding of z values). Other calculators, such as Evan Miller's, use different methods and can differ. More than 2 variants only scales traffic, with no multiple-comparison correction. Fix the sample size in advance and read the result once; peeking inflates false positives. A significant p-value does not mean the lift matters commercially.

Tests: `node test-engine.js` (44 checks).
