import { useStudentStore } from '../stores/student.ts';

export default {

    name: 'CreateStudent',

    // Access to student state manager to update student list after making a new student
    setup() {
        const studentStore = useStudentStore();
        return { studentStore };
    },

    data() {
        return {
            student: {
                firstname: '',
                lastname: '',
                preferred_name: '',
                email: '',
                matriculation_year: new Date().getFullYear(),
                math_proficient: false,
                reading_proficient: false,
                foreign_language: false,
                is_active: true,
                major_id: null,
                minor_id: null,
            },
            error: null,
            success: null,
            majors: [],
            minors:[],
        }
    },

    mounted() {
        this.fetchMajors();
        this.fetchMinors();
    },

    methods: {


        // Majors and Minors for a dropdown selection
        async fetchMajors() {
            try {
                const module = await import('../http-common.js');
                const apiClient = module.default;
                const response = await apiClient.get('/majors');
                this.majors = response.data;
            } catch (error) {
                console.error('Error fetching majors:', error);
            }
        },

        async fetchMinors() {
            try {
                const module = await import('../http-common.js');
                const apiClient = module.default;
                const response = await apiClient.get('/minors');
                this.minors = response.data;
            } catch (error) {
                console.error('Error fetching minors:', error);
            }
        },

        // Create student form submition method
        submitStudent() {
            // You have to fill certain fields to create a student
            if (!this.student.firstname || !this.student.lastname || !this.student.email) {
                this.error = 'Please fill in all required fields';
                return;
            }

            // Student payload 
            const payload = {
                firstname: this.student.firstname,
                lastname: this.student.lastname,
                preferred_name: this.student.preferred_name,
                email: this.student.email,
                math_proficient: this.student.math_proficient ? 1 : 0,
                reading_proficient: this.student.reading_proficient ? 1 : 0,
                foreign_language: this.student.foreign_language ? 1 : 0,
                matriculation_year: this.student.matriculation_year,
                is_active: this.student.is_active ? 1 : 0
            };

            // API post call to create student
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                apiClient.post('/students', payload)
                    .then(response => {
                        const newStudent = response.data;
                        const studentId = typeof newStudent === 'number' ? newStudent : (newStudent.student_id || newStudent.id);
                        
                        // Collects information from the API request
                        const promises = [];
                        if (this.student.major_id) {
                            promises.push(apiClient.post('/majorstudents', {
                                student_id: studentId,
                                major_id: this.student.major_id
                            }));
                        }
                        
                        if (this.student.minor_id) {
                            promises.push(apiClient.post('/minorstudents', {
                                student_id: studentId,
                                minor_id: this.student.minor_id
                            }));
                        }
                        
                        return Promise.all(promises);
                    })
                    .then(() => {
                        this.success = 'Student created successfully!';
                        this.error = null;

                        // Update student list
                        this.studentStore.fetchStudents(); 

                        this.student = {
                            firstname: '',
                            lastname: '',
                            preferred_name: '',
                            email: '',
                            matriculation_year: new Date().getFullYear(),
                            math_proficient: false,
                            reading_proficient: false,
                            foreign_language: false,
                            is_active: true,
                            major_id: null,
                            minor_id: null,
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
                matriculation_year: new Date().getFullYear(),
                math_proficient: false,
                reading_proficient: false,
                foreign_language: false,
                is_active: true,
                major_id: null,
                minor_id: null,
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
                            <input v-model="student.firstname" class="input" type="text">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Last Name</label>
                        <div class="control">
                            <input v-model="student.lastname" class="input" type="text">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Preferred Name</label>
                        <div class="control">
                            <input v-model="student.preferred_name" class="input" type="text">
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input v-model="student.email" class="input" type="email" required>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Graduation Year</label>
                        <div class="control">
                            <input v-model.number="student.matriculation_year" class="input">
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
                            <div class="select is-fullwidth">
                                <select v-model="student.major_id">
                                    <option :value="null">None</option>
                                    <option v-for="major in majors" :key="major.id || major.major_id" :value="major.id || major.major_id">
                                        {{ major.major_name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Minor</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="student.minor_id">
                                    <option :value="null">None</option>
                                    <option v-for="minor in minors" :key="minor.id || minor.minor_id" :value="minor.id || minor.minor_id">
                                        {{ minor.minor_name }}
                                    </option>
                                </select>
                            </div>
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