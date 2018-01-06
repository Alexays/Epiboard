export default class {
    /**
    * Checks to see if localStorage is available
    * @return {bool} If localStorage available
    */
    static available() {
        try {
            const x = '__storage_test__';
            const storage = window.localStorage;

            storage.setItem(x, x);
            storage.removeItem(x);

            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Gets an item from localStorage
     * @param  {str}   key The key to retrieve
     * @return {mixed}     The value if exists
     */
    static get(key) {
        if (this.available()) {
            const item = localStorage.getItem(key);
            const itemCache = localStorage.getItem(`${key}_cache`);
            const time = new Date().getTime() / 1000;

            if (item && item !== '' && time <= parseInt(itemCache, 10)) {
                return item;
            }
        }
        return false;
    }

    /**
     * Sets an item to localStorage
     * @param  {str}   key   The key to set
     * @param  {mixed} value The value to save
     * @param  {int}   time  The time in seconds to store value
     * @return {void}
     */
    static set(key, value, time) {
        if (this.available()) {
            const now = (new Date().getTime() / 1000) + time;

            localStorage.setItem(key, value);
            localStorage.setItem(`${key}_cache`, now);
        }
    }
}
