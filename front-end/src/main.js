import { createApp } from 'vue'
import App from './App.vue'
import './main.css'
import * as VueRouter from 'vue-router'

import ShoppingCartPage from './pages/ShoppingCartPage.vue'
import ProductPage from './pages/ProductPage.vue'
import ProductDetailPage from './pages/ProductDetailPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyA1eXzJbsDIkgcR3pISr4HrPqb-Dy-w-5E",
  authDomain: "vue-site-af5fe.firebaseapp.com",
  projectId: "vue-site-af5fe",
  storageBucket: "vue-site-af5fe.appspot.com",
  messagingSenderId: "858368039528",
  appId: "1:858368039528:web:d4be9bcf452018d97c39dd"
};


initializeApp(firebaseConfig);

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
            path: '/',
            redirect: '/products'
        },
        {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage,
        }
    ]
}))
.mount('#app')
