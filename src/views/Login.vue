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
            <v-toolbar-title>Вход в систему</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent="login"
            >
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
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="!valid"
              @click="login"
            >
              Войти
            </v-btn>
          </v-card-actions>

          <v-divider></v-divider>

          <v-card-text class="text-center">
            <span class="text-body-2">Нет аккаунта?</span>
            <v-btn
              text
              color="primary"
              to="/register"
              class="ml-2"
            >
              Зарегистрироваться
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'LoginPage',

  data: () => ({
    valid: false,
    email: '',
    password: '',
    showPassword: false,
    emailRules: [
      v => !!v || 'Email обязателен',
      v => /.+@.+\..+/.test(v) || 'Email должен быть корректным'
    ],
    passwordRules: [
      v => !!v || 'Пароль обязателен',
      v => v.length >= 6 || 'Пароль должен быть не менее 6 символов'
    ]
  }),

  methods: {
    login() {
      if (this.$refs.form.validate()) {
        // Здесь будет логика входа
        console.log('Login attempt:', { email: this.email, password: this.password })
        // После успешного входа
        this.$router.push('/')
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