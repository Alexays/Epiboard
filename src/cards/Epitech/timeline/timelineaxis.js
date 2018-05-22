/* global d3 */

const axisRight = 1;
const axisLeft = 2;
const axisNone = 0;

function timelineAxis(orient, scale) {
  const lineColor = '#AAA';
  let colors = ['#FFF', '#EEE'];
  let padding = 5;
  let range;
  let trim = 40;
  let width = 100;

  function maxTextWidth(selection) {
    if (selection.nodes().length === 0) {
      return 0;
    }
    return d3.max(selection.nodes().map(d => d.getComputedTextLength()));
  }

  function trimLongString(value) {
    return d => (d.length > value ? `${d.slice(0, value - 1)}\u2026` : d);
  }

  function axis(selection) {
    const domain = scale.domain();
    const colorscale = d3.scaleOrdinal(colors);
    const labels = trimLongString(trim);
    let row = selection.selectAll('.row').data(domain, scale).order();
    const rowEnter = row.enter().append('g').attr('class', 'row');
    const rowExit = row.exit();
    let offset;
    row = row.merge(rowEnter)
      .attr('transform', d => `translate(0,${scale(d)})`);
    rowExit.remove();
    rowEnter.append('rect')
      .attr('y', 0.5)
      .attr('width', width)
      .attr('height', scale.bandwidth())
      .attr('stroke', lineColor)
      .attr('stroke-width', 0.75)
      .attr('fill', colorscale); // should be re-done if domain changed?
    if (orient !== axisNone) {
      const texts = row.select('text').merge(rowEnter.append('text')
        .attr('y', scale.bandwidth() / 2)
        .attr('dy', '0.32em')).text(labels);
      const textWidthLimit = width * 0.2;
      offset = maxTextWidth(texts) + padding + padding;
      offset = Math.min(textWidthLimit, offset);
      offset = orient === axisRight ? width - offset : offset;
      range = orient === axisRight ? [0, offset] : [offset, width];
      texts
        .attr('text-anchor', orient === axisRight ? 'start' : 'end')
        .attr('dx', orient === axisRight ? padding : -padding)
        .attr('x', offset);
    } else {
      range = [0, width];
      offset = 0;
    }
    selection.append('path')
      .attr('stroke', lineColor)
      .attr('d', `M${offset + 0.5},0.5V${scale.range()[1]}`);
  }
  axis.drawTicks = function axisDrawTicks(selection, ticks) {
    selection.selectAll('.row').select('path')
      .attr('d', ticks.map(t => `M${t},1v${scale.bandwidth() - 1}`).join(''));
  };

  /* eslint-disable */
  axis.scale = function (_) {
    return arguments.length ? (scale = _, axis) : scale
  };
  axis.width = function (_) {
    return arguments.length ? (width = _, axis) : width
  };
  axis.colors = function (_) {
    return arguments.length ? (colors = _, axis) : colors
  };
  axis.padding = function (_) {
    return arguments.length ? (padding = _, axis) : padding
  };
  axis.range = function (_) {
    return arguments.length ? (range = _, axis) : range
  };
  axis.trim = function (_) {
    return arguments.length ? (trim = _, axis) : trim
  };
  /* eslint-enable */

  return axis;
}

export function timelineAxisLeft(scale) {
  return timelineAxis(axisLeft, scale);
}

export function timelineAxisRight(scale) {
  return timelineAxis(axisRight, scale);
}

export function timelineAxisNone(scale) {
  return timelineAxis(axisNone, scale);
}
