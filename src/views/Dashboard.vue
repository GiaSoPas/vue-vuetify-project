<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">Панель управления</h1>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <statistics-cards class="mb-6"></statistics-cards>

    <!-- Quick Actions -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h6 mb-4">Быстрые действия</h2>
        <quick-actions class="mb-6"></quick-actions>
      </v-col>
    </v-row>

    <!-- Active Orders -->
    <v-row>
      <v-col cols="12">
        <h2 class="text-h6 mb-4">Управление заказами</h2>
        <active-orders></active-orders>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import StatisticsCards from '@/components/dashboard/StatisticsCards.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import ActiveOrders from '@/components/dashboard/ActiveOrders.vue'

export default {
  name: 'DashboardView',
  components: {
    StatisticsCards,
    QuickActions,
    ActiveOrders
  }
}
</script>

<style scoped>
.v-container {
  max-width: 1400px;
}
</style> 