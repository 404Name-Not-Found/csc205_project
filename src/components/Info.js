export default {
    name: 'Info',
    template: `
        <section class="hero">
            <div class="hero-body">
                <div class="container has-text-centered">
                    <h1 class="title">Welcome!</h1>
                    <p class="subtitle mt-4">
                        This is the Geneva Progress Tracker! Log in to begin viewing your student information.
                    </p>

                    <router-link class="button is-link" to="/login">Log In</router-link>
                </div>
            </div>
        </section>
    `
}