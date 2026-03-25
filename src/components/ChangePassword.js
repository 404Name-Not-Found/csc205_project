export default {
    name: 'ChangePassword',

    data() {
        return {
            newPassword: '',
            error: '',
            success: ''
        }
    },

    methods: {
        async handleChangePassword() {
            this.error = '';
            this.success = '';
            
            try {
                const response = await this.$http.put('/auth/passwordreset', {
                    password: this.newPassword
                });

                if (response.status === 200) {
                    this.success = 'Password changed successfully';
                    this.newPassword = '';
                }
            } catch (err) {
                console.error('Change password error:', err);
                this.error = 'Failed to change password. Please try again.';
            }
        }
    },

    template: `
    <div class="columns is-centered mt-6 mb-6">
        <div class="column is-4">
            <form class="box" @submit.prevent="handleChangePassword">
                <div class="field">
                    <label class="label">New Password</label>
                    <div class="control">
                        <input class="input" type="password" v-model="newPassword" placeholder="" required />
                    </div>
                </div>

                <div v-if="success" class="notification is-success is-light">
                    {{ success }}
                </div>

                <div v-if="error" class="notification is-danger is-light">
                    {{ error }}
                </div>

                <button type="submit" class="button is-link">Change Password</button>
            </form>
        </div>
    </div>
    `
}