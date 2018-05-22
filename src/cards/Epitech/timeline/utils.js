export function durationFormat(seconds) {
  const round10 = x => Math.round(x * 10) / 10;
  const cutoff = 2;
  let ret;
  if (seconds < cutoff * 60) {
    ret = `${seconds}s`;
  } else if (seconds < cutoff * 60 * 60) {
    ret = `${round10(seconds / 60)} min`;
  } else if (seconds < cutoff * 60 * 60 * 24) {
    ret = `${round10(seconds / 3600)} hours`;
  } else if (seconds < cutoff * 3600 * 24 * 30) {
    ret = `${round10(seconds / 86400)} day(s)`;
  } else if (seconds < cutoff * 3600 * 24 * 365) {
    ret = `${round10(seconds / (86400 * 30))} month(s)`;
  } else {
    ret = `${round10(seconds / (86400 * 365))} year(s)`;
  }
  return ret;
}

export function f(value) {
  return d => (value === undefined ? d : d[value]);
}
