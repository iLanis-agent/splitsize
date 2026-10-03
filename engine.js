(function (root) {
  function erf(x) {
    var s = x < 0 ? -1 : 1; x = Math.abs(x);
    var t = 1 / (1 + 0.3275911 * x);
    var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  }
  function cdf(z) { return 0.5 * (1 + erf(z / Math.SQRT2)); }
  // Acklam inverse normal CDF
  function inv(p) {
    var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    var b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    var c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    var d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    var pl = 0.02425, q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q;
    return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  // p1 = baseline rate in percent, mde in percent (relative or absolute), alpha/power in percent
  function sampleSize(p1, mde, type, alpha, power, variants, daily) {
    variants = variants || 2;
    if (!(p1 > 0 && p1 < 100) || !(mde > 0) || !(alpha > 0 && alpha < 50) || !(power > 50 && power < 100) || variants < 2 || variants > 6 || variants !== Math.floor(variants)) return null;
    var a = p1 / 100, p2 = type === 'rel' ? a * (1 + mde / 100) : a + mde / 100;
    if (!(p2 > 0 && p2 < 1) || p2 === a) return null;
    var za = inv(1 - alpha / 200), zb = inv(power / 100);
    var n = Math.ceil(Math.pow(za + zb, 2) * (a * (1 - a) + p2 * (1 - p2)) / Math.pow(p2 - a, 2));
    var r = { p1: a * 100, p2: p2 * 100, perVariant: n, total: n * variants, variants: variants, za: za, zb: zb, days: null };
    if (daily > 0) r.days = Math.ceil(r.total / daily);
    return r;
  }
  function significance(cA, nA, cB, nB) {
    if (!(nA > 0 && nB > 0) || cA < 0 || cB < 0 || cA > nA || cB > nB || cA !== Math.floor(cA) || cB !== Math.floor(cB)) return null;
    var pa = cA / nA, pb = cB / nB, pp = (cA + cB) / (nA + nB);
    var se = Math.sqrt(pp * (1 - pp) * (1 / nA + 1 / nB));
    if (se === 0) return { pa: pa, pb: pb, lift: null, z: 0, p: 1 };
    var z = (pb - pa) / se, p = 2 * (1 - cdf(Math.abs(z)));
    return { pa: pa * 100, pb: pb * 100, lift: pa > 0 ? (pb - pa) / pa * 100 : null, z: z, p: p };
  }
  var api = { cdf: cdf, inv: inv, sampleSize: sampleSize, significance: significance };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SplitSize = api;
})(typeof window !== 'undefined' ? window : this);
