/* eslint-disable vue/valid-v-slot */
<template>
  <v-container fluid>
    <v-row>
      <!-- Основная информация -->
      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-avatar size="64" class="mr-4">
              <v-img :src="user.avatar || 'https://cdn.vuetifyjs.com/images/john.jpg'"></v-img>
            </v-avatar>
            <div>
              <div class="text-h5">{{ user.name }}</div>
              <div class="text-subtitle-1">{{ getRoleText(user.role) }}</div>
            </div>
          </v-card-title>

          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-email</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ user.email }}</v-list-item-title>
                  <v-list-item-subtitle>Email</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ user.phone }}</v-list-item-title>
                  <v-list-item-subtitle>Телефон</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-calendar</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ formatDate(user.createdAt) }}</v-list-item-title>
                  <v-list-item-subtitle>Дата регистрации</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Статистика -->
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
            Статистика
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <v-hover v-slot="{ hover }">
                  <v-card
                    :elevation="hover ? 8 : 2"
                    :class="{ 'on-hover': hover }"
                    class="transition-swing"
                    outlined
                  >
                    <v-card-text class="text-center">
                      <v-icon
                        size="36"
                        color="primary"
                        class="mb-2"
                      >
                        mdi-receipt
                      </v-icon>
                      <div class="text-h4 font-weight-bold primary--text mb-1">
                        {{ stats.totalOrders }}
                      </div>
                      <div class="text-subtitle-1 grey--text">
                        Всего заказов
                      </div>
                      <v-divider class="my-3"></v-divider>
                      <div class="text-caption grey--text">
                        За все время
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>

              <v-col cols="12" sm="6">
                <v-hover v-slot="{ hover }">
                  <v-card
                    :elevation="hover ? 8 : 2"
                    :class="{ 'on-hover': hover }"
                    class="transition-swing"
                    outlined
                  >
                    <v-card-text class="text-center">
                      <v-icon
                        size="36"
                        color="success"
                        class="mb-2"
                      >
                        mdi-calendar-today
                      </v-icon>
                      <div class="text-h4 font-weight-bold success--text mb-1">
                        {{ stats.todayOrders }}
                      </div>
                      <div class="text-subtitle-1 grey--text">
                        Заказов сегодня
                      </div>
                      <v-divider class="my-3"></v-divider>
                      <div class="text-caption grey--text">
                        За текущий день
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>

              <v-col cols="12" sm="6">
                <v-hover v-slot="{ hover }">
                  <v-card
                    :elevation="hover ? 8 : 2"
                    :class="{ 'on-hover': hover }"
                    class="transition-swing"
                    outlined
                  >
                    <v-card-text class="text-center">
                      <v-icon
                        size="36"
                        color="info"
                        class="mb-2"
                      >
                        mdi-currency-rub
                      </v-icon>
                      <div class="text-h4 font-weight-bold info--text mb-1">
                        {{ formatCurrency(stats.totalRevenue) }}
                      </div>
                      <div class="text-subtitle-1 grey--text">
                        Общая выручка
                      </div>
                      <v-divider class="my-3"></v-divider>
                      <div class="text-caption grey--text">
                        За все время
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>

              <v-col cols="12" sm="6">
                <v-hover v-slot="{ hover }">
                  <v-card
                    :elevation="hover ? 8 : 2"
                    :class="{ 'on-hover': hover }"
                    class="transition-swing"
                    outlined
                  >
                    <v-card-text class="text-center">
                      <v-icon
                        size="36"
                        color="warning"
                        class="mb-2"
                      >
                        mdi-trending-up
                      </v-icon>
                      <div class="text-h4 font-weight-bold warning--text mb-1">
                        {{ formatCurrency(stats.todayRevenue) }}
                      </div>
                      <div class="text-subtitle-1 grey--text">
                        Выручка сегодня
                      </div>
                      <v-divider class="my-3"></v-divider>
                      <div class="text-caption grey--text">
                        За текущий день
                      </div>
                    </v-card-text>
                  </v-card>
                </v-hover>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'UserProfile',

  data: () => ({
    // Тестовые данные пользователя
    user: {
      id: 1,
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      phone: '+7 (999) 123-45-67',
      role: 'waiter', // admin, waiter, cook
      createdAt: '2024-01-01T00:00:00',
      avatar: null
    },

    // Тестовая статистика
    stats: {
      totalOrders: 156,
      todayOrders: 12,
      totalRevenue: 234500,
      todayRevenue: 15600
    }
  }),

  methods: {
    getRoleText(role) {
      const roles = {
        admin: 'Администратор',
        waiter: 'Официант',
        cook: 'Повар'
      }
      return roles[role] || role
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
    }
  }
}
</script>

<style scoped>
.v-card {
  height: 100%;
}

.transition-swing {
  transition: all 0.3s ease-in-out;
}

.on-hover {
  transform: translateY(-5px);
}

.v-card-text {
  padding: 24px;
}
</style> 