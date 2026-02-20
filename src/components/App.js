import Navbar from './Navbar.js';
import Footer from './Footer.js';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  template: 
  `
    <div class="app-wrapper">
      <Navbar />
      <div class="main-content">
        <router-view></router-view>
      </div>
      <Footer />
    </div>
  `
}
