import { API_BASE } from "../db.js"

const assert = (condition: boolean, message: string) => {
    if (!condition) alert(message)
}

(async () => {
    const coursesBefore = await fetch(`${API_BASE}/courses`).then((r) => r.json())

    const newCourseData =  {
      "id": "550e8400-e29b-41d4-a716-336655440002",
      "title": "Ny kurs",
      "course_number": "HIHI101",
      "description": "Beskrivning",
      "duration_days": 50,
      "start_date": "2028-03-04T13:09:31.558Z",
      "type": "online",
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
})
