import { createStars } from '../common.js'
import { client, Course, CourseReviews } from '../db.js'

const urlParams = new URLSearchParams(window.location.search)
const courseId = urlParams.get('id')

if (!courseId) {
  document.querySelector('.loading')!.innerHTML = '❌ Ingen kurs vald'
}

async function loadCourseDetails() {
  try {
    const courses = await client.from('courses').select().execute()
    const reviews = await client.from('course_reviews').select().execute()

    const course = courses?.find(c => c.id === courseId)
    if (!course) {
      document.querySelector('.loading')!.innerHTML = '❌ Kurs hittades inte'
      return
    }

    const courseReviews = reviews?.filter(r => r.course_id === courseId) ?? []
    const avgRating = course.average_rating || 
      (courseReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / Math.max(courseReviews.length, 1)) || 0

    document.getElementById('course-title')!.textContent = course.title
    renderCourseDetails(course, courseReviews, avgRating)

  } catch (error) {
    console.error('Error:', error)
    document.querySelector('.loading')!.textContent = 'Kunde inte ladda kurs 😅'
  }
}

function renderCourseDetails(course: Course, reviews: CourseReviews[], avgRating: number) {
  const container = document.getElementById('course-detail')!
  const typeLabel = course.type === 'classroom' ? 'Klassrum' :
                    course.type === 'online'    ? 'Distans'    : 'Både IRL och Online'

  const classroomButton = course.type === 'classroom' || course.type === undefined || !course.type ? 
      `<a href="./buy-course?id=${course.id}&type=classroom" class="btn btn--primary btn--block">
        🏫 Boka Klassrum
      </a>` : '';

  const onlineButton = course.type === 'online' || course.type === undefined || !course.type ? 
    `<a href="./buy-course?id=${course.id}&type=online" class="btn btn--primary btn--block">
      💻 Boka Distans
    </a>` : '';

  container.innerHTML = `
    <article class="course-detail-card glass-card">

      <div class="course-media">
        <img 
          src="${course.image_url || `https://dummyimage.com/800x500/4f46e5/e0e7ff?text=${encodeURIComponent(course.title)}`}" 
          alt="${course.title}" 
          class="course-image"
        />
        <div class="course-type-badge">${typeLabel}</div>
      </div>

      <div class="course-body">

        <div class="course-header">
          <h1 class="course-title">${course.title}</h1>
          <div class="course-meta">
            <div class="rating">
              <div class="stars">${createStars(avgRating)}</div>
              <span class="rating-text">${avgRating.toFixed(1)} (${course.rating_count})</span>
            </div>
            <div class="duration">${course.duration_days || '?'} dagar</div>
            </div>
            <div class="duration">
              Start ${course.start_date 
                ? new Date(course.start_date).toLocaleDateString('sv-SE') 
                : 'Ej satt'}
            </div>
        </div>

        <div class="course-price">${course.price || 0} kr</div>

        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Kursnummer</span>
            <span class="detail-value">${course.course_number || '–'}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Typ</span>
            <span class="detail-value">${typeLabel}</span>
          </div>
        </div>

        <div class="booking-section">
          ${classroomButton}
          ${onlineButton}
        </div>

        <div class="course-description">
          <h3>Om kursen</h3>
          <p>${course.description || 'Ingen beskrivning tillgänglig.'}</p>
        </div>

        ${reviews.length ? `
          <div class="reviews-section">
            <h3>Recensioner (${reviews.length})</h3>
            <div class="reviews-list">
              ${reviews.slice(0, 5).map(r => `
                <div class="review-item">
                  <div class="rating">
                    <div class="stars">${createStars(r.rating || 0)}</div>
                  </div>
                  <p class="review-text">${r.review_text || 'Ingen kommentar'}</p>
                  <small class="review-date">${new Date(r.created_at).toLocaleDateString('sv-SE')}</small>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </article>
  `
}

loadCourseDetails()