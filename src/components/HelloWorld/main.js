import BoxInit from '../../helpers/BoxInit';

export default {

    name: 'hello-world',

    mounted() {
        new BoxInit(this.$el);
    }

};
