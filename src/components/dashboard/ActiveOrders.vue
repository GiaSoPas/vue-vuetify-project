<template>
  <v-card class="elevation-2">
    <v-card-title class="d-flex justify-space-between align-center">
      Активные заказы
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Поиск"
        single-line
        hide-details
        dense
        class="ml-4"
        style="max-width: 300px"
      ></v-text-field>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="orders"
      :search="search"
      :loading="loading"
      loading-text="Загрузка... Пожалуйста, подождите"
      no-data-text="Нет активных заказов"
      :items-per-page="5"
      class="elevation-0"
    >
      <template #[`item.status`]="{ item }">
        <v-chip :color="getStatusColor(item.status)" small>
          {{ item.status }}
        </v-chip>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editOrder(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="viewDetails(item)">
          mdi-eye
        </v-icon>
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
    headers: [
      { text: '№ Заказа', align: 'start', value: 'id' },
      { text: 'Стол', value: 'table' },
      { text: 'Официант', value: 'waiter' },
      { text: 'Сумма', value: 'amount' },
      { text: 'Время', value: 'time' },
      { text: 'Статус', value: 'status' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],
    orders: [
      {
        id: '1',
        table: '4',
        waiter: 'Анна',
        amount: '₽2,300',
        time: '14:25',
        status: 'Готовится'
      },
      {
        id: '2',
        table: '7',
        waiter: 'Михаил',
        amount: '₽1,850',
        time: '14:30',
        status: 'Подан'
      },
      {
        id: '3',
        table: '2',
        waiter: 'Елена',
        amount: '₽3,400',
        time: '14:40',
        status: 'Новый'
      }
    ]
  }),
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'Новый': return 'primary'
        case 'Готовится': return 'warning'
        case 'Подан': return 'success'
        default: return 'grey'
      }
    },
    editOrder(item) {
      console.log('Edit order:', item)
      // Здесь будет логика редактирования заказа
    },
    viewDetails(item) {
      console.log('View details:', item)
      // Здесь будет логика просмотра деталей заказа
    }
  }
}
</script> 