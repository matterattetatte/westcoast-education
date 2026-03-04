import { client } from '../db.js'

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

  function setInputValue(id: string, value: string | undefined | null) {
    const el = document.getElementById(id);
    if (el instanceof HTMLInputElement) {
        el.value = value || '';
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

      // Uppdatera UI
      document.getElementById('course-title')!.textContent = `Boka: ${course.title}`
      document.getElementById('course-name')!.textContent = course.title
      document.getElementById('course-type')!.textContent = formatType === 'classroom' ? 'Klassrum' : 'Distans'
      document.getElementById('course-price')!.textContent = `${course.price || 0} kr`;
      (document.getElementById('course-format') as HTMLInputElement).value = formatType === 'classroom' ? 'Klassrum' : 'Distans'

      if (userId) {
        const [profile] = await client.from('profiles').select().eq('id', userId)
        if (profile) {
          setInputValue('customer-name',    profile.full_name);
          setInputValue('customer-email',   profile.email);
          setInputValue('customer-address', profile.billing_address);
          setInputValue('customer-phone',   profile.phone);
        }
      }

    } catch (err) {
      console.error(err)
      document.querySelector('.section')!.innerHTML = '<div class="error-message">Kunde inte ladda kursdata 😅</div>'
    }
  }

  async function handleBooking(e: SubmitEvent) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const customer = {
      full_name: (formData.get('name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim(),
      billing_address: (formData.get('address') as string)?.trim(),
      phone: (formData.get('phone') as string)?.trim() || null,
    }

    if (!customer.full_name || !customer.email || !customer.billing_address) {
      alert('Vänligen fyll i alla obligatoriska fält')
      return
    }

    try {
      let userId = localStorage.getItem('userId') || ''

      // Uppdatera eller skapa profil
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
      // Skapa köp & enrollment
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

  // Event listeners
  document.getElementById('booking-form')!.addEventListener('submit', handleBooking)
  document.getElementById('back-btn')?.addEventListener('click', () => history.back())

  // Start
  loadCourseAndUser()

})()