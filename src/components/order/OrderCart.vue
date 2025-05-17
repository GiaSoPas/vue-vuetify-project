<template>
  <div>
    <div v-if="value.length === 0" class="text-center pa-4">
      <v-icon size="64" color="grey lighten-1">mdi-cart-outline</v-icon>
      <div class="text-h6 grey--text">Корзина пуста</div>
      <div class="text-subtitle-1 grey--text">Добавьте блюда из меню</div>
    </div>

    <v-list v-else dense>
      <v-list-item v-for="item in value" :key="item.id">
        <v-list-item-content>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
          <v-list-item-subtitle class="d-flex align-center">
            <v-btn
              x-small
              icon
              @click="updateQuantity(item, -1)"
              :disabled="item.quantity <= 1"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="mx-2">{{ item.quantity }}</span>
            <v-btn
              x-small
              icon
              @click="updateQuantity(item, 1)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <span class="text-body-2">₽{{ (item.price * item.quantity).toLocaleString() }}</span>
          </v-list-item-subtitle>

          <v-text-field
            v-model="item.notes"
            label="Примечание к блюду"
            dense
            hide-details
            class="mt-2"
            placeholder="Например: без лука"
          ></v-text-field>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn
            icon
            small
            color="error"
            @click="removeItem(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'OrderCart',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  watch: {
    value: {
      deep: true,
      handler(newValue) {
        const total = newValue.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        this.$emit('update:total', total)
      }
    }
  },
  methods: {
    updateQuantity(item, change) {
      const newQuantity = item.quantity + change
      if (newQuantity < 1) return
      
      const updatedItems = this.value.map(i => 
        i.id === item.id 
          ? { ...i, quantity: newQuantity }
          : i
      )
      this.$emit('input', updatedItems)
    },
    
    removeItem(item) {
      const updatedItems = this.value.filter(i => i.id !== item.id)
      this.$emit('input', updatedItems)
    }
  }
}
</script> 