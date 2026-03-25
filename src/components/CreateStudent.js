export default {

    // For this component,
    // I had gemini write console log statements that would write to the web console 
    // It show what information I could access for each student
    // I used those console log statements to fill in the variables on this page

    name: 'CreateStudent',

    data() {
        return {
            student: {
                firstname: '',
                lastname: '',
                preferred_name: '',
                email: '',
                student_id: '',
                matriculation_year: new Date().getFullYear(),
                math_proficient: false,
                reading_proficient: false,
                foreign_language: false,
                is_active: true,
                major: '',
                minor: '',
                credits: []
            },
            error: null,
            success: null,
            Majors: [],
            Minors:[],
        }
    },

    methods: {

        submitStudent() {
            // You have to fill certain fields to create a student
            if (!this.student.firstname || !this.student.lastname || !this.student.email || !this.student.student_id) {
                this.error = 'Please fill in all required fields';
                return;
            }

            // API post call to create student
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                apiClient.post('/students', this.student)
                    .then(response => {
                        this.success = 'Student created successfully!';
                        this.error = null;
                        this.student = {
                            firstname: '',
                            lastname: '',
                            preferred_name: '',
                            email: '',
                            student_id: '',
                            matriculation_year: new Date().getFullYear(),
                            math_proficient: false,
                            reading_proficient: false,
                            foreign_language: false,
                            is_active: true,
                            major: '',
                            minor: '',
                            credits: []
                        };
                        setTimeout(() => this.success = null, 3000);
                    })
                    .catch(error => {
                        this.error = 'Failed to create student';
                        console.error('Error creating student:', error.response?.data || error.message);
                    });
            });
        },

        // Reset button data, clears all fields
        resetForm() {
            this.student = {
                firstname: '',
                lastname: '',
                preferred_name: '',
                email: '',
                student_id: '',
                matriculation_year: new Date().getFullYear(),
                math_proficient: false,
                reading_proficient: false,
                foreign_language: false,
                is_active: true,
                major: '',
                minor: '',
                credits: []
            };
            this.error = null;
            this.success = null;
        }
    },

    template: `

        <div class="create-student-container">

            <h1>Create New Student</h1>

            <div v-if="error" class="notification is-danger">
                {{ error }}
            </div>

            <div v-if="success" class="notification is-success">
                {{ success }}
            </div>

            <div class="box">
                <form @submit.prevent="submitStudent">
                    <div class="field">
                        <label class="label">First Name</label>
                        <div class="control">
                            <input v-model="student.firstname" class="input" type="text" placeholder="Enter first name">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Last Name</label>
                        <div class="control">
                            <input v-model="student.lastname" class="input" type="text" placeholder="Enter last name">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Preferred Name</label>
                        <div class="control">
                            <input v-model="student.preferred_name" class="input" type="text" placeholder="Enter preferred name">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input v-model="student.email" class="input" type="email" placeholder="Enter email" required>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Student ID</label>
                        <div class="control">
                            <input v-model="student.student_id" class="input" type="text" placeholder="Enter student ID" required>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Matriculation Year</label>
                        <div class="control">
                            <input v-model.number="student.matriculation_year" class="input" type="number" :placeholder="new Date().getFullYear()">
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                                <input v-model="student.math_proficient" type="checkbox">
                                Math Proficient
                            </label>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                                <input v-model="student.reading_proficient" type="checkbox">
                                Reading Proficient
                            </label>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                                <input v-model="student.foreign_language" type="checkbox">
                                Foreign Language
                            </label>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                                <input v-model="student.is_active" type="checkbox">
                                Active
                            </label>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Major</label>
                        <div class="control">
                            <input v-model="student.major" class="input" type="text" placeholder="Enter major">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Minor</label>
                        <div class="control">
                            <input v-model="student.minor" class="input" type="text" placeholder="Enter minor">
                        </div>
                    </div>

                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-primary" type="submit">Create Student</button>
                        </div>
                        <div class="control">
                            <button class="button is-light" type="button" @click="resetForm">Reset</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `
}