<template>
  <v-container fluid style="background-color: #F8F7F4; padding: 24px;">
    <v-row class="mb-4">
      <v-col cols="12" sm="8">
        <h1 class="text-h4" style="color: #B85B3E;">Управление столами</h1>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="#D4A584"
          :to="{ name: 'NewOrder' }"
          class="text-capitalize"
        >
          <v-icon left>mdi-plus</v-icon>
          Новый заказ
        </v-btn>
      </v-col>
    </v-row>

    <table-management />
  </v-container>
</template>

<script>
import TableManagement from '@/components/tables/TableManagement.vue'

export default {
  name: 'TablesView',
  components: {
    TableManagement
  }
}
</script>