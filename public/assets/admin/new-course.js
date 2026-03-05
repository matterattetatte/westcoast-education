var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { extractFormData } from "../common.js";
import { client } from "../db.js";
// export only for test
export function createCourse(course) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.from('courses').insert(course).select();
    });
}
document.getElementById('new-course-form').addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const formData = extractFormData(e.target, {
        title: 'title',
        course_number: 'number',
        duration_days: 'days',
        price: 'price',
    });
    const course = Object.assign({ id: crypto.randomUUID(), created_at: new Date().toISOString(), average_rating: 0, description: '', image_url: '', rating_count: 0, type: '', start_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() }, formData);
    yield createCourse(course);
    window.location.href = `/admin/course-enrollments?id=${course.id}&title=${encodeURIComponent(course.title)}`;
}));
