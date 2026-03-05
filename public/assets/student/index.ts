import { client, CourseReviews } from '../db.js'

async function loadReviews() {
    try {
        const reviews = await client.from('course_reviews').select().execute()

        const topReviews = (reviews).slice(0, 3)

        renderFeatured(topReviews)
    } catch (error) {
        console.error('Error:', error)
        document.querySelectorAll('.loading').forEach(el => {
            el.textContent = 'Kunde inte ladda data 😅'
        })
    }
}

function renderFeatured(reviews: CourseReviews[]) {
    const container = document.getElementById('featured-reviews');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = '<div class="loading">Inga recensioner än...</div>';
        return;
    }

    container.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="stars">
                ${[...Array(5)].map((_, i) => `
                    <svg class="star" viewBox="0 0 20 20" fill="${i < (review.rating || 0) ? '#fbbf24' : '#e2e8f0'}">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                `).join('')}
            </div>
            <p class="review-text">"${review.review_text?.trim() || 'Fantastisk kurs!'}"</p>
            <div>Elev</div>
        </div>
    `).join('');
}

loadReviews()
