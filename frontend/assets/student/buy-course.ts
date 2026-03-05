import { extractFormData } from '../common.js'
import { client, Profile } from '../db.js'

(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const courseId = urlParams.get('id')
  const formatType = urlParams.get('type') as 'classroom' | 'online'

  if (!courseId) {
    document.body.innerHTML = '<div class="error-message">❌ Ingen kurs vald</div>'
  }

  if (!formatType) {
    document.body.innerHTML = '<div class="error-message">❌ Ingen typ vald</div>'
  }

  const [course] = await client.from('courses').select().eq('id', courseId as string)

  function setText(id: string, value: string | number | undefined | null) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`Element with id "${id}" not found`);
      return;
    }

    const text = value == null ? '' : String(value);

    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = text;
    } else {
      el.textContent = text;
    }
  }

  async function loadCourseAndUser() {
    try {
      // Ladda kurs
      const userId = localStorage.getItem('userId')
      const enrollments = userId ? await client.from('enrollments').select().eq('user_id', userId) : []
      const alreadyEnrolled = enrollments.find((e) => e.course_id === courseId)
      if (alreadyEnrolled) {
        alert('Redan inbokad!')
        return window.history.back()
      }

      setText('course-title', `Boka: ${course.title}`);
      setText('course-name',   course.title);
      setText('course-type',   formatType === 'classroom' ? 'Klassrum' : 'Distans');
      setText('course-price',  `${course.price || 0} kr`);

      setText('course-format', formatType === 'classroom' ? 'Klassrum' : 'Distans')

      if (userId) {
        const [profile] = await client.from('profiles').select().eq('id', userId)
        if (profile) {
          setText('name',    profile.full_name);
          setText('email',   profile.email);
          setText('address', profile.billing_address);
          setText('phone',   profile.phone);
        }
      }

    } catch (err) {
      console.error(err)
      document.querySelector('.section')!.innerHTML = '<div class="error-message">Kunde inte ladda kursdata 😅</div>'
    }
  }

  async function handleBooking(e: SubmitEvent) {
    e.preventDefault()
      
    const customer = extractFormData(e.target as HTMLFormElement, {
      full_name: 'name',
      email: 'email', 
      billing_address: 'address',
      phone: 'phone',
    }) as Omit<Profile, 'id'>

    if (!customer.full_name || !customer.email || !customer.billing_address) {
      alert('Vänligen fyll i alla obligatoriska fält')
      return
    }

    try {
      let userId = localStorage.getItem('userId') || ''

      if (userId) {
        await client.from('profiles').update(customer).eq('id', userId)
      } else {
        const password = prompt('Please, provide password')
        if (!password) return

        let userId = ''
        const [foundUser] = await client.from('profiles').select().eq('email', customer.email)

        if (!foundUser) {
          userId = crypto.randomUUID()

          await client.from('profiles').insert({
            id: userId,
            ...customer,
            password,
            role: 'student',
            created_at: new Date().toISOString()
          }).select()
        } else {
          if (foundUser.password !== password) {
            alert('Wrong password!')
            return
          }
          userId = foundUser.id
        }

        localStorage.setItem('userId', userId)
      }

      const now = new Date().toISOString()

      const purchaseId = crypto.randomUUID()
      await client.from('purchases').insert({
        id: purchaseId,
        course_id: courseId,
        user_id: userId,
        price_paid: course.price,
        purchased_at: now
      }).select()

      const enrollmentId = crypto.randomUUID()
      await client.from('enrollments').insert({
        id: enrollmentId,
        course_id: courseId,
        user_id: userId,
        type: formatType || '',
        payment_status: 'paid',           // TODO: egentligen efter betalning
        purchased_at: now
      }).select()

      alert(`Tack ${customer.full_name}! Din bokning är nu bekräftad.`)
      window.location.href = './courses.html?success=true'

    } catch (err) {
      console.error('Booking failed:', err)
      alert('Något gick fel vid bokningen. Försök igen eller kontakta support.')
    }
  }

  document.getElementById('booking-form')!.addEventListener('submit', handleBooking)
  document.getElementById('back-btn')?.addEventListener('click', () => history.back())

  loadCourseAndUser()

})()