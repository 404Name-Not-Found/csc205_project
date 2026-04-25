import { defineStore } from 'pinia';
import apiClient from '../http-common';

interface Major {
    id: number;
    name: string;
}
interface Minor {
    id: number;
    name: string;
}
interface Core {
    id: number;
    name: string;
}
interface Course {
    id: number;
    course_id: string;
    name: string;
    credits: number;
}

export const useCatalogStore = defineStore('catalog', {
    state: () => ({
        majors: [] as Major[],
        minors: [] as Minor[],
        cores: [] as Core[],
        courses: [] as Course[],
        error: null as Error | null
    }),

    actions: {
        async fetchMajors() {
            try {
                const response = await apiClient.get('/majors');
                this.majors = response.data;
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        },

        async fetchMinors() {
            try {
                const response = await apiClient.get('/minors');
                this.minors = response.data;
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        },

        async fetchCore() {
            try {
                const response = await apiClient.get('/course/core');
                this.cores = response.data;
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        },

        async fetchCourses() {
            try {
                const response = await apiClient.get('/courses');
                this.courses = response.data;
            } catch (err) {
                this.error = err instanceof Error ? err : new Error(String(err));
            }
        }
    }
})