export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      console.log('Login attempt:', this.username);
      // Handle login logic here
    }
  },
  template: `  
  <div class="columns is-centered mt-6 mb-6">
    <div class="column is-4">

      <form class="box">
        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input class="input" type="text" placeholder="" />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input class="input" type="password" placeholder="" />
          </div>
        </div>

        <router-link to="/home" class="button is-link">Log in</router-link>

      </form>
    </div>
  </div>
  `
}
