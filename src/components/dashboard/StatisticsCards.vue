<template>
  <v-row>
    <v-col v-for="card in statisticsCards" :key="card.title" cols="12" sm="6" lg="3">
      <v-card :class="['elevation-2', card.color]" height="100%">
        <v-card-text>
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-subtitle-2 text-medium-emphasis">{{ card.title }}</div>
              <div class="text-h4 font-weight-bold">{{ card.value }}</div>
            </div>
            <v-icon size="48" :color="card.iconColor">{{ card.icon }}</v-icon>
          </div>
          <div class="mt-3 text-caption" v-if="card.change">
            <v-icon small :color="card.trend === 'up' ? 'success' : 'error'">
              {{ card.trend === 'up' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
            </v-icon>
            <span :class="card.trend === 'up' ? 'success--text' : 'error--text'">{{ card.change }}</span>
            <span class="text-medium-emphasis"> по сравнению со вчера</span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'StatisticsCards',
  data: () => ({
    statisticsCards: [
      {
        title: 'Активные заказы',
        value: '12',
        icon: 'mdi-food',
        color: 'primary lighten-4',
        iconColor: 'primary',
        change: '+2',
        trend: 'up'
      },
      {
        title: 'Выручка за день',
        value: '₽42,500',
        icon: 'mdi-currency-rub',
        color: 'success lighten-4',
        iconColor: 'success',
        change: '+15%',
        trend: 'up'
      },
      {
        title: 'Клиентов сегодня',
        value: '48',
        icon: 'mdi-account-group',
        color: 'info lighten-4',
        iconColor: 'info',
        change: '+5',
        trend: 'up'
      },
      {
        title: 'Среднее время заказа',
        value: '24 мин',
        icon: 'mdi-clock-outline',
        color: 'warning lighten-4',
        iconColor: 'warning',
        change: '-2 мин',
        trend: 'up'
      }
    ]
  })
}
</script> 