
import Classes from './Classes.js';
import Students from './Students.js';
import CreateStudent from './CreateStudent.js';

export default {
    name: 'Home',

    // For switching between the semster and list tab view
    components: {
        Classes,
        Students,
        CreateStudent
    },
    
    data() {
        return {
            activeTab: 'Classes',

            // Student infomration for the side panel
            user: {
                firstname: '',
                lastname: '',
                credits: '',
                gpa: '',
                year: '',
                majors: [],
                minors: []
            },
            students: []
        }
    },

    // Loads user informatoin from localStorage 
    async created() {
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            this.user = { ...this.user, ...JSON.parse(userInfo) };
            this.fetchStudentInfo();
        }
    },

    methods: {

        // Copied over from Students.js
        // Gets student information for the logged in user
        fetchStudentInfo() {
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                apiClient.get('/students')
                    .then(response => {
                        const students = response.data;
                        // Find the student matching the logged-in user
                        const matchedStudent = students.find(s => 
                            s.email === this.user.email || 
                            s.student_id === this.user.student_id || 
                            s.id === this.user.id
                        );
                        if (matchedStudent) {
                            this.user = { ...this.user, ...matchedStudent };
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching student info:', error);
                    });
            });
        }
    },

    template: `
        <section class="section">
            <div class="columns">

                <!-- Student information -->
                <div class="column is-3">
                    <div class="box student-info-card">
                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Name</p>
                        <p class="is-size-5 has-text-weight-bold mb-3">{{ user.firstname }} {{ user.lastname }}</p>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Credits Earned</p>
                        <p class="is-size-5 has-text-weight-bold mb-1">{{ user.credits }} / 120</p>
                        <progress class="progress is-small is-link mb-3" :value="user.credits" max="120">{{ Math.round(((user.credits / 120) * 100)) }}%</progress>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Current GPA</p>
                        <p class="is-size-5 has-text-weight-bold mb-3">{{ user.gpa }}</p>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Year [By Credits]</p>
                        <p class="is-size-5 has-text-weight-bold">{{ user.year }}</p>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1 mt-3">Major</p>
                        <p class="is-size-5 has-text-weight-bold mb-3">{{ user.majors && user.majors.length ? user.majors.join(', ') : '' }}</p>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Minor</p>
                        <p class="is-size-5 has-text-weight-bold">{{ user.minors && user.minors.length ? user.minors.join(', ') : '' }}</p>

                        <br>
                        <router-link to="/major" class="button is-medium is-link is-light mt-4">Change Major</router-link>
                    
                    </div>
                        
                </div>

                <!-- Tab system from Bulma website for semester or list view -->
                <div class="column">
                    <div class="tabs is-boxed">
                        <ul>
                            <li :class="{ 'is-active': activeTab === 'Classes' }">
                                <a @click="activeTab = 'Classes'">Classes View</a>
                            </li>
                            <li :class="{ 'is-active': activeTab === 'Students' }">
                                <a @click="activeTab = 'Students'">Students</a>
                            </li>
                            <li :class="{ 'is-active': activeTab === 'CreateStudent' }">
                                <a @click="activeTab = 'CreateStudent'">Create Student</a>
                            </li>
                        </ul>
                    </div>

                    <Classes v-if="activeTab === 'Classes'" />
                    <Students v-if="activeTab === 'Students'" />
                    <CreateStudent v-if="activeTab === 'CreateStudent'" />

                </div>

            </div>
        </section>
    `
}
