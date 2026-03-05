var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { client } from '../../assets/db.js';
function loadCourses() {
    return __awaiter(this, void 0, void 0, function* () {
        const courses = yield client.from('courses').select().execute();
        renderCourses(courses);
    });
}
function renderCourses(courses) {
    const grid = document.getElementById('courses-grid');
    grid.innerHTML = courses.map(course => {
        return `
          <article class="course-card glass-card">
            <div class="course-body">
              <h3 class="course-title">${course.title}</h3>
              <a href="./course-enrollments?id=${course.id}&title=${course.title}" class="btn btn--primary btn--block">
                Se elever
              </a>
            </div>
          </article>
        `;
    }).join('');
}
loadCourses();
