export default class {
    /**
    * Creates a hash based on time type
    * @param {str} type The time for the cache string
    * @return {int}     The cache busting string
    */
    static bust(type = 'daily') {
        const date = new Date();
        return `${date.getFullYear()}${date.getMonth()}${date.getDate()}${(type === 'hourly') ? date.getHours() : ''}`;
    }
}
