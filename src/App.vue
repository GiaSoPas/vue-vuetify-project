<template>
  <v-app>
    <!-- Боковое меню -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant="mini"
      class="elevation-3"
      :color="$vuetify.theme.themes.light.background"
    >
      <!-- Заголовок меню -->
      <v-list-item class="px-4 py-3">
        <v-list-item-content>
          <v-list-item-title class="text-h6 primary--text">
            Ресторан
          </v-list-item-title>
          <v-list-item-subtitle class="text-subtitle-2 grey--text">
            Система управления
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>{{ mini ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <!-- Пункты меню -->
      <v-list
        dense
        nav
        class="py-0"
      >
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          link
          class="mb-1"
          :class="{'rounded-lg': true}"
        >
          <v-list-item-icon>
            <v-icon :color="$route.path === item.to ? 'primary' : 'grey'">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title
              :class="$route.path === item.to ? 'primary--text font-weight-medium' : ''"
            >
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Верхняя панель -->
    <v-app-bar
      app
      elevation="1"
      :color="$vuetify.theme.themes.light.background"
      class="px-2"
    >
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="rounded-lg"
      ></v-app-bar-nav-icon>
      
      <v-toolbar-title class="text-h6 primary--text font-weight-medium">
        Система управления рестораном
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Поиск -->
      <v-btn
        icon
        class="rounded-lg mr-2"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <!-- Уведомления -->
      <v-btn
        icon
        class="rounded-lg mr-2"
      >
        <v-badge
          dot
          color="error"
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <!-- Профиль -->
      <v-menu
        offset-y
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            class="rounded-lg"
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar
              size="32"
              color="primary"
            >
              <v-icon dark>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>

        <v-list
          dense
          class="rounded-lg"
        >
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Профиль</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Настройки</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Выход</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main class="main-content">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: null,
    mini: false,
    menuItems: [
      {
        title: 'Дашборд',
        icon: 'mdi-view-dashboard',
        to: '/'
      },
      {
        title: 'Новый заказ',
        icon: 'mdi-plus-circle',
        to: '/new-order'
      },
      {
        title: 'Меню',
        icon: 'mdi-book-open-variant',
        to: '/menu'
      },
      {
        title: 'Столы',
        icon: 'mdi-table-furniture',
        to: '/tables'
      },
      {
        title: 'Заказы',
        icon: 'mdi-clipboard-list',
        to: '/orders'
      },
      {
        title: 'Кухня',
        icon: 'mdi-chef-hat',
        to: '/kitchen'
      }
    ]
  })
}
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.main-content {
  background-color: var(--v-background-base);
}

/* Стили для скругленных углов */
.rounded-lg {
  border-radius: 12px !important;
}

/* Анимация для бокового меню */
.v-navigation-drawer {
  transition: width 0.3s ease-out;
}

/* Стили для активного пункта меню */
.v-list-item--active {
  background-color: var(--v-primary-lighten5) !important;
}

/* Стили для наведения на пункты меню */
.v-list-item:hover {
  background-color: var(--v-primary-lighten5) !important;
}

/* Тени для карточек */
.v-card {
  transition: box-shadow 0.3s ease-in-out;
}

.v-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}
</style>
