export default class {
    /**
    * Tests to see if viewport within the specified width
    * @param {int} width The viewport width to Check
    * @return {bool}
    */
    mq(width) {
        const w = window;
        const d = document;
        const e = d.documentElement;
        const g = d.getElementsByTagName('body')[0];
        const x = w.innerWidth || e.clientWidth || g.clientWidth;
        return x <= width;
    }
}
