export function durationFormat(seconds) {
  const round10 = x => Math.round(x * 10) / 10;
  const cutoff = 2;
  let ret;
  if (seconds < cutoff * 60) {
    ret = `${seconds | 0}s`;
  } else if (seconds < cutoff * 60 * 60) {
    ret = `${round10(seconds / 60) | 0} min`;
  } else if (seconds < cutoff * 60 * 60 * 24) {
    ret = `${round10(seconds / 3600) | 0} hours`;
  } else if (seconds < cutoff * 3600 * 24 * 30) {
    ret = `${round10(seconds / 86400) | 0} day(s)`;
  } else if (seconds < cutoff * 3600 * 24 * 365) {
    ret = `${round10(seconds / (86400 * 30)) | 0} month(s)`;
  } else {
    ret = `${round10(seconds / (86400 * 365)) | 0} year(s)`;
  }
  return ret;
}

export function countModuleOverlap(data) {
  let maxCnt = 0;
  const dates = data.map(d => ({
    start: d[2],
    end: d[3],
  }));
  for (let i = 0; i < dates.length; i += 1) {
    let cnt = 0;
    for (let j = 0; j < dates.length; j += 1) {
      if (j !== i) {
        cnt += ((dates[i].start <= dates[j].start && dates[j].start <= dates[i].end) ||
        (dates[i].start <= dates[j].end && dates[j].end <= dates[i].end) ||
        (dates[j].start < dates[i].start && dates[i].end < dates[j].end));
      }
    }
    if (cnt > maxCnt) {
      maxCnt = cnt;
    }
  }
  return maxCnt;
}

export function getOverlapOffset(data, el) {
  let index = 0;
  for (; index < data.length; index += 1) if (data[index][1] === el[1]) break;
  if (index === data.length) return 0;
  let overlap = 0;
  for (let i = index + 1; i < data.length; i += 1) {
    if (i !== index) {
      const tmp = ((data[index][2] <= data[i][2] && data[i][2] <= data[index][3]) ||
      (data[index][2] <= data[i][3] && data[i][3] <= data[index][3]) ||
      (data[i][2] < data[index][2] && data[index][3] < data[i][3]));
      overlap += tmp;
    }
  }
  return overlap;
}

export function countOverlap(data) {
  const names = [...new Set(data.map(d => d[0]))];
  return names.map(d => countModuleOverlap(data.filter(g => g[0] === d)))
    .reduce((a, b) => a + b, 0);
}

export function f(value) {
  return d => (value === undefined ? d : d[value]);
}
