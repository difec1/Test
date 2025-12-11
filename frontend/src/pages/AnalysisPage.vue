<template>
  <div class="grid">
    <div class="card">
      <h2>Deine Ausgaben Analyse</h2>
      <p>Du hast aktuell {{ Math.round(progress) }}% deines Monatsbudgets genutzt.</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p>{{ summary.usedBudget }} / {{ summary.monthlyBudget }} CHF</p>
    </div>
    <div class="card">
      <h3>Ausgaben nach Kategorie</h3>
      <div class="categories">
        <div v-for="cat in summary.byCategory" :key="cat.category" class="category-card">
          <div class="name">{{ cat.category }}</div>
          <div class="amount">{{ cat.amount.toFixed(2) }} CHF</div>
        </div>
      </div>
    </div>
    <div class="card">
      <h3>Erkannte Impulskäufe</h3>
      <div v-for="tx in summary.impulseTransactions" :key="tx.id" class="tx">
        <div>
          <strong>{{ tx.merchant }}</strong> · {{ tx.category }}
          <p>{{ tx.decisionExplanation }}</p>
        </div>
        <span class="badge" style="background:#fecdd3;color:#b91c1c">Impulskauf erkannt</span>
        <span class="amount">{{ tx.amount }} CHF</span>
      </div>
    </div>
    <div class="card">
      <h3>Dein Sparplan</h3>
      <div v-for="goal in goals" :key="goal.id" class="goal-item">
        <div class="goal-title">{{ goal.title }}</div>
        <div class="goal-meta">Zielbetrag {{ goal.targetAmount }} bis {{ goal.targetDate }}</div>
        <ul>
          <li v-for="rule in goal.rules || []" :key="rule">✅ {{ rule }}</li>
        </ul>
      </div>
    </div>
    <div class="card">
      <h3>Erkannte Muster & Nudges</h3>
      <div class="patterns">
        <div v-for="pattern in summary.patterns" :key="pattern" class="pattern-card">
          {{ pattern }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchAnalysis } from '../services/api';

const summary = ref({ monthlyBudget: 1, usedBudget: 0, byCategory: [], impulseTransactions: [], patterns: [] } as any);
const goals = ref<any[]>([]);

const progress = computed(() => Math.min(100, (summary.value.usedBudget / summary.value.monthlyBudget) * 100));

const load = async () => {
  const data = await fetchAnalysis();
  summary.value = data.summary;
  goals.value = data.goals;
};

onMounted(load);
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}
.progress {
  background: #e5e7eb;
  border-radius: 12px;
  height: 10px;
}
.progress-bar {
  background: #2563eb;
  height: 100%;
  border-radius: 12px;
}
.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.5rem;
}
.category-card {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 10px;
}
.tx {
  display: grid;
  grid-template-columns: 2fr auto auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}
.patterns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.5rem;
}
.pattern-card {
  background: #f1f5f9;
  border-radius: 10px;
  padding: 0.75rem;
}
.goal-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem;
  margin-top: 0.5rem;
}
</style>
