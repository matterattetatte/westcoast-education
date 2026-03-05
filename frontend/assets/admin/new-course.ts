import { client, Course } from "../db.js"


// export only for test
export async function createCourse(course: Course) {
    await client.from('courses').insert(course).select()
}


document.getElementById('new-course-form')!.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault()
    debugger

    const formData = new FormData(e.target as HTMLFormElement)
    const course = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      average_rating: 0,
      description: '',
      image_url: '',
      rating_count: 0,
      type: '' as '', //ts workaround
      start_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // +1 month from now


      title: (formData.get('title') as string)?.trim(),
      course_number: (formData.get('number') as string)?.trim(),
      duration_days: Number((formData.get('days') as string)?.trim()),
      price: Number((formData.get('cost') as string)?.trim()),
    }

    await createCourse(course)

    window.history.back()
})
