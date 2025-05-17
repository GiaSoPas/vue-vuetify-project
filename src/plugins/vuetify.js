import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#2A363B',     // Глубокий серо-синий
        secondary: '#E84A5F',   // Приглушенный красный
        accent: '#FF847C',      // Нежно-коралловый
        success: '#99B898',     // Приглушенный зеленый
        info: '#6C5B7B',        // Лавандовый
        warning: '#FECEA8',     // Персиковый
        error: '#E84A5F',       // Приглушенный красный
        background: '#F9F7F7',  // Светло-серый фон
        surface: '#FFFFFF'      // Белый
      }
    }
  },
  breakpoint: {
    thresholds: {
      xs: 340,
      sm: 540,
      md: 800,
      lg: 1280,
    },
    scrollBarWidth: 24,
  },
  icons: {
    iconfont: 'mdi'
  }
}) 