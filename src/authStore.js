
// When looking up the best way to store login status, it was recommended I have a global manager
// I moved stuff from the login component and navbar component here

import { reactive } from 'vue';

const authStore = reactive({
    // If there is a token in localStorage, there is a user logged in
    isLoggedIn: !!localStorage.getItem('user_token'),

    // Store user token and information about the user in localStorage
    login(token, userInfo) {
        localStorage.setItem('user_token', token);
        localStorage.setItem('user_info', JSON.stringify(userInfo));
        this.isLoggedIn = true;
    },

    // Get rid of user info upon logging out
    logout() {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_info');
        this.isLoggedIn = false;
    },

    checkLoginStatus() {
        this.isLoggedIn = !!localStorage.getItem('user_token');
    }
});

export default authStore;
