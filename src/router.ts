
// From https://vueschool.io/articles/vuejs-tutorials/how-to-use-vue-router-a-complete-tutorial/
import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.js';
import Home from './components/Home.js';
import Info from './components/Info.js';
import Major from './components/Major.js';
import ChangePassword from './components/ChangePassword.js';

const routes = [
  {
    path: '/',
    name: 'Info',
    component: Info
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/major',
    name: 'Major',
    component: Major
  },
  {
    path: '/change',
    name: 'ChangePassword',
    component: ChangePassword
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
