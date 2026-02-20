export default {
    name: 'ListView',
    template: `
        <div>
            <section class="section">
                <div class="box">
                    <table class="table is-fullwidth is-striped is-hoverable">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Credits</th>
                                <th>Category</th>
                                <th>Status / Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Fall 2023 -->
                            <tr class="has-background-success-light">
                                <td colspan="4"><strong>Fall 2023: Completed (17 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>SSC 101: Learning & Transition</td>
                                <td>1</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>COM 101: Principles of Comm.</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>BIB 112: Old Testament</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>SCS 110: Intro to Natural Science</td>
                                <td>4</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 133: Survey of Computer Science</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>MAT 105: Elem Statistical Methods</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>

                            <!-- Spring 2024 -->
                            <tr class="has-background-success-light">
                                <td colspan="4"><strong>Spring 2024: Completed (15 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>ENG 101: English Composition</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>BIB 113: New Testament</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>HUM 103: Invitation to Humanities</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>Society: Group A</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 101: Structured Programming</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>

                            <!-- Fall 2024 -->
                            <tr class="has-background-success-light">
                                <td colspan="4"><strong>Fall 2024: Completed (15 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>HUM 203: Making the West</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 102: Object-Oriented Programming</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 205: HCI Design & Programming</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 363: Database Systems</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>COM 350: Comm Design: Digital</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>

                            <!-- Spring 2025 -->
                            <tr class="has-background-success-light">
                                <td colspan="4"><strong>Spring 2025: Completed (16 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>Society: Group B or C</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 251: Networks & Security</td>
                                <td>4</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>MAT 130: Discrete Math</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 206: Web Programming</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>Electives</td>
                                <td>3</td>
                                <td><span class="tag">Elective</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>

                            <!-- Fall 2025 -->
                            <tr class="has-background-success-light">
                                <td colspan="4"><strong>Fall 2025: Completed (13 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>HUM 303: Perspectives: Faith...</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>PED 103: Physical Fitness</td>
                                <td>1</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>Cosmos: Cosmos Option</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 407: Web Engineering</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>
                            <tr>
                                <td>CSC 425: Op Sys & Architecture</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag">A</span></td>
                            </tr>

                            <!-- Spring 2026 -->
                            <tr class="has-background-warning-light">
                                <td colspan="4"><strong>Spring 2026: In Progress (15 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>BIB 300: Foundations of Chr Thought</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag is-warning">In Progress</span></td>
                            </tr>
                            <tr>
                                <td>CSC 203: Software Engineering</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-warning">In Progress</span></td>
                            </tr>
                            <tr>
                                <td>CSC 204: Algorithms</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-warning">In Progress</span></td>
                            </tr>
                            <tr>
                                <td>CSC 364: Front-End Development</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-warning">In Progress</span></td>
                            </tr>
                            <tr>
                                <td>CSC 408: Mobile & Cloud Applications</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-warning">In Progress</span></td>
                            </tr>

                            <!-- Fall 2026 -->
                            <tr class="has-background-info-light">
                                <td colspan="4"><strong>Fall 2026: Required (15 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>POL 352: Great Issues in Politics</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>Society: Group B</td>
                                <td>3</td>
                                <td><span class="tag">Core</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>CSC 483: Senior Software Project</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>Electives</td>
                                <td>3</td>
                                <td><span class="tag">Elective</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>Electives</td>
                                <td>3</td>
                                <td><span class="tag">Elective</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>

                            <!-- Spring 2027 -->
                            <tr class="has-background-info-light">
                                <td colspan="4"><strong>Spring 2027: Required (14 Credits)</strong></td>
                            </tr>
                            <tr>
                                <td>CSC 311: Cyber Ethics and Cyber Law</td>
                                <td>2</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>CSC 484: Senior Software Project</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>CSC 441: Project Management</td>
                                <td>3</td>
                                <td><span class="tag">Major</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>Electives</td>
                                <td>3</td>
                                <td><span class="tag">Elective</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                            <tr>
                                <td>Electives</td>
                                <td>3</td>
                                <td><span class="tag">Elective</span></td>
                                <td><span class="tag is-info">Required</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `
}
