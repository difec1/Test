import { defineStore } from 'pinia';
import { loginUser, registerUser } from '../services/api';

interface UserProfile {
  username: string;
  email: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('jwt') || '',
    user: null as UserProfile | null,
    loading: false,
    error: '',
  }),
  actions: {
    async login(identifier: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        const data = await loginUser(identifier, password);
        this.token = data.jwt;
        this.user = data.user;
        localStorage.setItem('jwt', data.jwt);
      } catch (e) {
        this.error = 'Login fehlgeschlagen';
      } finally {
        this.loading = false;
      }
    },
    async register(username: string, email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        const data = await registerUser(username, email, password);
        this.token = data.jwt;
        this.user = data.user;
        localStorage.setItem('jwt', data.jwt);
      } catch (e) {
        this.error = 'Registrierung fehlgeschlagen';
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('jwt');
    },
  },
});
