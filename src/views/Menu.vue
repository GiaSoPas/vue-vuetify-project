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
              <div class="font-weight-medium" :style="{ color: '#2D2D2D' }" v-html="formatSearchResult(item).name"></div>
              <div class="caption" :style="{ color: '#777' }" v-html="formatSearchResult(item).description"></div>
            </td>
            <!-- Категория -->
            <td :style="{ color: '#555' }" v-html="formatSearchResult(item).categoryName"></td>
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
import { menuApi } from '@/services/api'
import Fuse from 'fuse.js'

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
    fuse: null,
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

      // Фильтрация по категориям
      if (this.selectedCategories.length) {
        filtered = filtered.filter(item =>
          this.selectedCategories.includes(item.categoryId)
        )
      }

      // Фильтрация по статусу
      if (this.selectedStatus.length) {
        filtered = filtered.filter(item =>
          this.selectedStatus.includes(item.available)
        )
      }

      // Добавляем название категории для всех элементов
      filtered = filtered.map(item => ({
        ...item,
        categoryName: this.getCategoryName(item.categoryId)
      }))

      // Поиск с помощью Fuse.js
      if (this.search && this.search.trim() && this.fuse) {
        try {
          const searchQuery = this.search.trim().toLowerCase()
          console.log('Searching for:', searchQuery)
          
          const searchResults = this.fuse.search(searchQuery)
          console.log('Search results:', searchResults)
          
          if (searchResults && searchResults.length > 0) {
            // Создаем Set из ID найденных элементов для быстрого поиска
            const foundIds = new Set(searchResults.map(result => result.item.id))
            console.log('Found IDs:', Array.from(foundIds))
            
            // Фильтруем элементы, которые есть в результатах поиска
            filtered = filtered.filter(item => foundIds.has(item.id))
            console.log('Filtered items after search:', filtered.map(item => item.name))
          }
        } catch (error) {
          console.error('Search error:', error)
        }
      }

      return filtered
    },
    isValidItem() {
      return (
        this.editedItem.name &&
        this.editedItem.categoryId &&
        this.editedItem.price > 0
      )
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
      return category ? category.name : 'Без категории'
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
    handleImageUpload(file) {
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
    },

    formatSearchResult(item) {
      if (!this.search || !this.search.trim() || !this.fuse) {
        return {
          ...item,
          name: item.name || '',
          description: item.description || '',
          categoryName: item.categoryName || this.getCategoryName(item.categoryId)
        }
      }

      try {
        // Приводим поисковый запрос к нижнему регистру и разбиваем на слова
        const searchQuery = this.search.trim().toLowerCase()
        console.log('Searching for:', searchQuery)
        
        const result = this.fuse.search(searchQuery).find(r => r.item.id === item.id)
        console.log('Search result for item:', item.name, result)
        
        if (!result) {
          return {
            ...item,
            name: item.name || '',
            description: item.description || '',
            categoryName: item.categoryName || this.getCategoryName(item.categoryId)
          }
        }

        const highlightMatch = (text, matches) => {
          if (!matches || !text) return text || ''
          let highlighted = text
          matches.forEach(match => {
            if (match.indices && match.indices.length > 0) {
              const start = match.indices[0][0]
              const end = match.indices[0][1] + 1
              const matchedText = text.substring(start, end)
              highlighted = highlighted.replace(
                matchedText,
                `<span class="highlight">${matchedText}</span>`
              )
            }
          })
          return highlighted
        }

        const nameMatch = result.matches.find(m => m.key === 'name')
        const descriptionMatch = result.matches.find(m => m.key === 'description')
        const categoryMatch = result.matches.find(m => m.key === 'categoryName')

        return {
          ...item,
          name: highlightMatch(item.name, nameMatch?.indices) || '',
          description: highlightMatch(item.description, descriptionMatch?.indices) || '',
          categoryName: highlightMatch(item.categoryName, categoryMatch?.indices) || this.getCategoryName(item.categoryId)
        }
      } catch (error) {
        console.error('Error formatting search result:', error)
        return {
          ...item,
          name: item.name || '',
          description: item.description || '',
          categoryName: item.categoryName || this.getCategoryName(item.categoryId)
        }
      }
    }
  },

  watch: {
    items: {
      handler(newItems) {
        if (!newItems || !newItems.length) {
          this.fuse = null
          return
        }

        try {
          // Создаем копию элементов с названиями категорий и добавляем дополнительные поля для поиска
          const itemsWithCategories = newItems.map(item => {
            // Разбиваем название на отдельные слова для лучшего поиска
            const nameWords = (item.name || '').toLowerCase().split(/\s+/)
            return {
              ...item,
              categoryName: this.getCategoryName(item.categoryId),
              // Добавляем отдельные слова из названия для поиска
              nameWords: nameWords,
              // Добавляем поле для поиска по частям слов
              nameParts: nameWords.map(word => {
                const parts = []
                for (let i = 0; i < word.length; i++) {
                  for (let j = i + 1; j <= word.length; j++) {
                    parts.push(word.substring(i, j))
                  }
                }
                return parts
              }).flat()
            }
          })

          // Настраиваем Fuse.js для лучшего распознавания опечаток
          const options = {
            keys: [
              { name: 'name', weight: 2 },
              { name: 'nameWords', weight: 1.5 },
              { name: 'nameParts', weight: 1 },
              { name: 'description', weight: 1 },
              { name: 'categoryName', weight: 1.5 }
            ],
            // Делаем поиск максимально мягким
            threshold: 0.9,
            // Включаем оценку релевантности
            includeScore: true,
            // Минимальная длина совпадения
            minMatchCharLength: 1,
            // Сортировка по релевантности
            shouldSort: true,
            // Начальная позиция поиска
            location: 0,
            // Увеличиваем расстояние для поиска еще больше
            distance: 1000,
            // Разбиваем поисковый запрос на токены
            tokenize: true,
            // Ищем все возможные совпадения
            findAllMatches: true,
            // Ищем по всему тексту
            ignoreLocation: true,
            // Используем алгоритм Левенштейна для расстояния между строками
            useExtendedSearch: true,
            // Включаем информацию о совпадениях
            includeMatches: true,
            // Настройки для лучшего распознавания опечаток
            getFn: (obj, path) => {
              const value = Fuse.config.getFn(obj, path)
              if (typeof value === 'string') {
                return value.toLowerCase()
              }
              if (Array.isArray(value)) {
                return value.map(v => typeof v === 'string' ? v.toLowerCase() : v)
              }
              return value
            },
            // Используем более мягкий алгоритм сравнения
            sortFn: (a, b) => {
              // Сортируем по релевантности, но делаем более мягкую сортировку
              const scoreA = a.score || 1
              const scoreB = b.score || 1
              // Если разница в оценках небольшая, считаем результаты равными
              return Math.abs(scoreA - scoreB) < 0.1 ? 0 : scoreA - scoreB
            }
          }

          this.fuse = new Fuse(itemsWithCategories, options)
          console.log('Fuse.js initialized with', itemsWithCategories.length, 'items')
          
          // Тестовый поиск для проверки
          const testResults = this.fuse.search('куры')
          console.log('Test search results for "куры":', testResults)
        } catch (error) {
          console.error('Error initializing Fuse.js:', error)
          this.fuse = null
        }
      },
      immediate: true
    },

    search: {
      handler(newValue) {
        console.log('Search value changed:', newValue)
        if (this.fuse) {
          console.log('Fuse instance exists')
          // Тестовый поиск при изменении значения
          if (newValue && newValue.trim()) {
            const testResults = this.fuse.search(newValue.trim().toLowerCase())
            console.log('Test search results:', testResults)
          }
        } else {
          console.log('Fuse instance is null')
        }
      }
    },
    selectedCategories: {
      handler() {
        this.loadData()
      }
    },
    selectedStatus: {
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

:deep(.highlight) {
  background-color: rgba(184, 91, 62, 0.2);
  padding: 2px 0;
  border-radius: 2px;
  font-weight: 500;
}

:deep(.v-data-table) {
  background-color: transparent !important;
}

:deep(.v-data-table__wrapper) {
  overflow-x: auto;
}

:deep(.v-data-table td) {
  height: 60px;
  font-size: 14px;
}

:deep(.v-select__selections) {
  color: #2D2D2D !important;
}

:deep(.v-input__label) {
  color: #555 !important;
}

:deep(.v-input input),
:deep(.v-input textarea) {
  color: #2D2D2D !important;
}
</style>