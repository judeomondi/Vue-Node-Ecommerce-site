import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
import * as VueRouter from 'vue-router'

import ShoppingCartPage from './pages/ShoppingCartPage.vue'
import ProductPage from './pages/ProductPage.vue'
import ProductDetailPage from './pages/ProductDetailPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

createApp(App)
.use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [
        {
        path: '/cart',
        component: ShoppingCartPage,
        },
        {
        path: '/products',
        component: ProductPage,
        },
        {
        path: '/product/:productId',
        component: ProductDetailPage,
        },
        {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage,
        }
    ]
}))
.mount('#app')
