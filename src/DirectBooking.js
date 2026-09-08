import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, ShieldCheck, CheckCircle2, 
  Share2, ArrowRight, Camera, User, Phone, Stethoscope, 
  Award, HeartHandshake, Check, AlertCircle, MessageCircle,
  Copy, X
} from 'lucide-react';

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const isPM = /مساء|م|عصرا|ليلا|pm/i.test(timeStr);
  const isAM = /صباحا|ص|am/i.test(timeStr);
  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const formatMinutesToTime = (totalMinutes) => {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours >= 12 ? 'مساءً' : 'صباحاً';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${formattedMinutes} ${period}`;
};

const generate15MinSlots = (availabilitySlot) => {
  if (!availabilitySlot) return [];
  const clean = availabilitySlot.replace(/[()]/g, '');
  const parts = clean.split(/إلى|الي|-|حتى|to/i);
  let startMin = null;
  let endMin = null;
  if (parts.length >= 2) {
    startMin = parseTimeToMinutes(parts[0]);
    endMin = parseTimeToMinutes(parts[1]);
  }
  if (startMin === null || endMin === null || endMin <= startMin) {
    startMin = 17 * 60;
    endMin = 19 * 60;
  }
  const slots = [];
  for (let current = startMin; current < endMin; current += 15) {
    slots.push(formatMinutesToTime(current));
  }
  return slots;
};

const getBookedSlotsForDoctor = (doctorId, date) => {
  try {
    const stored = localStorage.getItem(`booked_slots_${doctorId}_${date}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveBookedSlotForDoctor = (doctorId, date, timeSlot) => {
  try {
    const current = getBookedSlotsForDoctor(doctorId, date);
    if (!current.includes(timeSlot)) {
      current.push(timeSlot);
      localStorage.setItem(`booked_slots_${doctorId}_${date}`, JSON.stringify(current));
    }
  } catch (e) {
    console.warn('Could not save booked slot', e);
  }
};

export const DirectBooking = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [patientData, setPatientData] = useState({ name: '', mobile: '' });
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [bookedSlotsList, setBookedSlotsList] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // استخراج كود الطبيب من الرابط
  const params = useParams();
  const rawParam = params.doctorCode || params.slugOrId || params.seoSlug || 'ayman-aguib';
  const id = String(rawParam).split('-')[0] || rawParam;

  // جلب بيانات الطبيب
  useEffect(() => {
    if (id) {
      setLoading(true);
      const apiUrl = `https://clinic-api-ig3d.onrender.com/doctor-direct/${id}`;

      axios.get(apiUrl, { timeout: 8000 })
        .then(res => {
          if (res.data && (res.data.name || res.data.id)) {
            setDoctor(res.data);
          } else {
            setDoctor(getFallbackDoctor(id));
          }
          setLoading(false);
        })
        .catch(err => {
          console.warn('استخدام البيانات المرجعية:', err);
          setDoctor(getFallbackDoctor(id));
          setLoading(false);
        });
    }
  }, [id]);

  // 🌟 إذا فتح الزائر الرابط المختصر /d/:id في المتصفح يتم تحويله فوراً لرابط الـ SEO العربي الكامل
  useEffect(() => {
    if (doctor && location.pathname.startsWith('/d/')) {
      const docName = doctor.name || '';
      const docTitle = doctor.title ? `${doctor.title} ` : '';
      const docSpec = doctor.specialty || '';
      const docCity = doctor.city ? `-${doctor.city}` : '';
      const docArea = doctor.area ? `-${doctor.area}` : '';
      const rawText = `${docName}-${docTitle}${docSpec}${docCity}${docArea}`.trim();
      const cleanSlug = rawText
        .replace(/[\/\#\?\&\\\:\*\"\'\<\>\|\(\)\,\.]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      const targetUrl = cleanSlug ? `/dr/${doctor.id || id}-${encodeURIComponent(cleanSlug)}` : `/dr/${doctor.id || id}`;
      navigate(targetUrl, { replace: true });
    }
  }, [doctor, location.pathname, id, navigate]);

  const getNextDateForDay = (dayName) => {
    const days = { 'الأحد': 0, 'الاثنين': 1, 'الثلاثاء': 2, 'الأربعاء': 3, 'الخميس': 4, 'الجمعة': 5, 'السبت': 6 };
    const cleanDayName = dayName ? dayName.replace('،', '').trim() : 'الأحد';
    const targetDay = days[cleanDayName] !== undefined ? days[cleanDayName] : 0;
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    let diff = targetDay - currentDayOfWeek;
    if (diff < 0) diff += 7;
    const resultDate = new Date(now);
    resultDate.setDate(now.getDate() + diff);
    return resultDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (doctor && selectedDay) {
      const dayName = selectedDay.split(' ')[0];
      const actualDate = getNextDateForDay(dayName);
      const allSlots = generate15MinSlots(selectedDay);
      const booked = getBookedSlotsForDoctor(doctor.id || id, actualDate);
      setBookedSlotsList(booked);
      const freeSlots = allSlots.filter(slot => !booked.includes(slot));
      setAvailableTimeSlots(freeSlots);
      setSelectedTime('');
    } else {
      setAvailableTimeSlots([]);
      setBookedSlotsList([]);
      setSelectedTime('');
    }
  }, [doctor, selectedDay, id]);

  const handleConfirmBooking = async () => {
    if (!selectedDay) {
      alert('من فضلك اختر اليوم المناسب أولاً');
      return;
    }
    if (!selectedTime) {
      alert('من فضلك حدد ساعة الكشف المناسبة');
      return;
    }
    if (!patientData.name.trim() || !patientData.mobile.trim()) {
      alert('من فضلك أدخل اسم المريض ورقم الهاتف');
      return;
    }

    const dayName = selectedDay.split(' ')[0];
    const actualDate = getNextDateForDay(dayName);
    const fullSlotString = `${dayName} (${actualDate}) | الساعة: ${selectedTime}`;

    saveBookedSlotForDoctor(doctor.id || id, actualDate, selectedTime);

    const bookingData = {
      doctor_id: doctor.id || id,
      doctor_name: doctor.name,
      patient_name: patientData.name,
      mobile: patientData.mobile,
      appointment_date: actualDate,
      appointment_time: selectedTime,
      price: doctor.fee,
      status: 'pending'
    };

    setSubmitting(true);
    try {
      await axios.post('https://clinic-api-ig3d.onrender.com/book-appointment', bookingData, { timeout: 7000 });
    } catch (error) {
      console.warn('تم اعتماد الحجز:', error);
    } finally {
      setSelectedSlot(fullSlotString);
      setSubmitting(false);
      setShowModal(false);
      setShowTicket(true);
    }
  };

  // =========================================================
  // بيانات الـ SEO والسكيما المنظمة والروابط
  // =========================================================
  const doctorName = doctor?.name || 'الطبيب';
  const specialty = doctor?.specialty || 'استشاري متخصص';
  const titlePrefix = doctor?.title ? `${doctor.title} ` : 'طبيب استشاري ';
  const city = doctor?.city || '';
  const area = doctor?.area || '';
  const locationText = [area, city].filter(Boolean).join(' – ');

  const siteDomain = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://www.doctoreg.online';
  
  // 🌟 1. رابط المشاركة فائق الاختصار للتعليقات والسوشيال ميديا: /d/40
  const shortShareUrl = `${siteDomain}/d/${doctor?.id || id}`;

  // 🌟 2. رابط الـ SEO الكامل والمعتمد للـ Canonical وشريط المتصفح:
  const seoRawText = `${doctorName}-${titlePrefix}${specialty}${city ? `-${city}` : ''}${area ? `-${area}` : ''}`.trim();
  const seoSlug = seoRawText
    .replace(/[\/\#\?\&\\\:\*\"\'\<\>\|\(\)\,\.]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const canonicalSeoUrl = `${siteDomain}/dr/${doctor?.id || id}${seoSlug ? `-${encodeURIComponent(seoSlug)}` : ''}`;

  const doctorFeeText = doctor?.fee ? `${doctor.fee} ج.م` : 'محدد بالعيادة';

  // نص الرد المنسق للتعليق برابط المشاركة القصير
  const formattedShareMessage = 
`دكتور / ${doctorName}
${titlePrefix}${specialty}
📍 العيادة: ${locationText || 'مصر'} | سعر الكشف: ${doctorFeeText}
📅 للاطلاع على المواعيد المتاحة والحجز مباشرة من صفحته الرسمية:
${shortShareUrl}`;

  // نسخ رابط المشاركة القصير /d/40 للتعليقات
  const handleCopyCleanUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortShareUrl);
      setCopiedUrl(true);
      setToastMessage(`تم نسخ الرابط المختصر: /d/${doctor?.id || id} لتعليقات فيسبوك!`);
      setTimeout(() => setCopiedUrl(false), 3000);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleCopyFullCard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedShareMessage);
      setCopiedCard(true);
      setToastMessage('تم نسخ نص الرد بالكامل! جاهز للصق في التعليق.');
      setTimeout(() => setCopiedCard(false), 3000);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const pageTitle = locationText
    ? `دكتور. ${doctorName} | ${titlePrefix}${specialty} في ${locationText} | احجز الآن`
    : `دكتور. ${doctorName} | ${titlePrefix}${specialty} | احجز الآن`;

  const pageDescription = locationText
    ? `📍 العيادة: ${locationText} | 💰 سعر الكشف: ${doctorFeeText} | 📅 احجز موعدك الآن مباشرة عبر صفحة د. ${doctorName} الرسمية على منصة دكتور بدون وسيط.`
    : `💰 سعر الكشف: ${doctorFeeText} | 📅 احجز موعدك الآن مباشرة عبر صفحة د. ${doctorName} الرسمية على منصة دكتور بدون وسيط.`;

  const doctorPhoto = doctor?.image_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&h=630&auto=format&fit=crop&q=80';

  useEffect(() => {
    if (doctor) {
      document.title = pageTitle;

      const helperSetMeta = (propName, propVal, contentVal) => {
        let tag = document.querySelector(`meta[${propName}="${propVal}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute(propName, propVal);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', contentVal);
      };

      helperSetMeta('name', 'description', pageDescription);

      // 🌟 تثبيت رابط Canonical الكامل لمحركات البحث Google
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute('href', canonicalSeoUrl);

      // Open Graph Tags
      helperSetMeta('property', 'og:title', `دكتور. ${doctorName} | ${titlePrefix}${specialty}`);
      helperSetMeta('property', 'og:description', pageDescription);
      helperSetMeta('property', 'og:image', doctorPhoto);
      helperSetMeta('property', 'og:image:width', '1200');
      helperSetMeta('property', 'og:image:height', '630');
      helperSetMeta('property', 'og:url', canonicalSeoUrl);
      helperSetMeta('property', 'og:type', 'profile');
      helperSetMeta('property', 'og:site_name', 'منصة دكتور');

      // Twitter Cards
      helperSetMeta('name', 'twitter:card', 'summary_large_image');
      helperSetMeta('name', 'twitter:title', `دكتور. ${doctorName} | ${titlePrefix}${specialty}`);
      helperSetMeta('name', 'twitter:description', pageDescription);
      helperSetMeta('name', 'twitter:image', doctorPhoto);
    }
  }, [doctor, pageTitle, pageDescription, canonicalSeoUrl, doctorPhoto]);

  const slotsList = doctor?.availability
    ? doctor.availability.split(' - ').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl', textAlign: 'right', backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      {/* إشعار عائم عند نسخ الرابط */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, background: '#0f172a', color: '#fff', padding: '12px 22px',
          borderRadius: '16px', boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', fontWeight: 700
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* الهيدر العلوي */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1140px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#0f172a', fontWeight: 800, fontSize: '18px' }}>
            <Stethoscope size={22} color="#2563eb" />
            <span>منصة دكتور</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={handleCopyCleanUrl}
              style={{
                background: copiedUrl ? '#059669' : '#0f172a',
                color: '#fff', border: 'none', padding: '8px 16px',
                borderRadius: '12px', fontSize: '13px', fontWeight: 800,
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
              }}
            >
              {copiedUrl ? <Check size={15} /> : <Copy size={15} />}
              <span>{copiedUrl ? 'تم نسخ الرابط للتعليق!' : 'نسخ رابط الطبيب للتعليق'}</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              style={{
                background: '#fff', border: '1px solid #cbd5e1', padding: '8px 12px',
                borderRadius: '12px', fontSize: '12px', fontWeight: 700,
                color: '#334155', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}
            >
              <MessageCircle size={15} color="#2563eb" />
              <span>خيارات التعليق</span>
            </button>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main style={{ maxWidth: '1140px', margin: '24px auto', padding: '0 16px' }}>
        
        {/* بيانات الدكتور */}
        <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img 
              src={doctorPhoto} 
              alt={doctorName} 
              style={{ width: '120px', height: '120px', borderRadius: '20px', objectFit: 'cover', border: '3px solid #f1f5f9' }} 
            />
            <div>
              <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>د. {doctorName}</h1>
              <p style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 700, color: '#2563eb' }}>{titlePrefix}{specialty}</p>
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#64748b' }}>📍 {locationText || 'مصر'}</p>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '6px 14px', display: 'inline-block', fontSize: '14px', fontWeight: 800 }}>
                سعر الكشف: <span style={{ color: '#059669' }}>{doctor?.fee || '0'} ج.م</span>
              </div>
            </div>
          </div>

          {/* أزرار الحجز والنسخ المباشر */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                flex: '1 1 200px', background: '#0f172a', color: '#fff', border: 'none',
                padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 800, cursor: 'pointer'
              }}
            >
              احجز موعد كشف الآن
            </button>

            <button
              onClick={handleCopyCleanUrl}
              style={{
                flex: '1 1 200px', background: copiedUrl ? '#ecfdf5' : '#f8fafc',
                color: copiedUrl ? '#065f46' : '#0f172a', border: copiedUrl ? '1.5px solid #10b981' : '1.5px solid #cbd5e1',
                padding: '14px', borderRadius: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {copiedUrl ? <Check size={16} /> : <Copy size={16} />}
              <span>{copiedUrl ? 'تم نسخ الرابط للتعليق!' : 'نسخ رابط الطبيب للتعليق'}</span>
            </button>
          </div>
        </div>

      </main>

      {/* نافذة خيارات التعليق ومعاينة كارت فيسبوك */}
      {showShareModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', maxWidth: '500px', width: '100%', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>مشاركة الطبيب في تعليقات فيسبوك</h3>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* معاينة الكارت التلقائي لفيسبوك */}
            <div style={{ border: '1px solid #cbd5e1', borderRadius: '14px', overflow: 'hidden', marginBottom: '16px', background: '#f8fafc' }}>
              <img src={doctorPhoto} alt="" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>doctoreg.online</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>دكتور. {doctorName} | {titlePrefix}{specialty}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>📍 العيادة: {locationText || 'مصر'} • 💰 سعر الكشف: {doctorFeeText}</div>
              </div>
            </div>

            {/* حقل الرابط فائق الاختصار */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>رابط التعليقات فائق الاختصار (/d/):</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={shortShareUrl} 
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', direction: 'ltr', fontWeight: 'bold', color: '#2563eb' }} 
                />
                <button 
                  onClick={handleCopyCleanUrl}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  نسخ
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowShareModal(false)} 
              style={{ width: '100%', padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              إغلاق
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

function getFallbackDoctor(id) {
  return {
    id: id || 'ayman-aguib',
    name: 'ايمن عجيب - فرع اكتوبر',
    specialty: 'مخ وأعصاب',
    city: 'الجيزة',
    area: '6 أكتوبر',
    address: 'ميدان الحصري / فوق شعبان / الدور الرابع',
    fee: '600',
    image_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    availability: 'الأحد (5:00 مساءً إلى 7:00 مساءً) - الأربعاء (5:00 مساءً إلى 7:00 مساءً)',
  };
}

export default DirectBooking;