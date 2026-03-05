import { API_BASE } from "../db.js"
import { createCourse } from "./new-course.js"

const assert = (condition: boolean, message: string) => {
    if (!condition) {
        alert(message)
        throw new Error(message)
    }
}

(async () => {
    const coursesBefore = await fetch(`${API_BASE}/courses`).then((r) => r.json())

    const num = Math.random()
    const newCourseData =  {
      "id": crypto.randomUUID(),
      "title": `Ny kurs + ${num}`,
      "course_number": "HIHI-${num}",
      "description": "MY descr",
      "duration_days": 50,
      "start_date": "2028-03-04T13:09:31.558Z",
      "type": "online" as 'online', //ts workaround
      "price": 50,
      "image_url": "",
      "average_rating": 0,
      "rating_count": 0,
      "created_at": new Date().toISOString()
    }

    await createCourse(newCourseData)

    const coursesAfter = await fetch(`${API_BASE}/courses`).then((r) => r.json())

    assert(coursesAfter.length === coursesBefore.length + 1, "A new course should have been created")
    assert(JSON.stringify(coursesAfter.slice(-1)[0]) === JSON.stringify(newCourseData), "The new course should match the data we sent")

    alert('Test succeeded!')
})()
