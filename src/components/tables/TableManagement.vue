<template>
   <div>
    <v-tabs v-model="activeHall" background-color="#B85B3E" dark class="mb-4 hall-tabs" show-arrows>
      <v-tab v-for="hall in halls" :key="hall.id">
        <v-icon left>{{ hall.icon }}</v-icon>
        {{ hall.name }}
        <v-badge
          :content="getActiveOrdersCount(hall.id)"
          :value="getActiveOrdersCount(hall.id)"
          color="#C06C3D"
          offset-x="10"
          offset-y="-8"
        ></v-badge>
      </v-tab>
    </v-tabs>
     <v-tabs-items v-model="activeHall">
      <v-tab-item v-for="hall in halls" :key="hall.id">
        <div class="restaurant-layout">
          <div class="hall-info mb-4">
            <div class="d-flex align-center">
              <h3 class="text-h6 mr-4 mb-0">{{ hall.name }}</h3>
              <v-chip small class="mr-2">
                <v-icon left small>mdi-account-group</v-icon>
                Вместимость: {{ hall.capacity }}
              </v-chip>
              <v-chip small color="success" v-if="hall.features.includes('veranda')">
                <v-icon left small>mdi-white-balance-sunny</v-icon>
                Веранда
              </v-chip>
              <v-chip small color="primary" v-if="hall.features.includes('vip')">
                <v-icon left small>mdi-star</v-icon>
                VIP-зал
              </v-chip>
              <v-spacer></v-spacer>
              <v-btn
                small
                :color="isEditMode ? 'success' : '#B85B3E'"
                @click="toggleEditMode"
                class="ml-2 text-capitalize"
              >
                <v-icon left small>{{ isEditMode ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
                {{ isEditMode ? 'Завершить' : 'Редактировать' }}
              </v-btn>
            </div>
          </div>

          <div class="floor-plan" @click="handleFloorPlanClick">
            <template v-if="isEditMode">
              <div class="edit-mode-overlay"></div>
              <transition name="fade">
                <div v-if="!showNewTableDialog && !hasAddedTable" class="edit-mode-hint">
                  <v-icon>mdi-gesture-tap</v-icon>
                  Нажмите в любом месте зоны, чтобы добавить столик
                </div>
              </transition>
            </template>

            <!-- Барная зона -->
            <template v-if="currentHall.hasBar">
              <div class="area bar-area">
                <div class="area-label">
                  <v-icon left>mdi-glass-cocktail</v-icon>
                  Барная зона
                </div>
               <div class="bar-section">
                  <div class="bar-counter">
                    <div class="bar-counter-decoration"></div>
                    <div class="bar-seats">
                      <v-btn
                        v-for="seat in currentHall.barSeats"
                        :key="'bar-' + seat"
                        small
                        :color="getBarSeatStatus(seat)"
                        class="bar-seat"
                        @click="handleBarSeatClick(seat)"
                      >
                        <v-icon small>mdi-seat</v-icon>
                      </v-btn>
                    </div>
                    <div class="bar-staff-area">
                      <v-icon>mdi-account-tie</v-icon>
                    </div>
                  </div>
                  <div class="bar-tables">
                    <v-btn
                      v-for="table in getTablesByArea('bar')"
                      :key="table.id"
                      :color="getTableColor(table)"
                      :class="['table-btn', getTableClass(table, area), `status-${table.status}`]"
                      @click="showTableDetails(table)"
                    >
                       <div class="table-content">
                        <div class="table-shape bar-table-shape">
                          <div class="table-number">{{ table.number }}</div>
                          <div class="seats-layout" :class="table.shape || 'round'">
                            <template v-if="table.shape === 'rectangular'">
                              <div class="seats-row top">
                                <v-icon v-for="n in getTopSeatsCount(table.seats)" :key="'top'+n" small class="seat-icon">mdi-seat</v-icon>
                              </div>
                              <div class="seats-sides">
                                <div class="seats-left">
                                  <v-icon v-for="n in getSideSeatsCount(table.seats)" :key="'left'+n" small class="seat-icon">mdi-seat</v-icon>
                                </div>
                                <div class="table-center">{{ table.seats }} мест</div>
                                <div class="seats-right">
                                  <v-icon v-for="n in getSideSeatsCount(table.seats)" :key="'right'+n" small class="seat-icon">mdi-seat</v-icon>
                                </div>
                              </div>
                              <div class="seats-row bottom">
                                <v-icon v-for="n in getTopSeatsCount(table.seats)" :key="'bottom'+n" small class="seat-icon">mdi-seat</v-icon>
                              </div>
                            </template>

                            <template v-else-if="table.shape === 'booth'">
                              <div class="seats-booth">
                                <div class="seats-booth-side">
                                  <v-icon v-for="n in getBoothSideSeats(table.seats)" 
                                    :key="'booth-left'+n" 
                                    small 
                                    class="seat-icon booth-seat"
                                  >mdi-sofa</v-icon>
                                </div>
                                <div class="table-center">{{ table.seats }} мест</div>
                                <div class="seats-booth-side">
                                  <v-icon v-for="n in getBoothSideSeats(table.seats)" 
                                    :key="'booth-right'+n" 
                                    small 
                                    class="seat-icon booth-seat"
                                  >mdi-sofa</v-icon>
                                </div>
                              </div>
                            </template>

                            <template v-else>
                              <div class="seats-round">
                                <v-icon v-for="n in table.seats" 
                                  :key="n"
                                  small
                                  class="seat-icon"
                                  :style="getCircularSeatPosition(n, table.seats)"
                                >mdi-seat</v-icon>
                                <div class="table-center">{{ table.seats }} мест</div>
                              </div>
                            </template>
                          </div>
                          <div class="table-status">{{ getTableStatus(table) }}</div>
                          <div v-if="table.currentOrder" class="table-order-info">
                            {{ formatCurrency(table.currentOrder.total) }}
                          </div>
                          <!-- Кнопка удаления столика -->
                          <div v-if="isEditMode" class="table-edit-overlay">
                            <v-btn
                              small
                              icon
                              color="error"
                              class="delete-table-btn"
                              @click.stop="confirmDeleteTable(table)"
                            >
                              <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                          </div>
                        </div>
                      </div>
                    </v-btn>
                  </div>
                </div>
              </div>

              <!-- Остальные зоны -->
              <div v-for="area in currentHall.areas" :key="area.id" class="area" :class="area.class">
                <div class="area-label">{{ area.name }}</div>
                <div :class="area.layout === 'grid' ? 'tables-grid' : 'tables-row'">
                  <v-btn
                    v-for="table in getTablesByArea(area.id)"
                    :key="table.id"
                    :color="getTableColor(table)"
                    :class="['table-btn', getTableClass(table, area), `status-${table.status}`]"
                    @click="showTableDetails(table)"
                  >
                    <div class="table-content">
                      <div class="table-shape">
                        <div class="table-number">{{ table.number }}</div>
                        <!-- Отображаем иконки сидений только для бара -->
                        <template v-if="area.id === 'bar'">
                          <div class="seats-layout" :class="table.shape || 'round'">
                            <template v-if="table.shape === 'rectangular'">
                              <div class="seats-row top">
                                <v-icon v-for="n in getTopSeatsCount(table.seats)" 
                                  :key="'top'+n" 
                                  small 
                                  class="seat-icon"
                                >mdi-seat</v-icon>
                              </div>
                              <div class="seats-sides">
                                <div class="seats-left">
                                  <v-icon v-for="n in getSideSeatsCount(table.seats)" 
                                    :key="'left'+n" 
                                    small 
                                    class="seat-icon"
                                  >mdi-seat</v-icon>
                                </div>
                                <div class="table-center">{{ table.seats }} мест</div>
                                <div class="seats-right">
                                  <v-icon v-for="n in getSideSeatsCount(table.seats)" 
                                    :key="'right'+n" 
                                    small 
                                    class="seat-icon"
                                  >mdi-seat</v-icon>
                                </div>
                              </div>
                              <div class="seats-row bottom">
                                <v-icon v-for="n in getTopSeatsCount(table.seats)" 
                                  :key="'bottom'+n" 
                                  small 
                                  class="seat-icon"
                                >mdi-seat</v-icon>
                              </div>
                            </template>

                            <template v-else>
                              <div class="seats-round">
                                <v-icon v-for="n in table.seats" 
                                  :key="n"
                                  small
                                  class="seat-icon"
                                  :style="getCircularSeatPosition(n, table.seats)"
                                >mdi-seat</v-icon>
                                <div class="table-center">{{ table.seats }} мест</div>
                              </div>
                            </template>
                          </div>
                        </template>
                        <!-- Для остальных зон показываем просто количество мест -->
                        <template v-else>
                          <div class="table-seats">{{ table.seats }} мест</div>
                        </template>
                      </div>
                      <div class="table-status">{{ getTableStatus(table) }}</div>
                      <div v-if="table.currentOrder" class="table-order-info">
                        {{ formatCurrency(table.currentOrder.total) }}
                      </div>
                      <!-- Кнопка удаления столика -->
                      <div v-if="isEditMode" class="table-edit-overlay">
                        <v-btn
                          small
                          icon
                          color="error"
                          class="delete-table-btn"
                          @click.stop="confirmDeleteTable(table)"
                        >
                          <v-icon small>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-btn>
                </div>
              </div>
            </template>
          </div>

          <div class="layout-legend mt-4">
            <div class="d-flex align-center mb-2 legend-items">
              <div class="legend-item">
                <div class="legend-color success"></div>
                <span>Свободный стол</span>
              </div>
              <div class="legend-item">
                <div class="legend-color warning"></div>
                <span>Занятый стол</span>
              </div>
              <div class="legend-item">
                <div class="legend-color error"></div>
                <span>Готов к закрытию</span>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>

    <!-- Диалог с деталями стола -->
    <v-dialog v-model="showDialog" max-width="600">
      <v-card v-if="selectedTable">
        <v-card-title class="headline">
          Стол №{{ selectedTable.number }}
          <v-spacer></v-spacer>
          <v-chip :color="getTableColor(selectedTable)" dark>
            {{ getTableStatus(selectedTable) }}
          </v-chip>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="6">
              <div class="text-subtitle-1">Вместимость:</div>
              <div class="text-body-1 mb-4">{{ selectedTable.seats }} мест</div>
              
              <div class="text-subtitle-1">Текущий заказ:</div>
              <div v-if="selectedTable.currentOrder" class="text-body-1">
                <div>Сумма: {{ formatCurrency(selectedTable.currentOrder.total) }}</div>
                <div>Гостей: {{ selectedTable.currentOrder.guestCount }}</div>
                <div>Время: {{ formatTime(selectedTable.currentOrder.startTime) }}</div>
              </div>
              <div v-else class="text-body-1">Нет активного заказа</div>
            </v-col>

            <v-col cols="6">
              <div class="text-subtitle-1 mb-2">Действия:</div>
              <v-btn
                v-if="!selectedTable.currentOrder"
                color="primary"
                block
                class="mb-2"
                :to="{ name: 'NewOrder', query: { table: selectedTable.id }}"
              >
                <v-icon left>mdi-plus</v-icon>
                Новый заказ
              </v-btn>

              <v-btn
                v-if="selectedTable.currentOrder"
                color="warning"
                block
                class="mb-2"
                @click="showMoveOrderDialog = true"
              >
                <v-icon left>mdi-swap-horizontal</v-icon>
                Перенести заказ
              </v-btn>

              <v-btn
                v-if="selectedTable.currentOrder && selectedTable.status !== 'closing'"
                color="error"
                block
                class="mb-2"
                @click="markTableForClosing"
              >
                <v-icon left>mdi-cash-register</v-icon>
                Закрыть заказ
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <div class="text-subtitle-1 mb-2">История заказов:</div>
          <v-list dense>
            <v-list-item v-for="order in tableHistory" :key="order.id">
              <v-list-item-content>
                <v-list-item-title>{{ formatCurrency(order.total) }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatDate(order.date) }} • {{ order.guestCount }} гостей
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="showDialog = false">
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог переноса заказа -->
    <v-dialog v-model="showMoveOrderDialog" max-width="400">
      <v-card>
        <v-card-title>Перенос заказа</v-card-title>
        <v-card-text>
          <v-select
            v-model="targetTableId"
            :items="availableTables"
            item-text="label"
            item-value="id"
            label="Выберите стол"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showMoveOrderDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="moveOrder" :disabled="!targetTableId">
            Перенести
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог для создания нового столика -->
    <v-dialog v-model="showNewTableDialog" max-width="400">
      <v-card>
        <v-card-title>Новый столик</v-card-title>
        <v-card-text>
          <v-form ref="newTableForm" v-model="isNewTableFormValid">
            <v-text-field
              v-model.number="newTable.number"
              label="Номер столика"
              type="number"
              :rules="[v => !!v || 'Обязательное поле', v => !isTableNumberExists(v) || 'Номер уже занят']"
              required
            ></v-text-field>
            <v-select
              v-model="newTable.seats"
              :items="[2, 4, 6, 8, 10]"
              label="Количество мест"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-select>
            <v-select
              v-model="newTable.area"
              :items="currentHall.areas"
              item-text="name"
              item-value="id"
              label="Зона"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-select>
            <v-select
              v-model="newTable.shape"
              :items="[
                { text: 'Круглый', value: 'round' },
                { text: 'Прямоугольный', value: 'rectangular' },
                { text: 'Кабинка', value: 'booth' }
              ]"
              item-text="text"
              item-value="value"
              label="Форма столика"
              required
              :rules="[v => !!v || 'Обязательное поле']"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showNewTableDialog = false">Отмена</v-btn>
          <v-btn color="#B85B3E" @click="createNewTable" :disabled="!isNewTableFormValid">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления столика -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline error--text">
          Удаление столика
        </v-card-title>
        <v-card-text class="pt-4">
          <div v-if="tableToDelete">
            <p>Вы действительно хотите удалить столик №{{ tableToDelete.number }}?</p>
            <v-alert
              v-if="tableToDelete.currentOrder"
              type="warning"
              dense
              text
            >
              Внимание! На столике есть активный заказ.
            </v-alert>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="showDeleteDialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="error"
            @click="deleteTable"
            :disabled="!tableToDelete"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'TableManagement',
  data: () => ({
    activeHall: 0,
    halls: [
      {
        id: 'main',
        name: 'Основной зал',
        icon: 'mdi-food-fork-drink',
        capacity: 64,
        features: [],
        hasBar: true,
        barSeats: 6,
        areas: [
          { id: 'window', name: 'У окна', class: 'window-area', layout: 'row' },
          { id: 'center', name: 'Центр зала', class: 'center-area', layout: 'grid' },
          { id: 'cozy', name: 'Уютная зона', class: 'cozy-area', layout: 'row' }
        ]
      },
      {
        id: 'veranda',
        name: 'Веранда',
        icon: 'mdi-white-balance-sunny',
        capacity: 32,
        features: ['veranda'],
        hasBar: false,
        areas: [
          { id: 'terrace', name: 'Терраса', class: 'terrace-area', layout: 'grid' },
          { id: 'lounge', name: 'Лаунж-зона', class: 'lounge-area', layout: 'row' }
        ]
      },
      {
        id: 'vip',
        name: 'VIP-зал',
        icon: 'mdi-star',
        capacity: 24,
        features: ['vip'],
        hasBar: true,
        barSeats: 4,
        areas: [
          { id: 'private', name: 'Приватная зона', class: 'private-area', layout: 'grid' }
        ]
      }
    ],
    // Данные столов теперь организованы по залам
    tablesByHall: {
      main: [
        { id: 1, number: 1, seats: 4, status: 'free', currentOrder: null, area: 'window' },
        { id: 2, number: 2, seats: 4, status: 'occupied', currentOrder: { id: 101, total: 2800, guestCount: 3, startTime: new Date().getTime() - 1800000 }, area: 'window' },
        { id: 3, number: 3, seats: 6, status: 'free', currentOrder: null, area: 'center' },
        { id: 4, number: 4, seats: 8, status: 'occupied', currentOrder: { id: 102, total: 4500, guestCount: 6, startTime: new Date().getTime() - 3600000 }, area: 'center' },
        { id: 5, number: 5, seats: 2, status: 'free', currentOrder: null, area: 'cozy' },
        { id: 6, number: 6, seats: 4, status: 'closing', currentOrder: { id: 103, total: 3200, guestCount: 4, startTime: new Date().getTime() - 7200000 }, area: 'cozy' }
      ],
      veranda: [
        { id: 101, number: 1, seats: 4, status: 'free', currentOrder: null, area: 'terrace', shape: 'round' },
        { id: 102, number: 2, seats: 4, status: 'occupied', currentOrder: { id: 201, total: 3100, guestCount: 3, startTime: new Date().getTime() - 2400000 }, area: 'terrace', shape: 'round' },
        { id: 103, number: 3, seats: 6, status: 'free', currentOrder: null, area: 'terrace', shape: 'rectangular' },
        { id: 104, number: 4, seats: 2, status: 'free', currentOrder: null, area: 'lounge', shape: 'round' },
        { id: 105, number: 5, seats: 4, status: 'occupied', currentOrder: { id: 202, total: 2800, guestCount: 4, startTime: new Date().getTime() - 3600000 }, area: 'lounge', shape: 'booth' }
      ],
      vip: [
        { id: 201, number: 1, seats: 6, status: 'free', currentOrder: null, area: 'private', shape: 'rectangular' },
        { id: 202, number: 2, seats: 8, status: 'occupied', currentOrder: { id: 301, total: 12500, guestCount: 6, startTime: new Date().getTime() - 5400000 }, area: 'private', shape: 'rectangular' },
        { id: 203, number: 3, seats: 4, status: 'free', currentOrder: null, area: 'private', shape: 'round' }
      ]
    },
    showDialog: false,
    showMoveOrderDialog: false,
    selectedTable: null,
    targetTableId: null,
    tableHistory: [
      { id: 1, total: 3200, date: '2024-03-15T18:30:00', guestCount: 4 },
      { id: 2, total: 1800, date: '2024-03-15T14:20:00', guestCount: 2 }
    ],
    isEditMode: false,
    showNewTableDialog: false,
    isNewTableFormValid: false,
    hasAddedTable: false,
    newTable: {
      number: null,
      seats: 4,
      area: '',
      shape: 'round',
      position: { x: 0, y: 0 }
    },
    showDeleteDialog: false,
    tableToDelete: null
  }),

  computed: {
    currentHall() {
      return this.halls[this.activeHall]
    },
    currentTables() {
      return this.tablesByHall[this.currentHall.id] || []
    },
    availableTables() {
      return this.currentTables
        .filter(table => 
          table.id !== this.selectedTable?.id && 
          table.status === 'free'
        )
        .map(table => ({
          id: table.id,
          label: `Стол ${table.number} (${table.seats} мест)`
        }))
    }
  },

  methods: {
    getTablesByArea(areaId) {
      return this.currentTables.filter(table => table.area === areaId)
    },

    getTableClass(table, area) {
      if (area.id === 'bar') return 'bar-table'
      if (table.seats > 4) return 'rectangular-table'
      return 'round-table'
    },

    getActiveOrdersCount(hallId) {
      return (this.tablesByHall[hallId] || [])
        .filter(table => table.status === 'occupied' || table.status === 'closing')
        .length
    },

    getTableColor(table) {
      const colors = {
        free: 'success',
        occupied: 'warning',
        closing: 'error'
      }
      return colors[table.status] || 'grey'
    },

    getTableStatus(table) {
      const statuses = {
        free: 'Свободен',
        occupied: 'Занят',
        closing: 'Закрывается'
      }
      return statuses[table.status] || ''
    },

    showTableDetails(table) {
      if (this.isEditMode) return; // Отключаем показ деталей в режиме редактирования
      this.selectedTable = table
      this.showDialog = true
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(amount)
    },

    formatTime(timestamp) {
      return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(timestamp))
    },

    formatDate(date) {
      return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date))
    },

    markTableForClosing() {
      if (this.selectedTable) {
        this.selectedTable.status = 'closing'
        this.showDialog = false
      }
    },

    moveOrder() {
      if (!this.selectedTable || !this.targetTableId) return

      const targetTable = this.currentTables.find(t => t.id === this.targetTableId)
      if (!targetTable) return

      // Перенос заказа
      targetTable.currentOrder = this.selectedTable.currentOrder
      targetTable.status = 'occupied'
      this.selectedTable.currentOrder = null
      this.selectedTable.status = 'free'

      this.showMoveOrderDialog = false
      this.showDialog = false
    },

    getBarSeatStatus(seat) {
      // Проверяем, занято ли место
      const isOccupied = this.currentHall.occupiedBarSeats && 
                        this.currentHall.occupiedBarSeats.includes(seat);
      return isOccupied ? 'warning' : 'rgba(255, 255, 255, 0.3)';
    },

    handleBarSeatClick(seat) {
      // Здесь можно добавить логику обработки клика по месту у бара
      this.$emit('bar-seat-click', {
        hallId: this.currentHall.id,
        seatNumber: seat
      });
    },

    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
      if (this.isEditMode) {
        this.hasAddedTable = false;
      }
      if (!this.isEditMode) {
        // Сохраняем изменения при выходе из режима редактирования
        this.$emit('tables-updated', this.currentTables);
      }
    },

    handleFloorPlanClick(event) {
      if (!this.isEditMode || this.hasAddedTable) return;
      
      // Получаем координаты клика относительно floor-plan
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Определяем зону, в которой был клик
      const area = this.getClickedArea(event.target);
      if (area) {
        this.newTable.area = area;
        this.newTable.position = { x, y };
        this.showNewTableDialog = true;
      }
    },

    getClickedArea(element) {
      // Ищем ближайший родительский элемент с классом area
      let current = element;
      while (current && !current.classList.contains('area')) {
        current = current.parentElement;
      }
      
      if (current) {
        // Извлекаем id зоны из классов элемента
        const areaClass = Array.from(current.classList)
          .find(cls => cls.endsWith('-area'));
        return areaClass ? areaClass.replace('-area', '') : null;
      }
      return null;
    },

    isTableNumberExists(number) {
      return this.currentTables.some(table => table.number === number);
    },

    createNewTable() {
      if (!this.$refs.newTableForm.validate()) return;

      const newTableId = Math.max(...this.currentTables.map(t => t.id), 0) + 1;
      const table = {
        id: newTableId,
        number: this.newTable.number,
        seats: this.newTable.seats,
        status: 'free',
        currentOrder: null,
        area: this.newTable.area,
        shape: this.newTable.shape,
        position: this.newTable.position
      };

      // Добавляем новый стол в текущий зал
      if (!this.tablesByHall[this.currentHall.id]) {
        this.$set(this.tablesByHall, this.currentHall.id, []);
      }
      this.tablesByHall[this.currentHall.id].push(table);

      // Отмечаем, что стол был добавлен
      this.hasAddedTable = true;

      // Сбрасываем форму
      this.showNewTableDialog = false;
      this.$nextTick(() => {
        this.newTable = {
          number: null,
          seats: 4,
          area: '',
          shape: 'round',
          position: { x: 0, y: 0 }
        };
        if (this.$refs.newTableForm) {
          this.$refs.newTableForm.reset();
        }
      });
    },

    confirmDeleteTable(table) {
      this.tableToDelete = table;
      this.showDeleteDialog = true;
    },

    deleteTable() {
      if (!this.tableToDelete || !this.currentHall) return;

      const tables = this.tablesByHall[this.currentHall.id];
      const index = tables.findIndex(t => t.id === this.tableToDelete.id);
      
      if (index !== -1) {
        tables.splice(index, 1);
        this.$emit('tables-updated', this.currentTables);
      }

      this.showDeleteDialog = false;
      this.tableToDelete = null;
    },

    getTopSeatsCount(totalSeats) {
      return Math.floor(totalSeats / 4);
    },

    getSideSeatsCount(totalSeats) {
      return Math.floor((totalSeats - (2 * this.getTopSeatsCount(totalSeats))) / 2);
    },

    getBoothSideSeats(totalSeats) {
      return Math.ceil(totalSeats / 2);
    },

    getCircularSeatPosition(seatIndex, totalSeats) {
      const radius = 35; // Радиус расположения мест
      const angleStep = (2 * Math.PI) / totalSeats;
      const angle = seatIndex * angleStep - Math.PI / 2; // Начинаем с верхней точки
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      return {
        transform: `translate(${x}px, ${y}px) rotate(${angle * 180 / Math.PI + 90}deg)`
      };
    }
  }
}
</script>

<style scoped>
.restaurant-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.floor-plan {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  border-radius: 16px;
  padding: 32px;
  position: relative;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.area {
  position: relative;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.area:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.area-label {
  position: absolute;
  top: -12px;
  left: 16px;
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  padding: 4px 12px;
  font-size: 0.9em;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
}

.tables-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.table-btn {
  height: auto !important;
  position: relative;
  transition: all 0.3s ease;
  overflow: visible !important;
  backdrop-filter: blur(5px) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  min-width: 120px !important;
}

/* Стили для разных статусов столиков */
.table-btn.status-free {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.1)) !important;
  border: 1px solid rgba(76, 175, 80, 0.3) !important;
}

.table-btn.status-occupied {
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.3), rgba(255, 152, 0, 0.1)) !important;
  border: 1px solid rgba(255, 152, 0, 0.3) !important;
}

.table-btn.status-closing {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(244, 67, 54, 0.1)) !important;
  border: 1px solid rgba(244, 67, 54, 0.3) !important;
}

/* Эффекты при наведении для разных статусов */
.table-btn.status-free:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 16px rgba(76, 175, 80, 0.2) !important;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.4), rgba(76, 175, 80, 0.2)) !important;
}

.table-btn.status-occupied:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 16px rgba(255, 152, 0, 0.2) !important;
  background: linear-gradient(135deg, rgba(255, 152, 0, 0.4), rgba(255, 152, 0, 0.2)) !important;
}

.table-btn.status-closing:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 16px rgba(244, 67, 54, 0.2) !important;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.4), rgba(244, 67, 54, 0.2)) !important;
}

/* Обновленные стили для индикатора статуса */
.table-status {
  font-size: 0.8em;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 4px;
}

.status-free .table-status {
  background: rgba(76, 175, 80, 0.3);
  border: 1px solid rgba(76, 175, 80, 0.4);
}

.status-occupied .table-status {
  background: rgba(255, 152, 0, 0.3);
  border: 1px solid rgba(255, 152, 0, 0.4);
}

.status-closing .table-status {
  background: rgba(244, 67, 54, 0.3);
  border: 1px solid rgba(244, 67, 54, 0.4);
}

/* Обновляем стили для форм столиков с учетом статусов */
.round-table .table-shape {
  border-radius: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.status-free .table-shape {
  background: radial-gradient(circle at center, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.05));
}

.status-occupied .table-shape {
  background: radial-gradient(circle at center, rgba(255, 152, 0, 0.15), rgba(255, 152, 0, 0.05));
}

.status-closing .table-shape {
  background: radial-gradient(circle at center, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.05));
}

/* Добавляем иконки для статусов */
.table-status::before {
  font-family: 'Material Design Icons';
  font-size: 14px;
}

.status-free .table-status::before {
  content: '\F0638';  /* mdi-check-circle-outline */
  color: rgba(76, 175, 80, 0.9);
}

.status-occupied .table-status::before {
  content: '\F0638';  /* mdi-clock-outline */
  color: rgba(255, 152, 0, 0.9);
}

.status-closing .table-status::before {
  content: '\F0638';  /* mdi-cash-register */
  color: rgba(244, 67, 54, 0.9);
}

/* Обновляем стили для информации о заказе */
.table-order-info {
  font-size: 0.8em;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bar-area {
  margin-bottom: 32px;
  background-color: #2c3e50;
  padding: 24px;
  border-radius: 16px;
  color: white;
}

.bar-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.bar-counter {
  background: linear-gradient(to bottom, #34495e, #2c3e50);
  height: 60px;
  border-radius: 12px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.bar-counter-decoration {
  position: absolute;
  top: 8px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 20%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 80%,
    transparent 100%
  );
}

.bar-seats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  position: relative;
  z-index: 1;
}

.bar-seat {
  margin: 0 4px !important;
  transition: all 0.3s ease !important;
  position: relative;
}

.bar-seat:hover {
  transform: translateY(-2px);
}

.bar-seat::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.bar-staff-area {
  position: absolute;
  right: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.bar-tables {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.bar-table {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bar-table-shape {
  background-color: rgba(0, 0, 0, 0.2);
}

.layout-legend {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 8px;
}

.legend-color.success {  background: linear-gradient(135deg, rgba(76, 175, 80, 0.3), rgba(76, 175, 80, 0.1));  border: 1px solid rgba(76, 175, 80, 0.3);  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);}.legend-color.warning {  background: linear-gradient(135deg, rgba(255, 152, 0, 0.3), rgba(255, 152, 0, 0.1));  border: 1px solid rgba(255, 152, 0, 0.3);  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.2);}.legend-color.error {  background: linear-gradient(135deg, rgba(244, 67, 54, 0.3), rgba(244, 67, 54, 0.1));  border: 1px solid rgba(244, 67, 54, 0.3);  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);}

@media (max-width: 600px) {
  .floor-plan {
    padding: 16px;
  }

  .tables-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .round-table,
  .rectangular-table,
  .booth-table {
    width: 100% !important;
  }
}

/* Добавляем новые стили для вкладок залов */
.hall-tabs {
  position: sticky;
  top: 0;
  z-index: 2;
  border-radius: 4px;
}

.hall-info {
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Специфичные стили для разных зон */
.window-area {
  background: linear-gradient(135deg, rgba(129, 212, 250, 0.1), rgba(129, 212, 250, 0.05));
  border-color: rgba(129, 212, 250, 0.2);
}

.center-area {
  background: linear-gradient(135deg, rgba(255, 241, 118, 0.1), rgba(255, 241, 118, 0.05));
  border-color: rgba(255, 241, 118, 0.2);
}

.cozy-area {
  background: linear-gradient(135deg, rgba(165, 214, 167, 0.1), rgba(165, 214, 167, 0.05));
  border-color: rgba(165, 214, 167, 0.2);
}

.terrace-area {
  background: linear-gradient(135deg, rgba(178, 223, 219, 0.15), rgba(178, 223, 219, 0.05));
  border-color: rgba(178, 223, 219, 0.2);
}

.lounge-area {
  background: linear-gradient(135deg, rgba(179, 157, 219, 0.1), rgba(179, 157, 219, 0.05));
  border-color: rgba(179, 157, 219, 0.2);
}

.private-area {
  background: linear-gradient(135deg, rgba(255, 138, 128, 0.1), rgba(255, 138, 128, 0.05));
  border-color: rgba(255, 138, 128, 0.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.edit-mode-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.05);
  pointer-events: none;
  z-index: 1;
}

.edit-mode-hint {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 2;
  pointer-events: none;
}

.table-edit-overlay {
  position: absolute;
  top: -8px;
  right: -8px;
  padding: 4px;
  opacity: 0;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1;
}

.table-btn:hover .table-edit-overlay {
  opacity: 1;
  transform: translateY(0);
}

.delete-table-btn {
  background: linear-gradient(135deg, #ff5252, #f44336) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.delete-table-btn:hover {
  transform: scale(1.1) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3) !important;
}

.seats-layout {
  position: relative;
  width: 100%;
  min-height: 60px;
  margin: 8px 0;
}

.seats-row {
  display: flex;
  justify-content: space-around;
  padding: 4px 0;
}

.seats-sides {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 40px;
}

.seats-left, .seats-right {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.table-center {
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.seat-icon {
  opacity: 0.8;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.9);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.seat-icon:hover {
  opacity: 1;
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.seats-round {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.seats-round .seat-icon {
  position: absolute;
  left: 50%;
  top: 50%;
}

.seats-booth {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.seats-booth-side {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.booth-seat {
  transform: scale(1.2);
}

.layout-legend {  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));  padding: 16px 20px;  border-radius: 12px;  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);  font-family: 'Roboto', sans-serif;  backdrop-filter: blur(10px);  border: 1px solid rgba(255, 255, 255, 0.2);}.legend-items {  flex-wrap: wrap;  gap: 16px;  justify-content: center;}.legend-item {  display: flex;  align-items: center;  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));  border-radius: 12px;  padding: 12px 20px;  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);  transition: all 0.3s ease;  min-width: 160px;  text-align: center;  border: 1px solid rgba(255, 255, 255, 0.3);  backdrop-filter: blur(5px);}.legend-item:hover {  transform: translateY(-2px);  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85));}.legend-color {  width: 32px;  height: 32px;  border-radius: 8px;  margin-right: 16px;  display: inline-block;  position: relative;  overflow: hidden;  transition: all 0.3s ease;}

.legend-color.success {
  background: linear-gradient(135deg, #66bb6a, #43a047);
}

.legend-color.warning {
  background: linear-gradient(135deg, #ffa726, #fb8c00);
}

.legend-color.error {
  background: linear-gradient(135deg, #ef5350, #e53935);
}
</style> 