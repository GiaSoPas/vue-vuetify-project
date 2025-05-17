<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" sm="6">
        <v-select
          v-model="guestCount"
          :items="guestCountOptions"
          label="Количество гостей"
          @change="$emit('update:guests', $event)"
        ></v-select>
      </v-col>
    </v-row>

    <div class="restaurant-layout">
      <div class="table-grid">
        <v-btn
          v-for="table in tables"
          :key="table.id"
          :color="getTableColor(table)"
          :disabled="!table.available"
          class="table-btn"
          @click="selectTable(table)"
        >
          <div class="table-content">
            <div class="table-number">{{ table.number }}</div>
            <div class="table-seats">{{ table.seats }} мест</div>
            <div v-if="!table.available" class="table-status">Занят</div>
          </div>
        </v-btn>
      </div>

      <div class="layout-legend mt-4">
        <div class="d-flex align-center mb-2">
          <div class="legend-color primary"></div>
          <span>Свободный стол</span>
        </div>
        <div class="d-flex align-center mb-2">
          <div class="legend-color red"></div>
          <span>Занятый стол</span>
        </div>
        <div class="d-flex align-center">
          <div class="legend-color success"></div>
          <span>Выбранный стол</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableSelector',
  props: {
    value: {
      type: [Number, null],
      default: null
    }
  },
  data: () => ({
    guestCount: 2,
    guestCountOptions: [1, 2, 3, 4, 5, 6, 7, 8],
    tables: [
      { id: 1, number: 1, seats: 2, available: true },
      { id: 2, number: 2, seats: 4, available: true },
      { id: 3, number: 3, seats: 4, available: false },
      { id: 4, number: 4, seats: 6, available: true },
      { id: 5, number: 5, seats: 2, available: true },
      { id: 6, number: 6, seats: 8, available: true },
      { id: 7, number: 7, seats: 4, available: false },
      { id: 8, number: 8, seats: 2, available: true }
    ]
  }),

  watch: {
    // Следим за изменением value извне
    value: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          const table = this.tables.find(t => t.id === newValue)
          if (table && table.available) {
            this.$emit('update:guests', this.guestCount)
          }
        }
      }
    }
  },

  methods: {
    getTableColor(table) {
      if (!table.available) return 'red'
      if (this.value === table.id) return 'success'
      return 'primary'
    },
    selectTable(table) {
      if (!table.available) return
      this.$emit('input', table.id)
    }
  }
}
</script>

<style scoped>
.restaurant-layout {
  max-width: 800px;
  margin: 0 auto;
}

.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.table-btn {
  height: 100px !important;
  width: 100% !important;
}

.table-btn.red {
  background-color: #FF5252 !important;
  color: white !important;
}

.table-btn.red:disabled {
  background-color: #FF5252 !important;
  opacity: 1 !important;
}

.table-content {
  text-align: center;
}

.table-number {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 4px;
}

.table-seats {
  font-size: 0.9em;
  margin-bottom: 4px;
}

.table-status {
  font-size: 0.8em;
}

.layout-legend {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 12px;
}

.legend-color.primary {
  background-color: var(--v-primary-base);
}

.legend-color.red {
  background-color: #FF5252;
}

.legend-color.success {
  background-color: var(--v-success-base);
}

.layout-legend span {
  color: rgba(0, 0, 0, 0.87);
}
</style> 