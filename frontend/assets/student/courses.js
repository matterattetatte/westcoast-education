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
import { createStars } from '../common.js';
let allCourses = [];
function loadCourses() {
    return __awaiter(this, void 0, void 0, function* () {
        const courses = yield client.from('courses').select().execute();
        const reviews = yield client.from('course_reviews').select().execute();
        allCourses = courses.map(course => {
            const courseReviews = reviews.filter(r => r.course_id === course.id);
            const reviewCount = courseReviews.length;
            const popularityScore = (course.rating_count || 0) * 0.6 + reviewCount * 0.4;
            return Object.assign(Object.assign({}, course), { popularityScore,
                reviewCount });
        });
        // Sort by popularity (highest first)
        allCourses.sort((a, b) => b.popularityScore - a.popularityScore);
        renderCourses(allCourses.slice(0, 10));
    });
}
function renderCourses(courses) {
    const grid = document.getElementById('courses-grid');
    const courseMapping = {
        classroom: 'Klassrum',
        online: 'Distans',
        '': '', //silence ts error
    };
    grid.innerHTML = courses.map(course => {
        var _a, _b;
        const rating = course.average_rating || 0;
        const typeLabel = courseMapping[course.type] || 'Både IRL och Online';
        return `
          <article class="course-card glass-card">
            <div class="course-media">
              <img 
                src="https://dummyimage.com/640x360/4f46e5/e0e7ff?text=${encodeURIComponent(course.title)}" 
                alt="${course.title}" 
                class="course-image" 
                loading="lazy"
              />
              <span class="course-type-badge">${typeLabel}</span>
            </div>

            <div class="course-body">
              <h3 class="course-title">${course.title}</h3>
              
              <div class="course-price">${course.price || 0} kr</div>

              <div class="course-meta">
                <div class="rating">
                  <div class="stars">${createStars(rating)}</div>
                </div>
              </div>

              <p class="course-description">
                ${((_a = course.description) === null || _a === void 0 ? void 0 : _a.substring(0, 120)) || ''}${Number((_b = course.description) === null || _b === void 0 ? void 0 : _b.length) > 120 ? '...' : ''}
              </p>

              <a href="./course-details.html?id=${course.id}" class="btn btn--primary btn--block">
                Boka Nu
              </a>
            </div>
          </article>
        `;
    }).join('');
}
loadCourses();
