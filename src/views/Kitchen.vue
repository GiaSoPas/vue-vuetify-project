<template>
  <v-container fluid>
    <!-- Заголовок и переключатель режима отображения -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center">
        <h2 class="text-h5">Кухня</h2>
        <v-spacer></v-spacer>
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          class="mr-4"
        >
          <v-btn value="orders">
            <v-icon left>mdi-format-list-numbered</v-icon>
            По заказам
          </v-btn>
          <v-btn value="dishes">
            <v-icon left>mdi-food</v-icon>
            По блюдам
          </v-btn>
        </v-btn-toggle>
        <v-btn
          color="primary"
          @click="refreshOrders"
          :loading="loading"
        >
          <v-icon left>mdi-refresh</v-icon>
          Обновить
        </v-btn>
      </v-col>
    </v-row>

    <!-- Режим отображения по заказам -->
    <template v-if="viewMode === 'orders'">
      <v-row>
        <v-col
          v-for="order in activeOrders"
          :key="order.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            :class="{
              'order-card': true,
              'order-urgent': isOrderUrgent(order)
            }"
          >
            <v-card-title class="d-flex align-center">
              <span>Заказ #{{ order.id }}</span>
              <v-chip
                class="ml-2"
                small
                :color="getOrderUrgencyColor(order)"
              >
                {{ getWaitingTime(order.createdAt) }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-chip small>
                Стол {{ order.table }}
              </v-chip>
            </v-card-title>

            <v-card-text>
              <v-list dense>
                <v-list-item
                  v-for="item in order.items"
                  :key="item.id"
                  :class="{
                    'item-urgent': isItemUrgent(item)
                  }"
                >
                  <v-list-item-content>
                    <v-list-item-title class="d-flex align-center">
                      <span>{{ item.name }}</span>
                      <v-chip
                        x-small
                        class="ml-2"
                        :color="getStatusColor(item.status)"
                      >
                        {{ getStatusText(item.status) }}
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Время приготовления: {{ item.cookingTime }} мин
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn-group>
                      <v-btn
                        x-small
                        :color="item.status === 'preparing' ? 'warning' : ''"
                        :disabled="item.status === 'ready'"
                        @click="updateItemStatus(item, 'preparing')"
                      >
                        <v-icon x-small>mdi-pot-steam</v-icon>
                      </v-btn>
                      <v-btn
                        x-small
                        :color="item.status === 'ready' ? 'success' : ''"
                        :disabled="item.status === 'ready'"
                        @click="updateItemStatus(item, 'ready')"
                      >
                        <v-icon x-small>mdi-check</v-icon>
                      </v-btn>
                    </v-btn-group>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="success"
                text
                :disabled="!canCompleteOrder(order)"
                @click="completeOrder(order)"
              >
                <v-icon left>mdi-check-all</v-icon>
                Завершить заказ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Режим отображения по блюдам -->
    <template v-else>
      <v-row>
        <v-col
          v-for="status in ['waiting', 'preparing', 'ready']"
          :key="status"
          cols="12"
          md="4"
        >
          <v-card>
            <v-card-title :class="getStatusColor(status)">
              {{ getStatusText(status) }}
              <v-chip
                class="ml-2"
                small
                :color="getStatusColor(status)"
              >
                {{ getItemsByStatus(status).length }}
              </v-chip>
            </v-card-title>

            <v-card-text class="pa-2">
              <v-list dense>
                <v-list-item
                  v-for="item in getItemsByStatus(status)"
                  :key="`${item.orderId}-${item.id}`"
                  :class="{
                    'item-urgent': isItemUrgent(item)
                  }"
                >
                  <v-list-item-content>
                    <v-list-item-title class="d-flex align-center">
                      <span>{{ item.name }}</span>
                      <v-chip
                        x-small
                        class="ml-2"
                      >
                        Заказ #{{ item.orderId }}
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-subtitle class="d-flex align-center">
                      <span>Стол {{ item.table }}</span>
                      <v-chip
                        x-small
                        class="ml-2"
                        :color="getOrderUrgencyColor(item)"
                      >
                        {{ getWaitingTime(item.createdAt) }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn-group v-if="status !== 'ready'">
                      <v-btn
                        x-small
                        :color="status === 'preparing' ? 'warning' : ''"
                        @click="updateItemStatus(item, 'preparing')"
                      >
                        <v-icon x-small>mdi-pot-steam</v-icon>
                      </v-btn>
                      <v-btn
                        x-small
                        :color="status === 'ready' ? 'success' : ''"
                        @click="updateItemStatus(item, 'ready')"
                      >
                        <v-icon x-small>mdi-check</v-icon>
                      </v-btn>
                    </v-btn-group>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
export default {
  name: 'KitchenView',

  data: () => ({
    loading: false,
    viewMode: 'orders', // 'orders' или 'dishes'
    refreshInterval: null,

    // Тестовые данные активных заказов
    activeOrders: [
      {
        id: 1001,
        table: 1,
        createdAt: '2025-03-16T14:30:00',
        items: [
          {
            id: 1,
            orderId: 1001,
            name: 'Цезарь с курицей',
            cookingTime: 15,
            status: 'waiting',
            createdAt: '2025-03-16T14:30:00'
          },
          {
            id: 2,
            orderId: 1001,
            name: 'Борщ',
            cookingTime: 30,
            status: 'preparing',
            createdAt: '2025-03-16T14:30:00'
          }
        ]
      },
      {
        id: 1002,
        table: 3,
        createdAt: '2025-03-16T14:45:00',
        items: [
          {
            id: 3,
            orderId: 1002,
            name: 'Стейк Рибай',
            cookingTime: 25,
            status: 'waiting',
            createdAt: '2024-03-16T14:45:00'
          }
        ]
      }
    ]
  }),

  computed: {
    // Получаем все блюда из всех заказов для режима отображения по блюдам
    allItems() {
      return this.activeOrders.flatMap(order => 
        order.items.map(item => ({
          ...item,
          table: order.table,
          orderId: order.id
        }))
      )
    }
  },

  methods: {
    // Обновление данных
    refreshOrders() {
      this.loading = true
      //  здесь будет запрос к API
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },

    // Получение блюд по статусу для режима отображения по блюдам
    getItemsByStatus(status) {
      return this.allItems.filter(item => item.status === status)
    },

    // Обновление статуса блюда
    updateItemStatus(item, newStatus) {
      const order = this.activeOrders.find(o => o.id === item.orderId)
      if (order) {
        const orderItem = order.items.find(i => i.id === item.id)
        if (orderItem) {
          orderItem.status = newStatus
        }
      }
    },

    // Завершение заказа
    completeOrder(order) {
      const index = this.activeOrders.findIndex(o => o.id === order.id)
      if (index !== -1) {
        this.activeOrders.splice(index, 1)
      }
    },

    // Проверка возможности завершения заказа
    canCompleteOrder(order) {
      return order.items.every(item => item.status === 'ready')
    },

    // Получение текста статуса
    getStatusText(status) {
      const texts = {
        waiting: 'Ожидает',
        preparing: 'Готовится',
        ready: 'Готово'
      }
      return texts[status] || status
    },

    // Получение цвета статуса
    getStatusColor(status) {
      const colors = {
        waiting: 'blue',
        preparing: 'warning',
        ready: 'success'
      }
      return colors[status] || 'grey'
    },

    // Расчет времени ожидания
    getWaitingTime(createdAt) {
      const created = new Date(createdAt)
      const now = new Date()
      const diff = Math.floor((now - created) / 1000 / 60) // в минутах
      return `${diff} мин`
    },

    // Проверка срочности заказа
    isOrderUrgent(order) {
      const waitingTime = Math.floor((new Date() - new Date(order.createdAt)) / 1000 / 60)
      return waitingTime > 30
    },

    // Проверка срочности блюда
    isItemUrgent(item) {
      const waitingTime = Math.floor((new Date() - new Date(item.createdAt)) / 1000 / 60)
      return waitingTime > item.cookingTime
    },

    // Получение цвета индикатора срочности
    getOrderUrgencyColor(order) {
      const waitingTime = Math.floor((new Date() - new Date(order.createdAt)) / 1000 / 60)
      if (waitingTime > 45) return 'error'
      if (waitingTime > 30) return 'warning'
      return 'success'
    }
  },

  created() {
    // Автоматическое обновление каждые 30 секунд
    this.refreshInterval = setInterval(this.refreshOrders, 30000)
  },

  beforeDestroy() {
    // Очистка интервала при уничтожении компонента
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }
}
</script>

<style scoped>
.order-card {
  border-left: 4px solid transparent;
}

.order-urgent {
  border-left-color: var(--v-error-base);
}

.item-urgent {
  background-color: var(--v-error-lighten5);
}

.v-list-item {
  border-radius: 4px;
  margin-bottom: 4px;
}
</style> 