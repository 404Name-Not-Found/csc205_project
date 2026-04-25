import { useStudentStore } from '../stores/student.ts';

export default {
    name: 'Classes',

    setup() {
        const studentStore = useStudentStore();
        return { studentStore };
    },

    data() {
        return {
            isListView: false,
            isAddCourseModalActive: false,
            selectedSemester: '',
            selectedCourse: '',

            fetchedCourses: {},
            user: {},
            coreCourses: []
        }
    },

    methods: {

        // Method for setting the color of the rows
        getRowColor(status) {
            if (!status) return 'has-background-info-light';
            const s = status.toLowerCase();
            if (s === 'failed') return 'has-background-danger-light';
            if (s === 'passed') return 'has-background-success-light';
            if (s === 'in-progress' || s === 'in progress') return 'has-background-warning-light';
            if (s === 'audit' || s === 'transfer') return 'has-background-grey-light';
            if (s === 'scheduled') return 'has-background-info-light';
            return 'has-background-info-light';
        },

        // Method that is called when you select a new course status from dropdown
        updateCourseStatus(course, semesterNum) {
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                
                // JSON payload
                const payload = {
                    student_id: this.user.student_id,
                    course_id: course.course_id,
                    semester_id: semesterNum,
                    status: course.status
                };

                // Update the status of the course
                if (course.id) {
                    apiClient.put(`/studentcourses/${course.id}`, payload)
                    .then(() => {
                        console.log('Successfully updated status');
                    })
                    .catch(error => {
                        console.error('Error updating status', error);
                    });
                }
            });
        },

        // Method to a course to a semester
        addCourse() {
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                
                // JSON payload
                const courseData = {
                    student_id: this.user.student_id,
                    course_id: this.selectedCourse,
                    semester_id: this.selectedSemester,
                    status: 'scheduled'
                };

                // Post request sent to add the course
                apiClient.post('/studentcourses', courseData)
                    .then(response => {
                        this.isAddCourseModalActive = false;
                        
                        // Update local display
                        const addedCourse = this.coreCourses.find(c => c.course_id === this.selectedCourse);

                        // Add course to the right semester
                        if (addedCourse && addedCourse.course) {
                            if (!this.fetchedCourses[this.selectedSemester]) {
                                this.fetchedCourses[this.selectedSemester] = [];
                            }
                            this.fetchedCourses[this.selectedSemester].push({
                                course_code: addedCourse.course.course_code,
                                course_name: addedCourse.course.course_name,
                                credits: addedCourse.course.credits || 3
                            });
                            // Force reactive update
                            this.fetchedCourses = { ...this.fetchedCourses };
                        }
                    })
                    .catch(error => {
                        console.error('Error adding course', error);
                    });
            });
        },

        // Get the core courses from their independent enpoint
        fetchCoreCourses() {
            import('../http-common.js').then(module => {
                const apiClient = module.default;
                apiClient.get('/courses/core').then(response => {
                    this.coreCourses = response.data;
                }).catch(err => console.error(err));
            });
        },


        // Gets classes for students
        // This holds the logic for what classes to show
        fetchClassesForStudent(studentData) {
            import('../http-common.js').then(module => {
                const apiClient = module.default;

                // Get data about the student
                const studentId = studentData.student_id;
                apiClient.get(`/students/${studentId}`).then(response => {
                    const fullStudentData = response.data;
                    const majors = fullStudentData.majors;

                    // Get classes for the major
                    if (majors && majors.length > 0) {
                        const majorId = majors[0].major_id;
                        this.user.major_id = majorId;
                        this.user.major_name = majors[0].major_name || this.user.major_name;
                        
                        // Go to specific endpoint for courses for a specific major
                        apiClient.get(`/courses/major/${majorId}/prereqs`)
                            .then(courseResponse => {
                                let courses = courseResponse.data;

                                // Deals with nesting of courses in the API response
                                if (courses.length > 0 && courses[0].courses) {
                                    courses = courses[0].courses;
                                } else if (courses.data) {
                                    courses = courses.data;
                                }

                                // Put courses in the right semesters
                                if (courses && courses.length > 0) {

                                    // Map courses by ID 
                                    const coursesMap = {};
                                    courses.forEach(c => {
                                        coursesMap[c.course_id] = c;
                                    });

                                    // Put courses in the first available semester
                                    let remainingCourses = [...courses];
                                    const completedCourseIds = new Set();
                                    
                                    const semesters = {};
                                    let s = 1;


                                    // Loop until no courses are left to schedule
                                    while (remainingCourses.length > 0) {
                                        if (!semesters[s]) semesters[s] = [];
                                        let currentCredits = 0;
                                        let takenThisSemester = [];
                                        for (let i = 0; i < remainingCourses.length; i++) {
                                            const course = remainingCourses[i];
                                            
                                            // Check if prereqs are completed
                                            let prereqsMet = true;
                                            if (course.prereqs && course.prereqs.length > 0) {
                                                prereqsMet = course.prereqs.every(p => completedCourseIds.has(p.course_id));
                                            }
                                            
                                            // Take the courses in the earliest semester if the prereq are satisfied
                                            if (prereqsMet) {
                                                // Calculate credits and check if it fits in this semester (defualt 3 credits)
                                                const credits = Number(course.credits) || 3;
                                                if (currentCredits + credits <= 18) {
                                                    currentCredits += credits;
                                                    takenThisSemester.push(course);
                                                    
                                                    // Remove course from remaining
                                                    remainingCourses.splice(i, 1);
                                                    i--;
                                                }
                                            }
                                        }

                                        // Force remaining couses to avoid infinite loop
                                        if (takenThisSemester.length === 0 && remainingCourses.length > 0) {
                                            // Just grab the first remaining course and push it through to break the deadlock
                                            const forcedCourse = remainingCourses.shift();
                                            takenThisSemester.push(forcedCourse);
                                        }

                                        // Mark courses completed
                                        takenThisSemester.forEach(c => {
                                            completedCourseIds.add(c.course_id);
                                            const { pivot, prereqs, prereqs_of, ...cleanCourse } = c;
                                            cleanCourse.status = 'Passed';
                                            semesters[s].push(cleanCourse);
                                        });

                                        s++;
                                    }
                                    this.fetchedCourses = semesters;

                                    // For courses manually added, add to the selected semester
                                   apiClient.get(`/studentcourses/${studentId}`).then(scRes => {
                                        const manuallyAdded = scRes.data;
                                        if (manuallyAdded && manuallyAdded.length > 0) {
                                            manuallyAdded.forEach(mapped => {
                                                const sem = mapped.semester_id || mapped.semester;
                                                if (!sem) return;

                                                // Ensure the semester exists
                                                if (!this.fetchedCourses[sem]) {
                                                    this.fetchedCourses[sem] = [];
                                                }

                                                // Map data from API response
                                                const courseDetails = {
                                                    id: mapped.id,
                                                    course_id: mapped.course_id,
                                                    course_code: mapped.course?.course_code || mapped.course_id,
                                                    course_name: mapped.course?.course_name || 'Course',
                                                    credits: mapped.course?.credits || mapped.credits || 3,
                                                    status: mapped.status || 'Scheduled'
                                                };

                                                // Add course to the selected semester
                                                this.fetchedCourses[sem].push(courseDetails);
                                            });

                                            // Force Vue reactivity update
                                            this.fetchedCourses = { ...this.fetchedCourses };
                                        }
                                    }).catch(err => {
                                        console.error('Error fetching studentcourses:', err);
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching major courses:', error);
                            });
                    }
                }).catch(error => {
                    console.error('Error fetching student data:', error);
                });
            });
        }
    },
    
    // Watch for changes on the store's activeStudent state
    watch: {
        'studentStore.activeStudent': {
            handler(newStudent) {
                if (newStudent) {
                    this.user = { ...newStudent };
                    this.fetchClassesForStudent(newStudent);
                }
            },
            deep: true
        }
    },

    // Loads courses from a student's major
    async created() {
        if (this.studentStore.activeStudent) {
            this.user = { ...this.studentStore.activeStudent };
            this.fetchClassesForStudent(this.studentStore.activeStudent);
        } else {
            const activeStudent = localStorage.getItem('active_student');
            if (activeStudent) {
                this.user = JSON.parse(activeStudent);
                this.fetchClassesForStudent(this.user);
            } else {
                const userInfo = localStorage.getItem('user_info');
                if (userInfo) {
                    this.user = JSON.parse(userInfo);
                    this.fetchClassesForStudent(this.user);
                }
            }
        }
        this.fetchCoreCourses();
    },

    template: `
        <div>

            <div class="is-flex is-justify-content-space-between is-align-items-center mb-4">
                <h2 class="title is-4 mb-0">8 Semester Plan for {{ user.major_name }} Major</h2>
                <button class="button is-primary" @click="isAddCourseModalActive = true">
                    <span>Add Course</span>
                </button>
            </div>
            
            <div class="box mt-4" v-if="fetchedCourses && Object.keys(fetchedCourses).length > 0">

                <div class="mb-5">
                    <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
                        <h3 class="title is-5 mb-0">Transfered courses</h3>
                    </div>
                    <div class="table-container">
                        <table class="table is-fullwidth is-striped is-hoverable is-bordered" style="table-layout: fixed;">
                            <thead>
                                <tr>
                                    <th style="width: 25%">Course Code</th>
                                    <th style="width: 50%">Course Name</th>
                                    <th style="width: 25%">Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div v-for="semesterNum in 8" :key="semesterNum" class="mb-5">
                    <div class="is-flex is-justify-content-space-between is-align-items-center mb-3">
                        <h3 class="title is-5 mb-0">Semester {{ semesterNum }}</h3>
                    </div>
                    <div class="table-container" v-if="fetchedCourses[semesterNum] && fetchedCourses[semesterNum].length > 0">
                        <table class="table is-fullwidth is-striped is-hoverable is-bordered" style="table-layout: fixed;">
                            <thead>
                                <tr>
                                    <th style="width: 25%">Course Code</th>
                                    <th style="width: 40%">Course Name</th>
                                    <th style="width: 15%">Credits</th>
                                    <th style="width: 20%">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(course, index) in fetchedCourses[semesterNum]" :key="index" :class="getRowColor(course.status)">
                                    <td>{{ course.course_code }}</td>
                                    <td>{{ course.course_name }}</td>
                                    <td>{{ course.credits }}</td>
                                    <td>
                                        <div class="select is-small">
                                            <select v-model="course.status" @change="updateCourseStatus(course, semesterNum)">
                                                <option value="Scheduled">Scheduled</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Passed">Passed</option>
                                                <option value="Failed">Failed</option>
                                                <option value="Audit">Audit</option>
                                                <option value="Transfer">Transfer</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p v-else class="has-text-grey">No courses scheduled for this semester.</p>
                </div>
            </div>

            
            
            
            <!-- Add Course Modal -->
            <div class="modal" :class="{ 'is-active': isAddCourseModalActive }">
                <div class="modal-background" @click="isAddCourseModalActive = false"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Add Course</p>
                        <button class="delete" aria-label="close" @click="isAddCourseModalActive = false"></button>
                    </header>
                    <section class="modal-card-body">
                        <!-- Content -->
                        <div class="field">
                            <label class="label">Semester</label>
                            <div class="control is-expanded">
                                <div class="select">
                                    <select v-model="selectedSemester">
                                        <option value="" disabled selected>Select a semester</option>
                                        <option v-for="num in 8" :key="num" :value="num">Semester {{ num }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Class</label>
                            <div class="control is-expanded">
                                <div class="select">
                                    <select v-model="selectedCourse">
                                        <option value="" disabled selected>Select a class</option>
                                        <option v-for="core in coreCourses" :key="core.course_id" :value="core.course_id">
                                            {{ core.course.course_code }} - {{ core.course.course_name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" @click="addCourse">Add</button>
                        <button class="button ml-3" @click="isAddCourseModalActive = false">Cancel</button>
                    </footer>
                </div>
            </div>
            
        </div>
    `
}
