import { client, Course } from '../../assets/db.js';
import { createStars } from '../common.js';

let allCourses = [];

async function loadCourses() {
    const courses = await client.from('courses').select().execute();
    const reviews = await client.from('course_reviews').select().execute();

    allCourses = courses.map(course => {
        const courseReviews = reviews.filter(r => r.course_id === course.id);
        const reviewCount = courseReviews.length;
        const popularityScore = (course.rating_count || 0) * 0.6 + reviewCount * 0.4;

        return {
            ...course,
            popularityScore,
            reviewCount,
        };
    });

    // Sort by popularity (highest first)
    allCourses.sort((a, b) => b.popularityScore - a.popularityScore);

    renderCourses(allCourses.slice(0, 10));
}

function renderCourses(courses: Course[]) {
    const grid = document.getElementById('courses-grid')!

    const courseMapping = {
        classroom: 'Klassrum',
        online: 'Distans',
        '': '', //silence ts error
    };

    grid.innerHTML = courses.map(course => {
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
                ${course.description?.substring(0, 120) || ''}${Number(course.description?.length) > 120 ? '...' : ''}
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