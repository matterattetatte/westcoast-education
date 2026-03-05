import { client, Course } from '../../assets/db.js';

async function loadCourses() {
    const courses = await client.from('courses').select().execute();

    renderCourses(courses);
}

function renderCourses(courses: Course[]) {
    const grid = document.getElementById('courses-grid')!

    grid.innerHTML = courses.map(course => {
        return `
          <article class="course-card glass-card">
            <div class="course-body">
              <h3 class="course-title">${course.title}</h3>
              <a href="./course-enrollments?id=${course.id}&title=${encodeURIComponent(course.title)}" class="btn btn--primary btn--block">
                Se elever
              </a>
            </div>
          </article>
        `;
    }).join('');
}

loadCourses();