/* eslint-disable vue/valid-v-slot */<template>  <v-container fluid>
    <v-card class="mb-6">
      <v-card-title class="d-flex align-center">
        <h2 class="text-h5">Список заказов</h2>
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
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="dateRangeText"
                  label="Период"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  clearable
                  @click:clear="clearDateFilter"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="dateRange"
                range
                no-title
                @input="dateMenu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

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
    </v-card>

    <!-- Таблица заказов -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredOrders"
        :loading="loading"
        :search="search"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [10, 20, 50],
          'items-per-page-text': 'Заказов на странице'
        }"
        class="elevation-1"
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
                class="mr-2"
                @click="viewOrder(item)"
              >
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Диалог с деталями заказа -->
    <v-dialog v-model="showDialog" max-width="700">
      <v-card v-if="selectedOrder">
        <v-card-title class="headline">
          Заказ #{{ selectedOrder.id }}
          <v-spacer></v-spacer>
          <v-chip :color="getStatusColor(selectedOrder.status)">
            {{ getStatusText(selectedOrder.status) }}
          </v-chip>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="6">
              <div class="text-subtitle-1 mb-2">Информация о заказе</div>
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-table-furniture</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Столик {{ selectedOrder.table }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-clock-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ formatDateTime(selectedOrder.createdAt) }}</v-list-item-title>
                    <v-list-item-subtitle>Время создания</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ selectedOrder.waiter }}</v-list-item-title>
                    <v-list-item-subtitle>Официант</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-group-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ selectedOrder.guests }} чел.</v-list-item-title>
                    <v-list-item-subtitle>Количество гостей</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>

            <v-col cols="6">
              <div class="text-subtitle-1 mb-2">Итого</div>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Сумма заказа</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="text-right">
                    {{ formatCurrency(selectedOrder.total) }}
                  </v-list-item-action>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Обслуживание (10%)</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="text-right">
                    {{ formatCurrency(selectedOrder.total * 0.1) }}
                  </v-list-item-action>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item class="font-weight-bold">
                  <v-list-item-content>
                    <v-list-item-title>К оплате</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="text-right">
                    {{ formatCurrency(selectedOrder.total * 1.1) }}
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <div class="text-subtitle-1 mb-2">Состав заказа</div>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th>Наименование</th>
                  <th class="text-right">Кол-во</th>
                  <th class="text-right">Цена</th>
                  <th class="text-right">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td class="text-right">{{ item.quantity }}</td>
                  <td class="text-right">{{ formatCurrency(item.price) }}</td>
                  <td class="text-right">{{ formatCurrency(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="showDialog = false"
          >
            Закрыть
          </v-btn>
          <v-btn
            color="primary"
            @click="printOrder"
          >
            <v-icon left>mdi-printer</v-icon>
            Печать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'OrdersList',
  
  data: () => ({
    loading: false,
    search: '',
    dateMenu: false,
    dateRange: [],
    selectedStatus: [],
    selectedTables: [],
    showDialog: false,
    selectedOrder: null,

    // Заголовки таблицы
    headers: [
      { text: 'ID', align: 'start', value: 'id' },
      { text: 'Столик', value: 'table' },
      { text: 'Время', value: 'createdAt' },
      { text: 'Статус', value: 'status' },
      { text: 'Сумма', value: 'total' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],

    // Опции для фильтров
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

    // Тестовые данные заказов
    orders: [
      {
        id: 1001,
        table: 1,
        createdAt: '2024-03-16T14:30:00',
        status: 'completed',
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
        createdAt: '2024-03-16T15:00:00',
        status: 'in_progress',
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
    dateRangeText() {
      if (!this.dateRange.length) return ''
      const [start, end] = this.dateRange
      if (!end) return this.formatDate(start)
      return `${this.formatDate(start)} - ${this.formatDate(end)}`
    },

    filteredOrders() {
      let filtered = [...this.orders]

      // Фильтрация по дате
      if (this.dateRange.length === 2) {
        const [start, end] = this.dateRange
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt)
          return orderDate >= new Date(start) && orderDate <= new Date(end)
        })
      }

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

    formatDateTime(dateStr) {
      return new Date(dateStr).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

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

    viewOrder(order) {
      this.$router.push(`/orders/${order.id}`)
    },

    refreshOrders() {
      this.loading = true
      // Здесь будет запрос к API для обновления списка заказов
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },

    clearDateFilter() {
      this.dateRange = []
    },

    printOrder() {
      // Здесь будет логика печати заказа
      console.log('Печать заказа:', this.selectedOrder.id)
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