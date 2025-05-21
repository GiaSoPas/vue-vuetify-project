<template>
  <v-row>
    <v-col v-for="action in quickActions" :key="action.title" cols="12" sm="6" md="4">
      <v-btn
  :color="action.color"
  block
  class="py-6 rounded-lg text-capitalize"
  elevation="0"
  @click="handleAction(action.action)"
>
        <v-icon left size="24">{{ action.icon }}</v-icon>
        {{ action.title }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'QuickActions',
  data: () => ({
    quickActions: [
  {
    title: 'Создать заказ',
    icon: 'mdi-plus-circle',
    color: '#B85B3E',
    action: 'create-order'
  },
  {
    title: 'Меню',
    icon: 'mdi-book-open-variant',
    color: '#C69C6D',
    action: 'menu'
  },
  {
    title: 'Столы',
    icon: 'mdi-table-furniture',
    color: '#7A9474',
    action: 'tables'
  }
]
  }),
  methods: {
    handleAction(action) {
      console.log('Action clicked:', action)
      // Здесь будет логика навигации или вызова соответствующих действий
      switch (action) {
        case 'create-order':
          this.$router.push('/new-order')
          break
        case 'menu':
          this.$router.push('/menu')
          break
        case 'tables':
          this.$router.push('/tables')
          break
      }
    }
  }
}
</script> 