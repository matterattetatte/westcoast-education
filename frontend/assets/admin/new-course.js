var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { client } from "../db.js";
// export only for test
export function createCourse(course) {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.from('courses').insert(course).select();
    });
}
document.getElementById('new-course-form').addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    e.preventDefault();
    debugger;
    const formData = new FormData(e.target);
    const course = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        average_rating: 0,
        description: '',
        image_url: '',
        rating_count: 0,
        type: '', //ts workaround
        start_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(), // +1 month from now
        title: (_a = formData.get('title')) === null || _a === void 0 ? void 0 : _a.trim(),
        course_number: (_b = formData.get('number')) === null || _b === void 0 ? void 0 : _b.trim(),
        duration_days: Number((_c = formData.get('days')) === null || _c === void 0 ? void 0 : _c.trim()),
        price: Number((_d = formData.get('cost')) === null || _d === void 0 ? void 0 : _d.trim()),
    };
    yield createCourse(course);
    window.history.back();
}));
