<template>
  <div class="auth-wrapper">
    <div class="card auth-card">
      <h2>{{ registerMode ? 'Registrieren' : 'Login' }}</h2>
      <form @submit.prevent="submit">
        <label>Username</label>
        <input v-model="username" required />
        <label>Email</label>
        <input v-model="email" type="email" :required="registerMode" />
        <label>Passwort</label>
        <input v-model="password" type="password" required />
        <button class="button-primary" type="submit" :disabled="auth.loading">
          {{ registerMode ? 'Registrieren' : 'Login' }}
        </button>
      </form>
      <p class="error" v-if="auth.error">{{ auth.error }}</p>
      <RouterLink v-if="!registerMode" to="/register">Noch kein Konto? Registriere dich.</RouterLink>
      <RouterLink v-else to="/login">Zurück zum Login</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const route = useRoute();
const registerMode = route.path === '/register';
const auth = useAuthStore();
const username = ref('');
const email = ref('');
const password = ref('');

const submit = async () => {
  if (registerMode) {
    await auth.register(username.value, email.value, password.value);
  } else {
    await auth.login(username.value, password.value);
  }
  if (auth.token) {
    router.push('/goals');
  }
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  padding: 3rem;
}
.auth-card {
  width: 400px;
}
label {
  display: block;
  margin: 0.5rem 0 0.25rem;
}
input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.error {
  color: #b91c1c;
}
</style>
