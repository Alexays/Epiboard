import Vue from 'vue';
import App from '../../components/App';
import Header from '../../components/Header';

// Instantiate app

new Vue({
    el: '#app',
    components: {
        'app-header': Header,
        App
    }
});
