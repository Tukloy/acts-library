import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import DashboardView from '@/views/DashboardView.vue';
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
  ],
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      // Check if the user is authenticated by hitting the /api/me endpoint
      const response = await axios.get('/api/me', { withCredentials: true });

      // If the response is successful, the user is authenticated
      if (response.status === 200) {
        next(); // Proceed to the requested route
      } else {
        // If not authenticated, redirect to the login page
        next({ name: 'login' });
      }
    } catch (error) {
      // If there's an error (e.g., the user is not authenticated), redirect to login
      next({ name: 'login' });
    }
  } else {
    next(); // If the route doesn't require authentication, proceed
  }
});

export default router;
