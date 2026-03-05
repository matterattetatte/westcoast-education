var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { extractFormData } from '../common.js';
import { client } from '../db.js';
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    const formatType = urlParams.get('type');
    if (!courseId) {
        document.body.innerHTML = '<div class="error-message">❌ Ingen kurs vald</div>';
    }
    if (!formatType) {
        document.body.innerHTML = '<div class="error-message">❌ Ingen typ vald</div>';
    }
    const [course] = yield client.from('courses').select().eq('id', courseId);
    function setTexts(updates) {
        Object.entries(updates).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (!el) {
                console.warn(`Element with id "${id}" not found`);
                return;
            }
            const text = value == null ? '' : String(value);
            if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
                el.value = text;
            }
            else {
                el.textContent = text;
            }
        });
    }
    function loadCourseAndUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Ladda kurs
                const userId = localStorage.getItem('userId');
                const enrollments = userId ? yield client.from('enrollments').select().eq('user_id', userId) : [];
                const alreadyEnrolled = enrollments.find((e) => e.course_id === courseId);
                if (alreadyEnrolled) {
                    alert('Redan inbokad!');
                    return window.history.back();
                }
                const courseFormat = formatType === 'classroom' ? 'Klassrum' : 'Distans';
                setTexts({
                    'course-title': `Boka: ${course.title}`,
                    'course-name': course.title,
                    'course-type': courseFormat,
                    'course-price': `${course.price || 0} kr`,
                    'course-format': courseFormat,
                });
                if (userId) {
                    const [profile] = yield client.from('profiles').select().eq('id', userId);
                    if (profile) {
                        setTexts({
                            'name': profile.full_name,
                            'email': profile.email,
                            'address': profile.billing_address,
                            'phone': profile.phone,
                        });
                    }
                }
            }
            catch (err) {
                console.error(err);
                document.querySelector('.section').innerHTML = '<div class="error-message">Kunde inte ladda kursdata 😅</div>';
            }
        });
    }
    function handleBooking(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const customer = extractFormData(e.target, {
                full_name: 'name',
                email: 'email',
                billing_address: 'address',
                phone: 'phone',
            });
            if (!customer.full_name || !customer.email || !customer.billing_address) {
                alert('Vänligen fyll i alla obligatoriska fält');
                return;
            }
            try {
                let userId = localStorage.getItem('userId') || '';
                if (userId) {
                    yield client.from('profiles').update(customer).eq('id', userId);
                }
                else {
                    const password = prompt('Please, provide password');
                    if (!password)
                        return;
                    let userId = '';
                    const [foundUser] = yield client.from('profiles').select().eq('email', customer.email);
                    if (!foundUser) {
                        userId = crypto.randomUUID();
                        yield client.from('profiles').insert(Object.assign(Object.assign({ id: userId }, customer), { password, role: 'student', created_at: new Date().toISOString() })).select();
                    }
                    else {
                        if (foundUser.password !== password) {
                            alert('Wrong password!');
                            return;
                        }
                        userId = foundUser.id;
                    }
                    localStorage.setItem('userId', userId);
                }
                const now = new Date().toISOString();
                const purchaseId = crypto.randomUUID();
                yield client.from('purchases').insert({
                    id: purchaseId,
                    course_id: courseId,
                    user_id: userId,
                    price_paid: course.price,
                    purchased_at: now
                }).select();
                const enrollmentId = crypto.randomUUID();
                yield client.from('enrollments').insert({
                    id: enrollmentId,
                    course_id: courseId,
                    user_id: userId,
                    type: formatType || '',
                    payment_status: 'paid',
                    enrolled_at: now
                }).select();
                alert(`Tack ${customer.full_name}! Din bokning är nu bekräftad.`);
                window.location.href = './courses.html?success=true';
            }
            catch (err) {
                console.error('Booking failed:', err);
                alert('Något gick fel vid bokningen. Försök igen eller kontakta support.');
            }
        });
    }
    document.getElementById('booking-form').addEventListener('submit', handleBooking);
    (_a = document.getElementById('back-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => history.back());
    loadCourseAndUser();
}))();
