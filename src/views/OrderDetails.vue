/* eslint-disable vue/valid-v-slot */
<template>  <v-container fluid v-if="order">
    <v-row>
      <v-col cols="12" md="8">
        <!-- Основная информация о заказе -->
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <h2 class="text-h5">Заказ #{{ order.id }}</h2>
            <v-spacer></v-spacer>
            <v-chip
              :color="getStatusColor(order.status)"
              class="mr-4"
            >
              {{ getStatusText(order.status) }}
            </v-chip>
            <v-btn
              color="primary"
              @click="showStatusDialog = true"
            >
              <v-icon left>mdi-pencil</v-icon>
              Изменить статус
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-table-furniture</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Столик</v-list-item-subtitle>
                    <v-list-item-title class="text-h6">{{ order.table }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-clock-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Время создания</v-list-item-subtitle>
                    <v-list-item-title>{{ formatDateTime(order.createdAt) }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Официант</v-list-item-subtitle>
                    <v-list-item-title>{{ order.waiter }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-group</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Гости</v-list-item-subtitle>
                    <v-list-item-title>{{ order.guests }} чел.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- Информация о клиенте -->
            <v-row>
              <v-col cols="12" sm="6">
                <h3 class="text-subtitle-1 mb-3">Информация о клиенте</h3>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Имя</v-list-item-subtitle>
                      <v-list-item-title>{{ order.customer?.name || 'Не указано' }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Телефон</v-list-item-subtitle>
                      <v-list-item-title>{{ order.customer?.phone || 'Не указано' }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>Комментарий</v-list-item-subtitle>
                      <v-list-item-title>{{ order.customer?.comment || 'Нет комментария' }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Список блюд -->
        <v-card>
          <v-card-title class="d-flex align-center">
            <h3 class="text-h6">Состав заказа</h3>
            <v-spacer></v-spacer>
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn
                  color="success"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Добавить блюдо
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="showAddItemDialog = true">
                  <v-list-item-title>
                    <v-icon left>mdi-plus</v-icon>
                    Добавить новое блюдо
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="order.items"
              :items-per-page="-1"
              hide-default-footer
            >
              <template v-slot:item="{ item }">
                <tr>
                  <!-- Название блюда -->
                  <td>
                    <div class="font-weight-medium">{{ item.name }}</div>
                  </td>

                  <!-- Количество -->
                  <td>
                    <v-edit-dialog
                      :return-value.sync="item.quantity"
                      @save="updateItemQuantity(item)"
                    >
                      {{ item.quantity }}
                      <template v-slot:input>
                        <v-text-field
                          v-model.number="item.quantity"
                          type="number"
                          min="1"
                          single-line
                          counter
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </td>

                  <!-- Цена -->
                  <td>
                    {{ formatCurrency(item.price) }}
                  </td>

                  <!-- Сумма -->
                  <td>
                    {{ formatCurrency(item.price * item.quantity) }}
                  </td>

                  <!-- Статус -->
                  <td>
                    <v-chip
                      :color="getItemStatusColor(item.status)"
                      small
                      @click="openItemStatusDialog(item)"
                    >
                      {{ getItemStatusText(item.status) }}
                    </v-chip>
                  </td>

                  <!-- Действия -->
                  <td>
                    <v-btn
                      icon
                      small
                      color="error"
                      @click="confirmDeleteItem(item)"
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Боковая панель с итогами -->
      <v-col cols="12" md="4">
        <v-card class="sticky-card">
          <v-card-title>Итого</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Сумма заказа</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="text-right">
                  {{ formatCurrency(orderTotal) }}
                </v-list-item-action>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Обслуживание (10%)</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="text-right">
                  {{ formatCurrency(orderTotal * 0.1) }}
                </v-list-item-action>
              </v-list-item>

              <v-divider class="my-2"></v-divider>

              <v-list-item class="text-h6">
                <v-list-item-content>
                  <v-list-item-title>К оплате</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action class="text-right">
                  {{ formatCurrency(orderTotal * 1.1) }}
                </v-list-item-action>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <v-btn
              block
              color="success"
              class="mb-2"
              :disabled="!canFinishOrder"
              @click="finishOrder"
            >
              <v-icon left>mdi-cash-register</v-icon>
              Отправить на оплату
            </v-btn>

            <v-btn
              block
              text
              color="grey"
              @click="$router.push('/orders')"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              К списку заказов
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог изменения статуса заказа -->
    <v-dialog v-model="showStatusDialog" max-width="400">
      <v-card>
        <v-card-title>Изменить статус заказа</v-card-title>
        <v-card-text>
          <v-select
            v-model="newStatus"
            :items="statusOptions"
            label="Статус"
            item-text="text"
            item-value="value"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showStatusDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="updateOrderStatus">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог добавления блюда -->
    <v-dialog v-model="showAddItemDialog" max-width="600">
      <v-card>
        <v-card-title>Добавить блюдо</v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="newItem"
            :items="menuItems"
            label="Выберите блюдо"
            item-text="name"
            return-object
          ></v-autocomplete>
          <v-text-field
            v-if="newItem"
            v-model.number="newItemQuantity"
            type="number"
            label="Количество"
            min="1"
            :rules="[v => v > 0 || 'Количество должно быть больше 0']"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showAddItemDialog = false">Отмена</v-btn>
          <v-btn
            color="primary"
            :disabled="!canAddItem"
            @click="addItemToOrder"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог изменения статуса блюда -->
    <v-dialog v-model="showItemStatusDialog" max-width="400">
      <v-card>
        <v-card-title>Изменить статус блюда</v-card-title>
        <v-card-text>
          <v-select
            v-model="newItemStatus"
            :items="itemStatusOptions"
            label="Статус"
            item-text="text"
            item-value="value"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showItemStatusDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="updateItemStatus">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="error--text">
          Удалить блюдо?
        </v-card-title>
        <v-card-text>
          Вы действительно хотите удалить "{{ itemToDelete?.name }}" из заказа?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false">Отмена</v-btn>
          <v-btn color="error" @click="deleteItem">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'OrderDetails',

  data: () => ({
    // Данные заказа (в реальном приложении будут загружаться по ID)
    order: {
      id: 1001,
      table: 1,
      createdAt: '2024-03-16T14:30:00',
      status: 'in_progress',
      waiter: 'Анна Петрова',
      guests: 2,
      customer: {
        name: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        comment: 'Аллергия на орехи'
      },
      items: [
        {
          id: 1,
          name: 'Цезарь с курицей',
          quantity: 1,
          price: 590,
          status: 'preparing'
        },
        {
          id: 2,
          name: 'Борщ',
          quantity: 2,
          price: 420,
          status: 'ready'
        },
        {
          id: 3,
          name: 'Морс',
          quantity: 2,
          price: 150,
          status: 'served'
        }
      ]
    },

    // Состояние диалогов
    showStatusDialog: false,
    showAddItemDialog: false,
    showItemStatusDialog: false,
    showDeleteDialog: false,

    // Данные для диалогов
    newStatus: null,
    newItem: null,
    newItemQuantity: 1,
    newItemStatus: null,
    selectedItem: null,
    itemToDelete: null,

    // Заголовки таблицы
    headers: [
      { text: 'Наименование', value: 'name' },
      { text: 'Кол-во', value: 'quantity', width: '100px' },
      { text: 'Цена', value: 'price', width: '120px' },
      { text: 'Сумма', value: 'total', width: '120px' },
      { text: 'Статус', value: 'status', width: '150px' },
      { text: 'Действия', value: 'actions', sortable: false, width: '100px' }
    ],

    // Опции для статусов
    statusOptions: [
      { text: 'Новый', value: 'new' },
      { text: 'В работе', value: 'in_progress' },
      { text: 'Готов', value: 'ready' },
      { text: 'Завершён', value: 'completed' }
    ],

    itemStatusOptions: [
      { text: 'Готовится', value: 'preparing' },
      { text: 'Готово', value: 'ready' },
      { text: 'Подано', value: 'served' }
    ],

    // Тестовые данные меню
    menuItems: [
      { id: 1, name: 'Цезарь с курицей', price: 590, category: 'Салаты' },
      { id: 2, name: 'Борщ', price: 420, category: 'Супы' },
      { id: 3, name: 'Стейк Рибай', price: 1500, category: 'Горячее' },
      { id: 4, name: 'Морс', price: 150, category: 'Напитки' }
    ]
  }),

  computed: {
    orderTotal() {
      return this.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },

    canFinishOrder() {
      return this.order.items.every(item => item.status === 'served')
    },

    canAddItem() {
      return this.newItem && this.newItemQuantity > 0
    }
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
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

    getItemStatusColor(status) {
      const colors = {
        preparing: 'orange',
        ready: 'green',
        served: 'grey'
      }
      return colors[status] || 'grey'
    },

    getItemStatusText(status) {
      const texts = {
        preparing: 'Готовится',
        ready: 'Готово',
        served: 'Подано'
      }
      return texts[status] || status
    },

    updateOrderStatus() {
      this.order.status = this.newStatus
      this.showStatusDialog = false
      // В реальном приложении здесь будет API-запрос
    },

    addItemToOrder() {
      const newOrderItem = {
        id: Date.now(), // В реальном приложении ID будет приходить с сервера
        name: this.newItem.name,
        quantity: this.newItemQuantity,
        price: this.newItem.price,
        status: 'preparing'
      }
      this.order.items.push(newOrderItem)
      this.showAddItemDialog = false
      this.newItem = null
      this.newItemQuantity = 1
      // В реальном приложении здесь будет API-запрос
    },

    updateItemQuantity(item) {
      // В реальном приложении здесь будет API-запрос
      console.log('Обновлено количество:', item)
    },

    openItemStatusDialog(item) {
      this.selectedItem = item
      this.newItemStatus = item.status
      this.showItemStatusDialog = true
    },

    updateItemStatus() {
      if (this.selectedItem) {
        this.selectedItem.status = this.newItemStatus
        this.showItemStatusDialog = false
        // В реальном приложении здесь будет API-запрос
      }
    },

    confirmDeleteItem(item) {
      this.itemToDelete = item
      this.showDeleteDialog = true
    },

    deleteItem() {
      if (this.itemToDelete) {
        const index = this.order.items.findIndex(item => item.id === this.itemToDelete.id)
        if (index !== -1) {
          this.order.items.splice(index, 1)
          // В реальном приложении здесь будет API-запрос
        }
      }
      this.showDeleteDialog = false
      this.itemToDelete = null
    },

    finishOrder() {
      this.order.status = 'completed'
      // В реальном приложении здесь будет API-запрос для закрытия заказа
      this.$router.push('/orders')
    }
  },

  created() {
    // В реальном приложении здесь будет загрузка данных заказа по ID из маршрута
    const orderId = this.$route.params.id
    console.log('Loading order:', orderId)
  }
}
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 24px;
}

.v-data-table ::v-deep td {
  height: 48px;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}
</style> 