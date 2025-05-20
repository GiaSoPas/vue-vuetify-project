/* eslint-disable vue/valid-v-slot */
<template>
  <v-container fluid>
    <!-- Заголовок и кнопки управления -->
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center">
        <h2 class="text-h5">Управление меню</h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="mr-2"
          @click="showCategoryDialog = true"
        >
          <v-icon left>mdi-shape</v-icon>
          Добавить категорию
        </v-btn>
        <v-btn
          color="success"
          @click="showItemDialog = true"
        >
          <v-icon left>mdi-plus</v-icon>
          Добавить блюдо
        </v-btn>
      </v-col>
    </v-row>

    <!-- Фильтры -->
    <v-card class="mb-6">
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
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              label="Поиск"
              prepend-icon="mdi-magnify"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Таблица блюд -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="filteredItems"
        :search="search"
        :loading="loading"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:item="{ item }">
          <tr>
            <!-- Изображение -->
            <td>
              <v-avatar size="40" color="grey lighten-2">
                <v-img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.name"
                ></v-img>
                <v-icon v-else>mdi-food</v-icon>
              </v-avatar>
            </td>

            <!-- Название -->
            <td>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="caption grey--text">{{ item.description }}</div>
            </td>

            <!-- Категория -->
            <td>{{ item.categoryName }}</td>

            <!-- Цена -->
            <td>{{ formatCurrency(item.price) }}</td>

            <!-- Время -->
            <td>{{ item.cookingTime }} мин</td>

            <!-- Статус -->
            <td>
              <v-chip
                :color="item.available ? 'success' : 'grey'"
                small
              >
                {{ item.available ? 'В наличии' : 'Недоступно' }}
              </v-chip>
            </td>

            <!-- Действия -->
            <td>
              <v-btn
                icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="error"
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
    <v-dialog
      v-model="showItemDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedItem.id ? 'Редактировать' : 'Добавить' }} блюдо</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Название*"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Описание"
                  rows="3"
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
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="editedItem.price"
                  label="Цена*"
                  type="number"
                  prefix="₽"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="editedItem.cookingTime"
                  label="Время приготовления (мин)"
                  type="number"
                  suffix="мин"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-switch
                  v-model="editedItem.available"
                  label="В наличии"
                ></v-switch>
              </v-col>

              <v-col cols="12">
                <v-file-input
                  v-model="editedItem.imageFile"
                  accept="image/*"
                  label="Изображение"
                  prepend-icon="mdi-camera"
                  @change="handleImageUpload"
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
          <small>* обязательные поля</small>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="closeItemDialog"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            @click="saveItem"
            :disabled="!isValidItem"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог добавления/редактирования категории -->
    <v-dialog
      v-model="showCategoryDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editedCategory.id ? 'Редактировать' : 'Добавить' }} категорию</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedCategory.name"
                  label="Название категории*"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedCategory.description"
                  label="Описание"
                  rows="2"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="closeCategoryDialog"
          >
            Отмена
          </v-btn>
          <v-btn
            color="primary"
            @click="saveCategory"
            :disabled="!editedCategory.name"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400px"
    >
      <v-card>
        <v-card-title class="text-h5 error--text">
          Подтверждение удаления
        </v-card-title>
        <v-card-text>
          Вы действительно хотите удалить {{ itemToDelete?.name }}?
          Это действие нельзя будет отменить.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="showDeleteDialog = false"
          >
            Отмена
          </v-btn>
          <v-btn
            color="error"
            @click="confirmDelete"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { menuApi } from '@/services/api'

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

    categories: [],
    items: [],

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
      return this.editedItem.name &&
        this.editedItem.categoryId &&
        this.editedItem.price > 0
    }
  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          menuApi.getCategories(),
          menuApi.getMenuItems({
            categoryIds: this.selectedCategories,
            status: this.selectedStatus,
            search: this.search
          })
        ])
        this.categories = categoriesResponse.data.categories
        this.items = itemsResponse.data.items
      } catch (error) {
        console.error('Error loading menu data:', error)
        // TODO: Show error notification to user
      } finally {
        this.loading = false
      }
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      }).format(value)
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId)
      return category ? category.name : ''
    },

    editItem(item) {
      this.editedItem = { ...item }
      this.showItemDialog = true
    },

    async deleteItem(item) {
      this.itemToDelete = item
      this.showDeleteDialog = true
    },

    async confirmDelete() {
      if (this.itemToDelete) {
        try {
          await menuApi.deleteMenuItem(this.itemToDelete.id)
          const index = this.items.findIndex(item => item.id === this.itemToDelete.id)
          if (index !== -1) {
            this.items.splice(index, 1)
          }
          // TODO: Show success notification
        } catch (error) {
          console.error('Error deleting item:', error)
          // TODO: Show error notification
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

    async handleImageUpload(file) {
      if (!file) return
      this.editedItem.imageFile = file
      this.editedItem.image = URL.createObjectURL(file)
    },

    async saveItem() {
      try {
        if (this.editedItem.id) {
          const response = await menuApi.updateMenuItem(this.editedItem.id, this.editedItem)
          const index = this.items.findIndex(item => item.id === this.editedItem.id)
          if (index !== -1) {
            this.items.splice(index, 1, response.data)
          }
        } else {
          const response = await menuApi.createMenuItem(this.editedItem)
          this.items.push(response.data)
        }
        // TODO: Show success notification
        this.closeItemDialog()
      } catch (error) {
        console.error('Error saving item:', error)
        // TODO: Show error notification
      }
    },

    async saveCategory() {
      try {
        if (this.editedCategory.id) {
          const response = await menuApi.updateCategory(this.editedCategory.id, this.editedCategory)
          const index = this.categories.findIndex(cat => cat.id === this.editedCategory.id)
          if (index !== -1) {
            this.categories.splice(index, 1, response.data)
          }
        } else {
          const response = await menuApi.createCategory(this.editedCategory)
          this.categories.push(response.data)
        }
        // TODO: Show success notification
        this.closeCategoryDialog()
      } catch (error) {
        console.error('Error saving category:', error)
        // TODO: Show error notification
      }
    },

    async deleteCategory(category) {
      try {
        await menuApi.deleteCategory(category.id)
        const index = this.categories.findIndex(cat => cat.id === category.id)
        if (index !== -1) {
          this.categories.splice(index, 1)
        }
        // TODO: Show success notification
      } catch (error) {
        console.error('Error deleting category:', error)
        // TODO: Show error notification
      }
    }
  },

  watch: {
    selectedCategories: {
      handler() {
        this.loadData()
      }
    },
    selectedStatus: {
      handler() {
        this.loadData()
      }
    },
    search: {
      handler() {
        this.loadData()
      }
    }
  }
}
</script>

<style scoped>
.v-data-table ::v-deep td {
  height: 60px;
}

.v-data-table ::v-deep .v-data-table__wrapper {
  overflow-x: auto;
}
</style> 