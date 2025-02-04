import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import AdminView from '@/views/AdminView.vue';
import NotFoundView from '@/views/NotfoundView.vue';
import Dashboard from '@/components/Dashboard.vue';
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
      path: '/admin',
      component: AdminView,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/dashboard', // Default view when visiting /admin
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: '/:catchAll(.*)',
          name: "not-found",
          component: NotFoundView,
        }
      ],
    },
  ],
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    const response = await axios.get('/api/me', { withCredentials: true });

    if (response.status === 200) {
      // User is authenticated
      if (to.name === 'login') {
        return next({ name: 'dashboard' }); // Redirect to dashboard if already logged in
      }
      return next(); // Proceed normally
    }
  } catch (error) {
    // If there's an error (e.g., user is not authenticated)
    if (to.meta.requiresAuth) {
      return next({ name: 'login' }); // Redirect to login if trying to access a protected route
    }
  }
  
  next(); // Proceed to the requested route
});

export default router;
