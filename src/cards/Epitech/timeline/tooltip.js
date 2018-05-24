/* global d3 */

export default function (f, dom = 'body') {
  const selection = d3.select(dom).append('div')
    .style('position', 'absolute')
    .style('padding', '10px')
    .style('background', '#fff')
    .style('border', '1px solid #aaa')
    .style('border-radius', '2px')
    .style('z-index', '32767')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  selection.show = function show(...args) {
    selection.transition()
      .duration(100)
      .style('opacity', 0.95);
    f(...args, selection);
    selection
      .style('left', `${d3.event.pageX}px`)
      .style('top', `${d3.event.pageY - 28}px`);
  };

  selection.hide = function hide() {
    selection.transition()
      .duration(100)
      .style('opacity', 0);
  };

  return selection;
}
