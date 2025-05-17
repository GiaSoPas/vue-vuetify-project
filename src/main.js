import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

Vue.config.productionTip = false

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi'
  }
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
