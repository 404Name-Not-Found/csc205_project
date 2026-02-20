
import Semester from './semster.js';
import ListView from './list.js';

export default {
    name: 'Home',

    // For switching between the semster and list tab view
    components: {
        Semester,
        ListView
    },
    data() {
        return {
            activeTab: 'semester'
        }
    },

    template: `
        <section class="section">
            <div class="columns">

                <!-- Student information -->
                <div class="column is-3">
                    <div class="box student-info-card">
                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Name</p>
                        <p class="is-size-5 has-text-weight-bold mb-3">Ben Schuck</p>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Credits Earned</p>
                        <p class="is-size-5 has-text-weight-bold mb-1">90 / 120</p>
                        <progress class="progress is-small is-link mb-3" :value="90" max="120">75%</progress>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Current GPA</p>
                        <p class="is-size-5 has-text-weight-bold mb-3">3.8</p>

                        <p class="is-size-7 has-text-grey has-text-weight-semibold mb-1">Year [By Credits]</p>
                        <p class="is-size-5 has-text-weight-bold">Junior</p>
                    </div>
                </div>

                <!-- Tab system from Bulma website for semester or list view -->
                <div class="column">
                    <div class="tabs is-boxed">
                        <ul>
                            <li :class="{ 'is-active': activeTab === 'semester' }">
                                <a @click="activeTab = 'semester'">Semester View</a>
                            </li>
                            <li :class="{ 'is-active': activeTab === 'list' }">
                                <a @click="activeTab = 'list'">List View</a>
                            </li>
                        </ul>
                    </div>

                    <Semester v-if="activeTab === 'semester'" />
                    <ListView v-if="activeTab === 'list'" />

                </div>

            </div>
        </section>
    `
}
