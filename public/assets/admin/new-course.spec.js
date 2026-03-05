var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { API_BASE } from "../db.js";
import { createCourse } from "./new-course.js";
const assert = (condition, message) => {
    if (!condition) {
        alert(message);
        throw new Error(message);
    }
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const coursesBefore = yield fetch(`${API_BASE}/courses`).then((r) => r.json());
    const newCourseData = {
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
    };
    yield createCourse(newCourseData);
    const coursesAfter = yield fetch(`${API_BASE}/courses`).then((r) => r.json());
    assert(coursesAfter.length === coursesBefore.length + 1, "A new course should have been created");
    assert(JSON.stringify(coursesAfter.slice(-1)[0]) === JSON.stringify(newCourseData), "The new course should match the data we sent");
    alert('Test succeeded!');
}))();
