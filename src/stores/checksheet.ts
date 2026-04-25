import { defineStore } from 'pinia';
import apiClient from '../http-common';

interface studentCourse {
    id : number;
    course_id: string;
    semester_id: string;
    status_id: number;
    grade: string | null;
}

export const useChecksheetStore = defineStore('checksheet', {
    state: () => ({

        studentCourses: [] as studentCourse[],
        error: null as Error | null
    }),

    // The possible actions for the studentcourses endpoint
    actions: {

        async fetchStudent(studentId: number) {
            try {
                const response = await apiClient.get(`/studentcourses/${studentId}`);
                this.studentCourses = response.data.studentCourses;
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        },

        async addCourse(payload: any) {
            try {
                await apiClient.post('/studentcourses', payload);
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        },

        async updateCourse(payload: any) {
            try {
                await apiClient.put('/studentcourses', payload);
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        },

        async deleteCourse(courseId: number) {
            try {
                await apiClient.delete(`/studentcourses/${courseId}`);
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        }
    }
})
