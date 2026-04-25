import authStore from '../authStore.js';

export default {
  name: 'Navbar',

  data (){
    return {
      authStore
    }
  },

  mounted(){
    this.authStore.checkLoginStatus();
  },

  methods: {
    async handleLogout(){
      this.authStore.logout();
      this.$router.push('/login');
    }
  },

  template: 
  `
    <section class="hero is-small navbarIMG">
      <div class="hero-body">
        <img src="src/assets/background.jpg" alt="Background Image">
      </div>
    </section>

    <nav class="navbar is-dark" role="navigation" aria-label="main navigation m-6">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item logo has-text-white">
          <img src="src/assets/geneva.webp" alt="Logo" class="navbar-logo" style="max-height: 60px;">
        </router-link>
      </div>

      <div class="navbar-menu is-flex-grow-1">
        <div class="navbar-item is-flex-grow-1 is-justify-content-center">
          <p class="has-text-white is-size-3 has-text-weight-bold" style="font-family: 'Zalando Sans SemiExpanded', sans-serif;">Graduation Progress Tracker</p>
        </div>
      </div>


      <div class="navbar-end">
        <div class="navbar-item">
          <div v-if="authStore.isLoggedIn" class="is-flex is-align-items-center">
            <button class="button is-light mr-3" @click="handleLogout">Logout</button>
            <router-link to="/change" class="icon is-medium has-text-light">
              <i class="fas fa-utility fa-gear fa-lg"></i>
            </router-link>
          </div>
          <div v-else>
            <router-link to="/login" class="button is-light">Login</router-link>
          </div>
        </div>
      </div>
    </nav>
  `
}
