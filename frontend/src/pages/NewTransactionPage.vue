<template>
  <div class="card">
    <h2>Neue Transaktion erfassen</h2>
    <form @submit.prevent="submit" class="form">
      <label>Datum</label>
      <input type="date" v-model="date" />
      <label>Händler</label>
      <input v-model="merchant" required />
      <label>Betrag</label>
      <input type="number" v-model.number="amount" required />
      <label>Freitext</label>
      <textarea v-model="rawText"></textarea>
      <button class="button-primary" type="submit">Analyse & Speichern</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { analyzeAndCreateTransaction } from '../services/api';

const router = useRouter();
const date = ref(new Date().toISOString().slice(0, 10));
const merchant = ref('');
const amount = ref(0);
const rawText = ref('');
const error = ref('');

const submit = async () => {
  error.value = '';
  try {
    await analyzeAndCreateTransaction({ date: date.value, merchant: merchant.value, amount: amount.value, rawText: rawText.value });
    router.push('/analysis');
  } catch (e) {
    error.value = 'Speichern fehlgeschlagen.';
  }
};
</script>

<style scoped>
.form {
  display: grid;
  gap: 0.5rem;
  max-width: 500px;
}
input, textarea {
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
.error {
  color: #b91c1c;
}
</style>
