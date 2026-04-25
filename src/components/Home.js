import Classes from './Classes.js';
import Students from './Students.js';
import CreateStudent from './CreateStudent.js';
import { useStudentStore } from '../stores/student.ts';

export default {
    name: 'Home',

    setup() {
        const studentStore = useStudentStore();
        return { studentStore };
    },

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

            selectedStudentId: null
        }
    },

    // Get the data for the currentlly logged in user and put it in a user object 
    async created() {
        const userInfo = localStorage.getItem('user_info');
        const activeStudentInfo = localStorage.getItem('active_student');
        
        if (activeStudentInfo) {
            this.user = { ...this.user, ...JSON.parse(activeStudentInfo) };
            if (this.user.student_id) {
                this.selectedStudentId = this.user.student_id;
            }
        } else if (userInfo) {
            this.user = { ...this.user, ...JSON.parse(userInfo) };
        }
        
        this.fetchStudentInfo();
    },

    methods: {

        // Function called when you select a new student from the dropdown
        switchStudent() {
            const matchedStudent = this.studentStore.students.find(s => s.student_id === this.selectedStudentId);
            if (matchedStudent) {
                this.user = { ...this.user, ...matchedStudent };
                this.studentStore.setActiveStudent(this.user);
                this.fetchStudentCourses(matchedStudent.student_id);
            }
        },

        // Method calculates credits a student has taken
        fetchStudentCourses(studentId) {
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                apiClient.get(`/studentcourses/${studentId}`)
                    .then(response => {
                        const courses = response.data;
                        let taken = 0;
                        let enrolled = 0;
                        
                        courses.forEach(course => {
                                taken += course.credits || 3;
                        });

                        this.user.credits = taken;
                        this.user.creditsLeft = 120 - taken - enrolled > 0 ? 120 - taken - enrolled : 0;
                    })
                    .catch(error => {
                        console.error('Error fetching student courses:', error);
                    });
            });
        },

        // Copied over from Students.js
        // Gets student information for the logged in user
        async fetchStudentInfo() {
            try {
                await this.studentStore.fetchStudents();
                
                // Find the student matching the logged-in user
                let matchedStudent = this.studentStore.students.find(s => 
                    s.student_id === this.selectedStudentId
                );

                // Default to the first student in the database as the first selected one
                if (matchedStudent) {
                    this.user = { ...this.user, ...matchedStudent };
                    this.selectedStudentId = matchedStudent.student_id;
                    this.studentStore.setActiveStudent(this.user);
                }
                
                // Get the courses for the student
                const studentId = this.user.student_id
                if (studentId) {
                    this.fetchStudentCourses(studentId);
                }
            } catch (error) {
                console.error('Error fetching student info:', error);
            }
        }
    },

    template: `
        <section class="section">
            <div class="columns">

                <!-- Student information -->
                <div class="column is-3">
                    <div class="box student-info-card">
                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Student</p>

                        <!-- Dropdown to switch between students -->
                        <div class="select is-fullwidth mb-3">
                            <select v-model="selectedStudentId" @change="switchStudent">
                                <option v-for="student in studentStore.students" :key="student.student_id" :value="student.student_id">
                                    {{ student.firstname }} {{ student.lastname }}
                                </option>
                            </select>
                        </div>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Credits Earned</p>
                        <p class="is-size-5 has-text-weight-bold mb-1">{{ user.credits || 0 }} / 120</p>
                        <progress class="progress is-small is-link mb-3" :value="user.credits || 0" max="120">{{ Math.round((((user.credits || 0) / 120) * 100)) }}%</progress>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Credits Left:</p>
                        <p class="is-size-5 has-text-weight-bold mb-3">{{ user.creditsLeft || (120 - (user.credits || 0)) }}</p>


                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1 mt-3">Major</p>
                        <p class="is-size-5 has-text-weight-bold mb-3">{{ user.majors && user.majors.length ? user.majors.map(m => m.major_name || m).join(', ') : 'None' }}</p>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Minor</p>
                        <p class="is-size-5 has-text-weight-bold">{{ user.minors && user.minors.length ? user.minors.map(m => m.minor_name || m).join(', ') : 'None' }}</p>
                    </div>
                        
                </div>

                <!-- Tab system from Bulma website for semester or list view -->
                <div class="column">
                    <div class="tabs is-boxed">
                        <ul>
                            <li :class="{ 'is-active': activeTab === 'Classes' }">
                                <a @click="activeTab = 'Classes'">Classes</a>
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
