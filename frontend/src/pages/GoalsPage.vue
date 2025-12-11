<template>
  <div class="grid">
    <div class="card chat-card">
      <h2>SmartBudgetAI Coach</h2>
      <div class="chat-window">
        <div v-for="(msg, index) in history" :key="index" :class="['bubble', msg.role]">
          <p>{{ msg.content }}</p>
        </div>
        <div v-if="loading" class="bubble assistant">SmartBudgetAI tippt...</div>
      </div>
      <div class="chat-input">
        <input v-model="message" @keyup.enter="send" placeholder="Frage oder Sparziel eingeben" />
        <button class="button-primary" @click="send">Senden</button>
      </div>
    </div>
    <div class="card goals-card">
      <div class="header-row">
        <h3>Deine Sparziele</h3>
        <small v-if="goals.length === 0">Noch keine Ziele angelegt</small>
      </div>
      <div v-for="goal in goals" :key="goal.id" class="goal-item">
        <div class="goal-title">{{ goal.title }}</div>
        <div class="goal-meta">Zielbetrag {{ goal.targetAmount }} bis {{ goal.targetDate }}</div>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress(goal) + '%' }"></div>
        </div>
        <ul>
          <li v-for="rule in goal.rules || []" :key="rule">✅ {{ rule }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchGoals, sendChat } from '../services/api';

const history = ref<{ role: string; content: string }[]>([
  { role: 'assistant', content: 'Hallo! Ich bin SmartBudgetAI. Was möchtest du heute optimieren?' },
]);
const message = ref('');
const goals = ref<any[]>([]);
const loading = ref(false);

const loadGoals = async () => {
  goals.value = await fetchGoals();
};

const send = async () => {
  if (!message.value) return;
  loading.value = true;
  history.value.push({ role: 'user', content: message.value });
  const { reply, goals: updatedGoals } = await sendChat(history.value, message.value);
  if (reply) history.value.push({ role: 'assistant', content: reply });
  if (updatedGoals) goals.value = updatedGoals;
  message.value = '';
  loading.value = false;
};

const progress = (goal: any) => {
  if (!goal.targetAmount) return 0;
  return Math.min(100, Math.round(((goal.currentSavedAmount || 0) / goal.targetAmount) * 100));
};

onMounted(loadGoals);
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}
.chat-window {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  height: 500px;
  overflow-y: auto;
}
.bubble {
  max-width: 80%;
  margin-bottom: 0.75rem;
  padding: 0.8rem;
  border-radius: 12px;
}
.bubble.assistant {
  background: #e2e8f0;
  color: #0f172a;
  align-self: flex-start;
}
.bubble.user {
  background: #2563eb;
  color: white;
  margin-left: auto;
}
.chat-input {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.chat-input input {
  flex: 1;
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}
.goals-card ul {
  padding-left: 1rem;
}
.goal-item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.75rem;
  margin-top: 0.75rem;
}
.progress {
  background: #e5e7eb;
  border-radius: 12px;
  height: 8px;
  margin: 0.5rem 0;
}
.progress-bar {
  background: #22c55e;
  height: 100%;
  border-radius: 12px;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
