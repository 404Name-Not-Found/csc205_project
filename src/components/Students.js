import { isDeleteExpression } from 'typescript';
import apiClient from '../http-common.js';
import { useStudentStore } from '../stores/student.ts';

export default {
    name: 'Students',

    data () {
        return {
            students: [],
            error: null,

            showInactive: false,
            dropdownOpen: false,

            sortBy: 'name',
            sortAscending: true,

            editStudent: null,

            majors: [],
            minors: [],
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
                    return this.sortAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                }
                );
            } else if (this.sortBy === 'major') {
                result.sort((a, b) => {
                    const majorA = this.getMajor(a).toLowerCase();
                    const majorB = this.getMajor(b).toLowerCase();
                    return this.sortAscending ? majorA.localeCompare(majorB) : majorB.localeCompare(majorA);
                }
                );
            }
                else if (this.sortBy === 'credits') {
                result.sort((a, b) => {
                    const creditsA = a.credits ? a.credits.length : 0;
                    const creditsB = b.credits ? b.credits.length : 0;
                    return this.sortAscending ? creditsB - creditsA : creditsA - creditsB;
                }
                );
            }

            return result;
        }
    },

    mounted() {
        this.fetchStudents();
        this.fetchMajors();
        this.fetchMinors();
        document.addEventListener('click', this.handleOutsideClick);
    },

    beforeUnmount() {
        document.removeEventListener('click', this.handleOutsideClick);
    },

    // Get students from database
    methods: {
        fetchStudents() {
                apiClient.get('/students')
                    .then(response => {
                        this.students = response.data;
                    })
                    .catch(error => {
                        this.error = 'Failed to load students';
                        console.error('Error fetching students:', error);
                    });
        },

        // Activate/Deativate button method
        toggleStudentStatus(student) {
            const newStatus = !student.is_active;
            const studentId = student.student_id || student.id;
            
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
        },

        openEditModal(student) {
            this.editStudent = {...student}; 
            
            // Set major_id and minor_id from student's majors and minors arrays for the dropdowns
            this.editStudent.major_id = student.majors && student.majors.length > 0 ? student.majors[0].major_id : null;
            this.editStudent.minor_id = student.minors && student.minors.length > 0 ? student.minors[0].minor_id : null;
        },

        closeEditModal(){
            this.editStudent = null;
            this.error = null;
        },

        async fetchMajors() {
            try {
                const response = await apiClient.get('/majors');
                this.majors = response.data;
            }catch (error) {
                console.error('Error fetching majors:', error);
            }
        },

        async fetchMinors() {
            try {
                const response = await apiClient.get('/minors');
                this.minors = response.data;
            }catch (error) {
                console.error('Error fetching minors:', error);
            }
        },

        // Gets specifically the names of the majors/minors
        getMajor(student){
            const id = student.majors && student.majors.length > 0 ? student.majors[0].major_id : student.major_id;
            const major = this.majors.find(m => m.id === id || m.major_id === id);
            return major ? major.major_name : 'None';
        },

        getMinor(student){
            const id = student.minors && student.minors.length > 0 ? student.minors[0].minor_id : student.minor_id;
            const minor = this.minors.find(m => m.id === id || m.minor_id === id);
            return minor ? minor.minor_name : 'None';
        },


        deleteStudent(student) {
            const studentId = student.student_id || student.id;
            if (confirm(`Are you sure you want to delete ${student.firstname} ${student.lastname}? This action cannot be undone.`)) {
                apiClient.delete(`/students/${studentId}`)
                    .then(response => {
                        this.students = this.students.filter(s => s.student_id !== studentId && s.id !== studentId);
                    })
                    .catch(error => {
                        console.error('Error deleting student:', error.response?.data || error.message);
                    });
            }
        },

        // Saves student changes to database with put request
        async saveStudent() {
            try {
                
                const studentId = this.editStudent.student_id || this.editStudent.id;
                
                // JSON payload
                const payload = {
                    student_id: studentId,
                    major_id: this.editStudent.major_id,
                    minor_id: this.editStudent.minor_id,
                    firstname: this.editStudent.firstname,
                    lastname: this.editStudent.lastname,
                    is_active: this.editStudent.is_active
                };
                
                const promises = [];
                if (this.editStudent.major_id) {
                    promises.push(apiClient.post('/majorstudents', {
                        student_id: studentId,
                        major_id: this.editStudent.major_id
                    }));
                }

                if (this.editStudent.minor_id) {
                    promises.push(apiClient.post('/minorstudents', {
                        student_id: studentId,
                        minor_id: this.editStudent.minor_id
                    }));
                }

                await Promise.all(promises);

                // Update local student data
                const index = this.students.findIndex(
                    s => s.student_id === studentId || s.id === studentId
                );
                if (index !== -1) {
                    this.students[index].major_id = this.editStudent.major_id;
                    this.students[index].minor_id = this.editStudent.minor_id;
                }

                this.error = null;
                this.closeEditModal();

            } catch (err) {
                this.error = 'Failed to save student changes. Please check the console.';
                console.error('Save Error (Server Response):', err.response?.data || err.message);
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

        <!-- Sort ascending or descending -->
        <div class="field mb-4">
            <o-switch v-model="sortAscending" class="is-info">
                Sort Ascending
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
                        <th>Edit Student</th>
                        <th> Delete Student </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="student in filteredStudents" :key="student.student_id || student.id">
                        <td>{{ student.firstname }} {{ student.lastname }}</td>
                        <td>{{ student.student_id }}</td>
                        <td>{{ getMajor(student) }}</td>
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
                        <td>
                            <button class="button is-small is-info mr-2" @click="openEditModal(student)">
                                Edit
                            </button>
                        </td>
                        <td>
                            <button class="button is-small is-danger" @click="deleteStudent(student)">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


        <!-- Edit student modal -->
        <div class="modal" :class="{ 'is-active': editStudent !== null }">

            <div class="modal-background" @click="closeEditModal"></div>

            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Edit Student Information</p>
                    <button class="delete" aria-label="close" @click="closeEditModal"></button>
                </header>

                <section class="modal-card-body" v-if="editStudent">
                    <div class="field">
                        <label class="label">Major</label>
                        <div class="control">
                            <div class="select is-fullwidth">
                                <select v-model="editStudent.major_id">
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
                                <select v-model="editStudent.minor_id">
                                    <option :value="null">None</option>
                                    <option v-for="minor in minors" :key="minor.id || minor.minor_id" :value="minor.id || minor.minor_id">
                                        {{ minor.minor_name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div v-if="error" class="notification is-danger mt-3">
                        {{ error }}
                    </div>
                </section>

                <footer class="modal-card-foot">
                    <button class="button is-success" @click="saveStudent">Save changes</button>
                    <button class="button ml-4" @click="closeEditModal">Cancel</button>
                </footer>
            </div>
        </div>
    </div>
    `

}