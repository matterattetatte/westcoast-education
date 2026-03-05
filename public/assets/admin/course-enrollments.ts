import { client, Enrollment, Profile } from '../../assets/db.js';


type EnrollmentWithStudent = Enrollment & { student: Profile }

async function loadEnrollments() {
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('id');
  const courseTitle = urlParams.get('title');
  
  if (!courseId) {
    document.getElementById('enrollments-grid')!.innerHTML = '<div class="error">Inget kurs-ID hittades</div>';
    return;
  }

  try {
    if (courseTitle) {
      document.getElementById('course-title')!.textContent = `Elever för: ${courseTitle}`;
    }

    const enrollments = (await client
      .from('enrollments')
      .select()
      .eq('course_id', courseId)) as EnrollmentWithStudent[]

    const students = await client
      .from('profiles')
      .select()
      .eq('role', 'student')

    
    enrollments.forEach((e) => {
        e.student = students.find(s => s.id === e.user_id) as Profile
    })

    renderEnrollments(enrollments);
  } catch (error) {
    console.error('Error loading enrollments:', error);
    document.getElementById('enrollments-grid')!.innerHTML = '<div class="error">Kunde inte ladda elever</div>';
  }
}

function renderEnrollments(enrollments: EnrollmentWithStudent[]) {
  const grid = document.getElementById('enrollments-grid')!;
  
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
