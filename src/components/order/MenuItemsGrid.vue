<template>
  <v-row>
    <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4">
      <v-card class="menu-item">
        <v-img
          :src="getImageUrl(item.image)"
          height="200"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        >
          <v-card-title class="text-h6">{{ item.name }}</v-card-title>
        </v-img>

        <v-card-text>
          <div class="mb-2">{{ item.description }}</div>
          <div class="text-h6 primary--text">₽{{ item.price.toLocaleString() }}</div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="$emit('add-to-order', item)"
          >
            <v-icon left>mdi-plus</v-icon>
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'MenuItemsGrid',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  methods: {
    getImageUrl(image) {
      // В реальном приложении здесь будет логика получения URL изображения
      return `https://via.placeholder.com/400x200?text=${image}`
    }
  }
}
</script>

<style scoped>
.menu-item {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.menu-item .v-card__text {
  flex-grow: 1;
}
</style> 