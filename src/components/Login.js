import http from '../http-common.js';
import authStore from '../authStore.js';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },

  // Login method, uses http client to send a POST request to the login endpoint
  methods: {
    async handleSubmit() {
      try {
        const response = await http.post('/auth/login', {
          username: this.username,
          password: this.password
        });

        if (response.data && response.data.length > 0) {
          const user = response.data[0];
          authStore.login(user.user_guid, user);
          
          this.$router.push('/home');
        } else {
          this.error = 'Invalid credentials';
        }
      } catch (err) {
        console.error('Login error:', err);
        this.error = 'Login failed. Please try again.';
      }
    }
  },
  
  template: `  
  <div class="columns is-centered mt-6 mb-6">
    <div class="column is-4">

      <form class="box" @submit.prevent="handleSubmit">
        <div class="field">
          <label class="label">Username</label>
          <div class="control is-expanded">
            <input class="input" type="text" v-model="username" placeholder="" required />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control is-expanded">
            <input class="input" type="password" v-model="password" placeholder="" required />
          </div>
        </div>

        <div v-if="error" class="notification is-danger is-light">
          {{ error }}
        </div>

        <button type="submit" class="button is-link">Log in</button>

      </form>
    </div>
  </div>
  `
}
