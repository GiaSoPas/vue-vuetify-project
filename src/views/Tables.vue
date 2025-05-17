<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" sm="8">
        <h1 class="text-h4">Управление столами</h1>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="primary"
          :to="{ name: 'NewOrder' }"
        >
          <v-icon left>mdi-plus</v-icon>
          Новый заказ
        </v-btn>
      </v-col>
    </v-row>

    <table-management></table-management>
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