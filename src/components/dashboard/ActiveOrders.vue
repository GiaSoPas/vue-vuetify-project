<template>
  <v-card class="elevation-0 rounded-lg" style="background-color: #F8F7F4">
    <v-card-title class="d-flex justify-space-between align-center">
      <h2 class="text-h5">Активные заказы</h2>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="refreshOrders">
        <v-icon left>mdi-refresh</v-icon>
        Обновить
      </v-btn>
    </v-card-title>

    <!-- Фильтры -->
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="selectedStatus"
            :items="statusOptions"
            label="Статус"
            prepend-icon="mdi-flag"
            clearable
            multiple
            chips
            small-chips
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="selectedTables"
            :items="tableOptions"
            label="Столик"
            prepend-icon="mdi-table-furniture"
            clearable
            multiple
            chips
            small-chips
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-text-field
            v-model="search"
            label="Поиск"
            prepend-icon="mdi-magnify"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Таблица заказов -->
    <v-data-table
      :headers="headers"
      :items="filteredOrders"
      :search="search"
      :loading="loading"
      :items-per-page="10"
      :footer-props="{
        'items-per-page-options': [10, 20, 50],
        'items-per-page-text': 'Заказов на странице'
      }"
      class="elevation-0"
      style="background-color: transparent"
    >
      <template v-slot:item="{ item }">
        <tr>
          <!-- Номер заказа -->
          <td>
            <div class="font-weight-medium">#{{ item.id }}</div>
          </td>

          <!-- Столик -->
          <td>
            <v-chip small>{{ item.table }}</v-chip>
          </td>

          <!-- Время -->
          <td>
            <div>{{ formatDate(item.createdAt) }}</div>
            <div class="caption grey--text">{{ formatTime(item.createdAt) }}</div>
          </td>

          <!-- Статус -->
          <td>
            <v-chip
              small
              :color="getStatusColor(item.status)"
            >
              {{ getStatusText(item.status) }}
            </v-chip>
          </td>

          <!-- Сумма -->
          <td>
            <div class="font-weight-medium">{{ formatCurrency(item.total) }}</div>
          </td>

          <!-- Действия -->
          <td>
            <v-btn
              icon
              small
              @click="viewOrder(item)"
            >
              <v-icon small>mdi-eye</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: 'ActiveOrders',
  data: () => ({
    search: '',
    loading: false,
    selectedStatus: [],
    selectedTables: [],
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Столик', value: 'table' },
      { text: 'Время', value: 'createdAt' },
      { text: 'Статус', value: 'status' },
      { text: 'Сумма', value: 'total' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],
    statusOptions: [
      { text: 'Новый', value: 'new' },
      { text: 'В работе', value: 'in_progress' },
      { text: 'Готов', value: 'ready' },
      { text: 'Завершён', value: 'completed' }
    ],
    tableOptions: [
      { text: 'Столик 1', value: 1 },
      { text: 'Столик 2', value: 2 },
      { text: 'Столик 3', value: 3 },
      { text: 'Столик 4', value: 4 },
      { text: 'Столик 5', value: 5 }
    ],
    orders: [
      {
        id: 1001,
        table: 1,
        createdAt: '2025-03-16T14:30:00',
        status: 'in_progress',
        total: 2450,
        waiter: 'Анна Петрова',
        guests: 2,
        items: [
          { id: 1, name: 'Цезарь с курицей', quantity: 1, price: 590 },
          { id: 2, name: 'Борщ', quantity: 2, price: 420 },
          { id: 3, name: 'Морс', quantity: 2, price: 150 }
        ]
      },
      {
        id: 1002,
        table: 3,
        createdAt: '2025-03-16T15:00:00',
        status: 'ready',
        total: 3800,
        waiter: 'Иван Сидоров',
        guests: 4,
        items: [
          { id: 1, name: 'Стейк Рибай', quantity: 2, price: 1500 },
          { id: 2, name: 'Картофель фри', quantity: 2, price: 200 },
          { id: 3, name: 'Кола', quantity: 2, price: 150 }
        ]
      }
    ]
  }),
  computed: {
    filteredOrders() {
      let filtered = [...this.orders]

      // Фильтрация по статусу
      if (this.selectedStatus.length) {
        filtered = filtered.filter(order => this.selectedStatus.includes(order.status))
      }

      // Фильтрация по столикам
      if (this.selectedTables.length) {
        filtered = filtered.filter(order => this.selectedTables.includes(order.table))
      }

      return filtered
    }
  },
  methods: {
    getStatusColor(status) {
      const colors = {
        new: 'blue',
        in_progress: 'orange',
        ready: 'green',
        completed: 'grey'
      }
      return colors[status] || 'grey'
    },

    getStatusText(status) {
      const texts = {
        new: 'Новый',
        in_progress: 'В работе',
        ready: 'Готов',
        completed: 'Завершён'
      }
      return texts[status] || status
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('ru-RU')
    },

    formatTime(dateStr) {
      return new Date(dateStr).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    viewOrder(order) {
      this.$router.push(`/orders/${order.id}`)
    },

    refreshOrders() {
      this.loading = true
      // Здесь будет запрос к API для обновления списка заказов
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep td {
  height: 48px;
}
</style> 