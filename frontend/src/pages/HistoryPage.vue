<template>
  <div class="card">
    <header class="history-header">
      <div>
        <h2>Verlauf deiner analysierten Einkäufe</h2>
        <p>Budget genutzt: {{ summary.usedBudget }} / {{ summary.monthlyBudget }} CHF</p>
      </div>
      <RouterLink class="button-primary" to="/transactions/new">Neue Transaktion erfassen</RouterLink>
    </header>
    <div v-for="tx in transactions" :key="tx.id" class="tx-item">
      <div>
        <strong>{{ tx.merchant }}</strong>
        <div class="meta">{{ tx.date?.slice(0, 10) }} · {{ tx.category }}</div>
        <div class="explanation">{{ tx.decisionExplanation }}</div>
      </div>
      <span class="pill" :class="tx.decisionLabel === 'useful' ? 'good' : 'bad'">
        {{ tx.decisionLabel === 'useful' ? 'Eher sinnvoller Kauf' : 'Eher unnötiger Kauf' }}
      </span>
      <div class="amount">{{ tx.amount }} CHF</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchTransactions, fetchAnalysis } from '../services/api';

const transactions = ref<any[]>([]);
const summary = ref({ monthlyBudget: 1, usedBudget: 0 } as any);

const load = async () => {
  transactions.value = await fetchTransactions();
  const data = await fetchAnalysis();
  summary.value = data.summary;
};

onMounted(load);
</script>

<style scoped>
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tx-item {
  display: grid;
  grid-template-columns: 2fr auto auto;
  gap: 0.5rem;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 0;
}
.meta {
  color: #475569;
}
.pill {
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  color: white;
}
.pill.good {
  background: #22c55e;
}
.pill.bad {
  background: #ef4444;
}
.amount {
  font-weight: 700;
}
</style>
