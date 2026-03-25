export default {
    name: 'Students',

    data () {
        return {
            students: [],
            error: null,

            showInactive: false,
            dropdownOpen: false,

            sortBy: 'name'
        }
    },

    // Sort students
    // https://stackoverflow.com/questions/61754031/how-do-i-sort-a-computed-property-by-a-value
    computed: {
        filteredStudents() {

            // Filters active/inactive students
            let result = this.showInactive ? this.students : this.students.filter(student => student.is_active);

            // Sort based on name/major/credits
            if (this.sortBy === 'name') {
                result.sort((a, b) => {
                    const nameA = `${a.firstname} ${a.lastname}`.toLowerCase();
                    const nameB = `${b.firstname} ${b.lastname}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                }
                );
            } else if (this.sortBy === 'major') {
                result.sort((a, b) => {
                    const majorA = (a.major || '').toLowerCase();
                    const majorB = (b.major || '').toLowerCase();
                    return majorA.localeCompare(majorB);
                }
                );
            }
                else if (this.sortBy === 'credits') {
                result.sort((a, b) => {
                    const creditsA = a.credits ? a.credits.length : 0;
                    const creditsB = b.credits ? b.credits.length : 0;
                    return creditsB - creditsA;
                }
                );
            }

            return result;
        }
    },

    mounted() {
        this.fetchStudents();
        document.addEventListener('click', this.handleOutsideClick);
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
    },

    // Get students from database
    methods: {
        fetchStudents() {
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                apiClient.get('/students')
                    .then(response => {
                        this.students = response.data;
                    })
                    .catch(error => {
                        this.error = 'Failed to load students';
                        console.error('Error fetching students:', error);
                    });
            });
        },

        // Activate/Deativate button method
        toggleStudentStatus(student) {
            const newStatus = !student.is_active;
            const studentId = student.student_id || student.id;
            
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                apiClient.put('/students', {
                    student_id: studentId,
                    is_active: newStatus ? 1 : 0
                })
                    .then(response => {
                        student.is_active = newStatus;
                    })
                    .catch(error => {
                        console.error('Error updating student status:', error.response?.data || error.message);
                    });
            });
        },

        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },

        // Close dropdown if user clicks anywhere outside of it
        handleOutsideClick(event) {
            const dropdown = document.querySelector('.dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                this.dropdownOpen = false;
            }
        }
    },


    template: `
    <div class="students-container">

        <h1>Students:</h1>

        <div class="field mb-4">
            <div class="dropdown" :class="{ 'is-active': dropdownOpen }">
                <div class="dropdown-trigger">
                    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu" @click="toggleDropdown">
                    <span>Sort By</span>
                    <span class="icon is-small">
                        <i class="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu" role="menu">
                    <div class="dropdown-content">
                    <a class="dropdown-item" @click="sortBy = 'name'; dropdownOpen = false"> Name </a>
                    <a class="dropdown-item" @click="sortBy = 'major'; dropdownOpen = false"> Major </a>
                    <a class="dropdown-item" @click="sortBy = 'credits'; dropdownOpen = false"> Credits </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Oruga switch from their website -->
        <div class="field mb-4">
            <o-switch v-model="showInactive" class="is-info">
                Show Inactive Students
            </o-switch>
        </div>
        
        <div v-if="error" class="error">{{ error }}</div>
        
        <div v-if="students.length === 0" class="no-students">
            No students found.
        </div>
        
        <div v-if="filteredStudents.length > 0" class="student-table-container">
            <table class="table is-fullwidth is-striped is-hoverable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Student ID</th>
                        <th>Major</th>
                        <th>Credits</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student in filteredStudents" :key="student.student_id || student.id">
                        <td>{{ student.firstname }} {{ student.lastname }}</td>
                        <td>{{ student.student_id }}</td>
                        <td>{{ student.major || 'None' }}</td>
                        <td>{{ student.credits ? student.credits.length : 0 }}</td>
                        <td>
                            <span :class="student.is_active ? 'tag is-success' : 'tag is-danger'">
                                {{ student.is_active ? 'Active' : 'Inactive' }}
                            </span>
                        </td>
                        <td>
                            <button class="button is-small" @click="toggleStudentStatus(student)">
                                {{ student.is_active ? 'Deactivate' : 'Activate' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    `

}