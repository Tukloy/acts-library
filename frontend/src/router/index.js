import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import AdminView from '@/views/AdminView.vue';
import NotFoundView from '@/views/NotfoundView.vue';
import Dashboard from '@/components/Dashboard.vue';
import AcademicPapers from '@/components/AcademicPapers.vue';
import AcademicPaperCreate from '@/layout/AcademicPaperCreate.vue';
import Books from '@/components/Books.vue';
import BookCreate from '@/layout/BookCreate.vue';
import Transactions from '@/components/Transactions.vue';
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
          path: '/academic-papers',
          name: 'academic-papers',
          component: AcademicPapers,
        },
        {
          path: '/academic-papers/create',
          name: 'academic-paper-create',
          component: AcademicPaperCreate,
        },
        {
          path: '/books',
          name: 'books',
          component: Books,
        },
        {
          path: '/books/create',
          name: 'book-create',
          component: BookCreate,
        },
        {
          path: '/transactions',
          name: 'transactions',
          component: Transactions
        },
        {
          path: '/:catchAll(.*)',
          name: "not-found",
          component: NotFoundView,
        },
      ],
    },
  ],
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    const response = await axios.get('/api/me', { withCredentials: true });

    if (response.status === 200) {
      if (to.name === 'login') {
        return next({ name: 'dashboard' });
      }
      return next();
    }
  } catch (error) {
    if (error.response?.status === 401 && to.meta.requiresAuth) {
      return next({ name: 'login' });
    }
  }

  next();
})

export default router;
