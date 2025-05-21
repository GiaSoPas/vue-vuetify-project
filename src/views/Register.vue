/* eslint-disable vue/valid-v-slot */
<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Регистрация</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent="register"
            >
              <v-text-field
                v-model="name"
                label="Имя"
                name="name"
                prepend-icon="mdi-account"
                :rules="nameRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                prepend-icon="mdi-email"
                type="email"
                :rules="emailRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="phone"
                label="Телефон"
                name="phone"
                prepend-icon="mdi-phone"
                :rules="phoneRules"
                required
              ></v-text-field>

              <v-select
                v-model="role"
                :items="roles"
                label="Роль"
                prepend-icon="mdi-account-tie"
                :rules="[v => !!v || 'Выберите роль']"
                required
              ></v-select>

              <v-text-field
                v-model="password"
                label="Пароль"
                name="password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                :rules="passwordRules"
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                label="Подтвердите пароль"
                name="confirmPassword"
                prepend-icon="mdi-lock-check"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                :rules="confirmPasswordRules"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!valid"
              @click="register"
            >
              Зарегистрироваться
            </v-btn>
          </v-card-actions>

          <v-divider></v-divider>

          <v-card-text class="text-center">
            <span class="text-body-2">Уже есть аккаунт?</span>
            <v-btn
              text
              color="primary"
              to="/login"
              class="ml-2"
            >
              Войти
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'RegisterPage',

  data: () => ({
    valid: false,
    name: '',
    email: '',
    phone: '',
    role: null,
    password: '',
    confirmPassword: '',
    showPassword: false,
    roles: [
      { text: 'Официант', value: 'waiter' },
      { text: 'Повар', value: 'cook' }
    ],
    nameRules: [
      v => !!v || 'Имя обязательно',
      v => v.length >= 2 || 'Имя должно содержать минимум 2 символа'
    ],
    emailRules: [
      v => !!v || 'Email обязателен',
      v => /.+@.+\..+/.test(v) || 'Email должен быть корректным'
    ],
    phoneRules: [
      v => !!v || 'Телефон обязателен',
      v => /^\+?[0-9]{10,12}$/.test(v.replace(/\D/g, '')) || 'Телефон должен быть корректным'
    ],
    passwordRules: [
      v => !!v || 'Пароль обязателен',
      v => v.length >= 6 || 'Пароль должен быть не менее 6 символов'
    ],
    confirmPasswordRules: [
      v => !!v || 'Подтверждение пароля обязательно',
      v => v === this.password || 'Пароли не совпадают'
    ]
  }),

  methods: {
    register() {
      if (this.$refs.form.validate()) {
        // Здесь будет логика регистрации
        console.log('Register attempt:', {
          name: this.name,
          email: this.email,
          phone: this.phone,
          role: this.role,
          password: this.password
        })
        // После успешной регистрации
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  max-width: 400px;
  margin: 0 auto;
}
</style> 