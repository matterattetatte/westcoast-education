import { extractFormData } from "../common.js"
import { client, Course } from "../db.js"


// export only for test
export async function createCourse(course: Course) {
    await client.from('courses').insert(course).select()
}


document.getElementById('new-course-form')?.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault()

    const formData = extractFormData(e.target as HTMLFormElement, {
      title: 'title',
      course_number: 'number',
      duration_days: 'days',
      price: 'price',
    })

    const course = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      average_rating: 0,
      description: '',
      image_url: '',
      rating_count: 0,
      type: '' as '', //ts workaround
      start_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // +1 month from now
      ...formData,
    }

    await createCourse(course)

    window.location.href = `/admin/course-enrollments?id=${course.id}&title=${encodeURIComponent(course.title)}`;
})
