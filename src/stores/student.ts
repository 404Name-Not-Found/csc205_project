// State manager for students
import { defineStore } from 'pinia';
import apiClient from '../http-common.js';

export const useStudentStore = defineStore('student', {
    state: () => ({
        students: [] as any[],
        error: null as string | null,
        activeStudent: JSON.parse(localStorage.getItem('active_student') || 'null') as any | null,
    }),

    actions: {
        setActiveStudent(student: any) {
            this.activeStudent = student;
            localStorage.setItem('active_student', JSON.stringify(student));
        },
        async fetchStudents() {
            try {
                const response = await apiClient.get('/students');
                this.students = response.data;
            }
            catch (error) {
                this.error = 'Failed to fetch students';
                console.error(error);
            }

        },

        async saveStudent(student: any) {
            try {
                await apiClient.put(`/students`, student);
            }
            catch (error) {
                this.error = 'Failed to save student';
                console.error(error);
                throw error;
            }
        },
    },
});