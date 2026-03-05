import { client, Course } from "../db.js"


// export only for test
export async function createCourse(course: Course) {
    await client.from('courses').insert(course).select()
}