/* eslint-disable vue/valid-v-slot */
<template>
  <v-container fluid style="background-color: #F8F7F4; padding: 24px;">
    <!-- Заголовок и кнопки управления -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center">
        <h2 class="text-h5" :style="{ color: '#B85B3E' }">Управление меню</h2>
        <v-spacer></v-spacer>
        <v-btn
          :color="'#A8763E'"
          class="mr-2 rounded-lg text-capitalize"
          @click="showCategoryDialog = true"
        >
          <v-icon left>mdi-shape</v-icon>
          Добавить категорию
        </v-btn>
        <v-btn
          :color="'#B85B3E'"
          @click="showItemDialog = true"
          class="rounded-lg text-capitalize"
        >
          <v-icon left>mdi-plus</v-icon>
          Добавить блюдо
        </v-btn>
      </v-col>
    </v-row>

    <!-- Фильтры -->
    <v-card class="mb-6 elevation-0" :style="{ backgroundColor: '#fff', borderRadius: '12px' }">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-select
              v-model="selectedCategories"
              :items="categories"
              label="Категории"
              item-text="name"
              item-value="id"
              multiple
              chips
              clearable
              outlined
              dense
              :color="'#B85B3E'"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              label="Статус"
              multiple
              chips
              clearable
              outlined
              dense
              :color="'#B85B3E'"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              label="Поиск"
              prepend-icon="mdi-magnify"
              clearable
              outlined
              dense
              :style="{ borderRadius: '8px' }"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Таблица блюд -->
    <v-card class="elevation-0" :style="{ borderRadius: '12px' }">
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        :loading="loading"
        sort-by="name"
        :footer-props="{ itemsPerPageOptions: [5, 10, 15] }"
        :style="{ backgroundColor: 'transparent' }"
      >
        <template v-slot:item="{ item }">
          <tr>
            <!-- Изображение -->
            <td>
              <v-avatar size="40" :color="item.available ? '#B85B3E' : '#C69C6D'" dark>
                <v-img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                ></v-img>
                <v-icon v-else dark>mdi-food</v-icon>
              </v-avatar>
            </td>
            <!-- Название -->
            <td>
              <div class="font-weight-medium" :style="{ color: '#2D2D2D' }">{{ item.name }}</div>
              <div class="caption" :style="{ color: '#777' }">{{ item.description }}</div>
            </td>
            <!-- Категория -->
            <td :style="{ color: '#555' }">{{ item.categoryName }}</td>
            <!-- Цена -->
            <td :style="{ color: '#2D2D2D' }">{{ formatCurrency(item.price) }}</td>
            <!-- Время -->
            <td :style="{ color: '#555' }">{{ item.cookingTime }} мин</td>
            <!-- Статус -->
            <td>
              <v-chip small :color="item.available ? '#7A9474' : '#C69C6D'" dark>
                {{ item.available ? 'В наличии' : 'Недоступно' }}
              </v-chip>
            </td>
            <!-- Действия -->
            <td>
              <v-btn
                icon
                small
                class="mr-2"
                :color="'#B85B3E'"
                @click="editItem(item)"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                :color="'#C06C3D'"
                @click="deleteItem(item)"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Диалог добавления/редактирования блюда -->
    <v-dialog v-model="showItemDialog" max-width="600px">
      <v-card class="rounded-lg" :style="{ backgroundColor: '#fff' }">
        <v-card-title>
          <span class="text-h5" :style="{ color: '#2D2D2D' }">
            {{ editedItem.id ? 'Редактировать' : 'Добавить' }} блюдо
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Название*"
                  required
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Описание"
                  rows="3"
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.categoryId"
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  label="Категория*"
                  required
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="editedItem.price"
                  label="Цена*"
                  type="number"
                  prefix="₽"
                  required
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="editedItem.cookingTime"
                  label="Время приготовления (мин)"
                  type="number"
                  suffix="мин"
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-switch
                  v-model="editedItem.available"
                  label="В наличии"
                  :color="'#B85B3E'"
                  hide-details
                ></v-switch>
              </v-col>
              <v-col cols="12">
                <v-file-input
                  v-model="editedItem.imageFile"
                  accept="image/*"
                  label="Изображение"
                  prepend-icon="mdi-camera"
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
          <small :style="{ color: '#777' }">* обязательные поля</small>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text @click="closeItemDialog" :style="{ color: '#777' }">Отмена</v-btn>
          <v-btn
            :color="'#B85B3E'"
            dark
            @click="saveItem"
            :disabled="!isValidItem"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог добавления/редактирования категории -->
    <v-dialog v-model="showCategoryDialog" max-width="500px">
      <v-card class="rounded-lg" :style="{ backgroundColor: '#fff' }">
        <v-card-title>
          <span class="text-h5" :style="{ color: '#2D2D2D' }">
            {{ editedCategory.id ? 'Редактировать' : 'Добавить' }} категорию
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedCategory.name"
                  label="Название категории*"
                  required
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedCategory.description"
                  label="Описание"
                  rows="2"
                  outlined
                  dense
                  :color="'#B85B3E'"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text @click="closeCategoryDialog" :style="{ color: '#777' }">Отмена</v-btn>
          <v-btn
            :color="'#B85B3E'"
            dark
            @click="saveCategory"
            :disabled="!editedCategory.name"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


     <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card class="rounded-lg" :style="{ backgroundColor: '#fff' }">
        <v-card-title class="error--text">
          Подтверждение удаления
        </v-card-title>
        <v-card-text>
          Вы действительно хотите удалить {{ itemToDelete?.name }}?
          Это действие нельзя будет отменить.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false" :style="{ color: '#777' }">Отмена</v-btn>
          <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'MenuView',
  data: () => ({
    loading: false,
    search: '',
    selectedCategories: [],
    selectedStatus: [],
    showItemDialog: false,
    showCategoryDialog: false,
    showDeleteDialog: false,
    itemToDelete: null,
    headers: [
      { text: 'Фото', value: 'image', sortable: false, width: '80px' },
      { text: 'Название', value: 'name' },
      { text: 'Категория', value: 'categoryName' },
      { text: 'Цена', value: 'price' },
      { text: 'Время', value: 'cookingTime' },
      { text: 'Статус', value: 'available' },
      { text: 'Действия', value: 'actions', sortable: false, width: '100px' }
    ],
    statusOptions: [
      { text: 'В наличии', value: true },
      { text: 'Недоступно', value: false }
    ],
    categories: [
      { id: 1, name: 'Салаты', description: 'Свежие салаты' },
      { id: 2, name: 'Супы', description: 'Первые блюда' },
      { id: 3, name: 'Горячее', description: 'Вторые блюда' },
      { id: 4, name: 'Напитки', description: 'Напитки и коктейли' }
    ],
    items: [
      {
        id: 1,
        name: 'Цезарь с курицей',
        description: 'Классический салат с куриным филе',
        categoryId: 1,
        price: 590,
        cookingTime: 15,
        available: true,
        image: null
      },
      {
        id: 2,
        name: 'Борщ',
        description: 'Традиционный борщ со сметаной',
        categoryId: 2,
        price: 420,
        cookingTime: 30,
        available: true,
        image: null
      }
    ],
    editedItem: {
      id: null,
      name: '',
      description: '',
      categoryId: null,
      price: 0,
      cookingTime: 15,
      available: true,
      image: null,
      imageFile: null
    },
    editedCategory: {
      id: null,
      name: '',
      description: ''
    }
  }),
  computed: {
    filteredItems() {
      let filtered = [...this.items]
      if (this.selectedCategories.length) {
        filtered = filtered.filter(item =>
          this.selectedCategories.includes(item.categoryId)
        )
      }
      if (this.selectedStatus.length) {
        filtered = filtered.filter(item =>
          this.selectedStatus.includes(item.available)
        )
      }
      return filtered.map(item => ({
        ...item,
        categoryName: this.getCategoryName(item.categoryId)
      }))
    },
    isValidItem() {
      return (
        this.editedItem.name &&
        this.editedItem.categoryId &&
        this.editedItem.price > 0
      )
    }
  },
  methods: {
    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : ''
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
    },
    editItem(item) {
      this.editedItem = { ...item }
      this.showItemDialog = true
    },
    deleteItem(item) {
      this.itemToDelete = item
      this.showDeleteDialog = true
    },
    confirmDelete() {
      if (this.itemToDelete) {
        const index = this.items.findIndex(
          item => item.id === this.itemToDelete.id
        )
        if (index !== -1) {
          this.items.splice(index, 1)
        }
      }
      this.showDeleteDialog = false
      this.itemToDelete = null
    },
    closeItemDialog() {
      this.showItemDialog = false
      this.$nextTick(() => {
        this.editedItem = {
          id: null,
          name: '',
          description: '',
          categoryId: null,
          price: 0,
          cookingTime: 15,
          available: true,
          image: null,
          imageFile: null
        }
      })
    },
    closeCategoryDialog() {
      this.showCategoryDialog = false
      this.$nextTick(() => {
        this.editedCategory = {
          id: null,
          name: '',
          description: ''
        }
      })
    },
    handleImageUpload(file) {
      if (!file) return
      this.editedItem.image = URL.createObjectURL(file)
    },
    saveItem() {
      if (this.editedItem.id) {
        const index = this.items.findIndex(item => item.id === this.editedItem.id)
        if (index !== -1) {
          this.items.splice(index, 1, { ...this.editedItem })
        }
      } else {
        this.items.push({
          ...this.editedItem,
          id: Date.now()
        })
      }
      this.closeItemDialog()
    },
    saveCategory() {
      if (this.editedCategory.id) {
        const index = this.categories.findIndex(
          cat => cat.id === this.editedCategory.id
        )
        if (index !== -1) {
          this.categories.splice(index, 1, { ...this.editedCategory })
        }
      } else {
        this.categories.push({
          ...this.editedCategory,
          id: Date.now()
        })
      }
      this.closeCategoryDialog()
    }
  }
}
</script>

<style scoped>
.v-data-table ::v-deep td {
  height: 60px;
  font-size: 14px;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}

.v-data-table ::v-deep .v-select__selections {
  color: #2D2D2D !important;
}

.v-data-table ::v-deep .v-input__label {
  color: #555 !important;
}

.v-data-table ::v-deep .v-input input {
  color: #2D2D2D !important;
}

.v-data-table ::v-deep .v-input textarea {
  color: #2D2D2D !important;
}
</style>