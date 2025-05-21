<template>
  <v-row>
    <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4">
      <v-card class="menu-item rounded-lg">
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
          <div class="text-h6 price-text">₽{{ item.price.toLocaleString() }}</div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text plain class="add-button">
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
      // Здесь будет логика получения реального URL изображения
      return `https://via.placeholder.com/400x200?text= ${image}`;
    }
  }
};
</script>

<style scoped>
.menu-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #b08f42;
  border: 1px solid #B85B3E; /* Теперь цвет границы применяется */
  transition: all 0.3s ease;
}

.menu-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.menu-item .v-card__text {
  flex-grow: 1;
  background-color: #f8f7f4;
  padding: 16px;
}

.menu-item .v-card__actions {
  background-color: #c4b93d;
  padding: 16px;
}

/* Цвет цены */
.price-text {
  color: #A8763E !important;
}

/* Цвет кнопки */
.add-button {
  color: #B85B3E !important;
}
</style>