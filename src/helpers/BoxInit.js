export default class BoxInit {
    constructor(el) {
        this.el = el;
        this.addIsMountedClass();
    }

    /**
    * Adds the is-mounted once the component has mounted
    * @return void
    */
    addIsMountedClass() {
        this.el.parentNode.parentNode.classList.add('is-mounted');
    }
}
