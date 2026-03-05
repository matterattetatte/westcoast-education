var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { client } from '../../assets/db.js';
function loadEnrollments() {
    return __awaiter(this, void 0, void 0, function* () {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id');
        const courseTitle = urlParams.get('title');
        if (!courseId) {
            document.getElementById('enrollments-grid').innerHTML = '<div class="error">Inget kurs-ID hittades</div>';
            return;
        }
        try {
            if (courseTitle) {
                document.getElementById('course-title').textContent = `Elever för: ${courseTitle}`;
            }
            const enrollments = (yield client
                .from('enrollments')
                .select()
                .eq('course_id', courseId));
            const students = yield client
                .from('profiles')
                .select()
                .eq('role', 'student');
            enrollments.forEach((e) => {
                e.student = students.find(s => s.id === e.user_id);
            });
            renderEnrollments(enrollments);
        }
        catch (error) {
            console.error('Error loading enrollments:', error);
            document.getElementById('enrollments-grid').innerHTML = '<div class="error">Kunde inte ladda elever</div>';
        }
    });
}
function renderEnrollments(enrollments) {
    const grid = document.getElementById('enrollments-grid');
    grid.innerHTML = enrollments.map(enrollment => {
        return `
      <article class="course-card glass-card">
        <div class="course-body">
          <h3 class="course-title">${enrollment.student.full_name}</h3>
          <p class="course-meta">${enrollment.student.email}</p>
          <p class="course-meta">Anmäld: ${enrollment.enrolled_at && new Date(enrollment.enrolled_at).toLocaleDateString('sv-SE')}</p>
        </div>
      </article>
    `;
    }).join('') || '<div class="empty-state">Inga elever har anmält sig än</div>';
}
loadEnrollments();
