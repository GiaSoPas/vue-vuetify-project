<template>
  <v-container fluid>
    <v-row>
      <!-- Левая панель: выбор стола и информация о заказе -->
      <v-col cols="12" md="4" lg="3">
        <v-card class="mb-4 rounded-lg">
          <v-card-title class="text-h6">
            Информация о заказе
          </v-card-title>

          <v-card-text>
            <v-select
              v-model="selectedTable"
              :items="tables"
              label="Выберите стол"
              item-text="name"
              item-value="id"
              :rules="[v => !!v || 'Выберите стол']"
              outlined
              dense
              class="rounded-lg"
            ></v-select>

            <v-text-field
              v-model="guestCount"
              label="Количество гостей"
              type="number"
              min="1"
              outlined
              dense
              class="rounded-lg"
            ></v-text-field>

            <v-text-field
              v-model="customerName"
              label="Имя клиента"
              outlined
              dense
              class="rounded-lg"
            ></v-text-field>

            <v-text-field
              v-model="customerPhone"
              label="Телефон"
              outlined
              dense
              class="rounded-lg"
            ></v-text-field>

            <v-textarea
              v-model="comment"
              label="Комментарий"
              rows="3"
              outlined
              dense
              class="rounded-lg"
            ></v-textarea>
          </v-card-text>
        </v-card>

        <!-- Итого -->
        <v-card class="rounded-lg sticky-card">
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-subtitle-1">Сумма:</span>
              <span class="text-h6">{{ formatCurrency(orderTotal) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-4 grey--text">
              <span>Обслуживание (10%):</span>
              <span>{{ formatCurrency(orderTotal * 0.1) }}</span>
            </div>
            <v-divider class="mb-4"></v-divider>
            <div class="d-flex justify-space-between mb-4">
              <span class="text-subtitle-1 font-weight-bold">Итого к оплате:</span>
              <span class="text-h6 success--text">{{ formatCurrency(orderTotal * 1.1) }}</span>
            </div>
            <v-btn
              block
              x-large
              color="success"
              :disabled="!canCreateOrder"
              @click="createOrder"
              class="rounded-lg"
              elevation="2"
            >
              <v-icon left>mdi-check-circle</v-icon>
              Создать заказ
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Правая панель: меню и выбранные блюда -->
      <v-col cols="12" md="8" lg="9">
        <!-- Поиск и фильтры -->
        <v-card class="mb-4 rounded-lg">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="search"
                  label="Поиск блюд"
                  prepend-inner-icon="mdi-magnify"
                  outlined
                  dense
                  clearable
                  class="rounded-lg"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="selectedCategories"
                  :items="categories"
                  label="Категории"
                  multiple
                  chips
                  outlined
                  dense
                  class="rounded-lg"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Список блюд -->
        <v-card class="rounded-lg">
          <v-tabs
            v-model="activeTab"
            background-color="transparent"
            class="rounded-t-lg"
          >
            <v-tab
              v-for="category in categories"
              :key="category.id"
              class="text-none"
            >
              {{ category.name }}
            </v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <v-tabs-items v-model="activeTab">
            <v-tab-item
              v-for="category in categories"
              :key="category.id"
            >
              <v-container fluid class="pa-4">
                <v-row>
                  <v-col
                    v-for="item in filteredItems(category.id)"
                    :key="item.id"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card
                      class="rounded-lg menu-item-card"
                      :class="{'unavailable': !item.available}"
                      hover
                      @click="addToOrder(item)"
                    >
                      <v-img
                        :src="item.image || 'default-dish.jpg'"
                        height="160"
                        class="rounded-t-lg"
                      >
                        <template #placeholder>
                          <v-row
                            class="fill-height ma-0"
                            align="center"
                            justify="center"
                          >
                            <v-icon
                              size="64"
                              color="grey lighten-2"
                            >
                              mdi-food
                            </v-icon>
                          </v-row>
                        </template>
                      </v-img>

                      <v-card-text>
                        <div class="d-flex align-center mb-2">
                          <div class="text-subtitle-1 font-weight-medium">{{ item.name }}</div>
                          <v-spacer></v-spacer>
                          <div class="text-subtitle-1 success--text">{{ formatCurrency(item.price) }}</div>
                        </div>
                        <div class="grey--text text-caption">{{ item.description }}</div>
                      </v-card-text>

                      <v-divider></v-divider>

                      <v-card-actions class="pa-2">
                        <v-btn
                          text
                          block
                          color="primary"
                          :disabled="!item.available"
                          class="rounded-lg"
                        >
                          <v-icon left>mdi-plus</v-icon>
                          Добавить
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог подтверждения создания заказа -->
    <v-dialog
      v-model="showConfirmDialog"
      max-width="400"
      class="rounded-lg"
    >
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 success--text">
          Подтверждение заказа
        </v-card-title>
        <v-card-text class="pt-4">
          <p>Создать новый заказ со следующими параметрами?</p>
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Стол</v-list-item-subtitle>
                <v-list-item-title>{{ selectedTable }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Гости</v-list-item-subtitle>
                <v-list-item-title>{{ guestCount }} чел.</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-subtitle>Сумма к оплате</v-list-item-subtitle>
                <v-list-item-title class="success--text">{{ formatCurrency(orderTotal * 1.1) }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="showConfirmDialog = false"
            class="rounded-lg"
          >
            Отмена
          </v-btn>
          <v-btn
            color="success"
            @click="confirmOrder"
            class="rounded-lg"
          >
            Подтвердить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'NewOrder',

  data: () => ({
    search: '',
    selectedTable: null,
    guestCount: 1,
    customerName: '',
    customerPhone: '',
    comment: '',
    activeTab: 0,
    selectedCategories: [],
    showConfirmDialog: false,

    // Тестовые данные
    tables: [
      { id: 1, name: 'Стол 1' },
      { id: 2, name: 'Стол 2' },
      { id: 3, name: 'Стол 3' },
      { id: 4, name: 'Стол 4' }
    ],

    categories: [
      { id: 1, name: 'Салаты' },
      { id: 2, name: 'Супы' },
      { id: 3, name: 'Горячее' },
      { id: 4, name: 'Напитки' }
    ],

    menuItems: [
      {
        id: 1,
        name: 'Цезарь с курицей',
        description: 'Классический салат с куриным филе',
        price: 590,
        categoryId: 1,
        available: true
      },
      {
        id: 2,
        name: 'Борщ',
        description: 'Традиционный борщ со сметаной',
        price: 420,
        categoryId: 2,
        available: true
      }
    ],

    orderItems: []
  }),

  computed: {
    orderTotal() {
      return this.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },

    canCreateOrder() {
      return this.selectedTable && this.orderItems.length > 0
    }
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
    },

    filteredItems(categoryId) {
      return this.menuItems.filter(item => 
        item.categoryId === categoryId &&
        (!this.search || item.name.toLowerCase().includes(this.search.toLowerCase()))
      )
    },

    addToOrder(item) {
      if (!item.available) return

      const existingItem = this.orderItems.find(i => i.id === item.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.orderItems.push({
          ...item,
          quantity: 1
        })
      }
    },

    createOrder() {
      this.showConfirmDialog = true
    },

    confirmOrder() {
      // В реальном приложении здесь будет отправка заказа на сервер
      this.showConfirmDialog = false
      this.$router.push('/orders')
    }
  }
}
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 24px;
}

.menu-item-card {
  transition: all 0.3s ease;
}

.menu-item-card:hover {
  transform: translateY(-4px);
}

.menu-item-card.unavailable {
  opacity: 0.7;
  cursor: not-allowed;
}

.rounded-t-lg {
  border-top-left-radius: 12px !important;
  border-top-right-radius: 12px !important;
}

/* Анимации для карточек */
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

/* Стили для полей ввода */
.v-text-field.rounded-lg >>> .v-input__control .v-input__slot,
.v-select.rounded-lg >>> .v-input__control .v-input__slot {
  border-radius: 12px !important;
}
</style> 