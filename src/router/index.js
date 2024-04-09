import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { hasMoreCards } from '@/services/Card/cardService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/explore',
      name: 'Explore',
      component: () => import('../views/ExploreView.vue')
      /*meta: {
        requiresAuth: true,
      }*/
    },
    {
      path: '/:catchall(.*)*',
      name: 'Not Found',
      component: () => import('../views/404View.vue')
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/UsersView.vue')
    },
    {
      path: '/user/:id',
      name: 'User',
      component: () => import('../views/UserView.vue')
    }
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next()
    } else {
      alert("You don't have access!")
      next('/')
    }
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    hasMoreCards.value = true
  }
  next()
})

export default router
