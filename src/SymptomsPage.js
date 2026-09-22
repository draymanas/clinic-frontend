// src/SymptomsPage.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
const API_URL = 'https://clinic-api-ig3d.onrender.com';

function SymptomsPage() {

  const navigate = useNavigate();

    // ==========================================
  // 🔎 SEO للصفحة
  // ==========================================

  const seoTitle =
    'استشارات طبية مجانية  وتوجيه للتخصص المناسب | منصة دكتور';

  const seoDescription =
    'احكي عن الأعراض التي تشعر بها واستفسر من منصة دكتور مجانا تمامًا، وتعرف على التخصص الطبي المناسب لك وأطباء التخصص المتاحين للحجز في مصر واقرب دكتور لك و احجز معاه مباشرة بشكل مجاني.';

  const canonicalUrl =
    'https://www.doctoreg.online/symptoms';

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: seoTitle,
        description: seoDescription,
        inLanguage: 'ar-EG',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.doctoreg.online/#website',
          url: 'https://www.doctoreg.online/',
          name: 'منصة دكتور'
        }
      },

      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        url: canonicalUrl,
        name: 'الاستشارات الطبية وأسئلة المرضى',
        description:
          'أسئلة واستفسارات طبية و استشارات طبية مجانيه منشورة مع توجيه إلى التخصص الطبي والطبيب المناسب.',
        inLanguage: 'ar-EG'
      },

      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'الرئيسية',
            item: 'https://www.doctoreg.online/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'استشارات طبية',
            item: canonicalUrl
          }
        ]
      }
    ]
  };
  // ==========================================
  // بيانات نموذج الاستفسار
  // ==========================================

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');

  const [sending, setSending] = useState(false);
  const [sendMessage, setSendMessage] = useState('');

  // ==========================================
  // الاستفسارات المنشورة
  // ==========================================

  const [consultations, setConsultations] = useState([]);
  const [loadingConsultations, setLoadingConsultations] = useState(true);

  // ==========================================
  // جلب الاستفسارات المنشورة
  // ==========================================

  const fetchConsultations = async () => {

    try {

      setLoadingConsultations(true);

      const response = await fetch(
        `${API_URL}/api/consultations/answered`
      );

      if (!response.ok) {
        throw new Error('فشل تحميل الاستفسارات');
      }

      const data = await response.json();

      setConsultations(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error(
        '❌ خطأ في جلب الاستفسارات:',
        error
      );

      setConsultations([]);

    } finally {

      setLoadingConsultations(false);

    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // ==========================================
  // إرسال الاستفسار
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSendMessage('');

    if (!question.trim()) {

      setSendMessage(
        'من فضلك اكتب الأعراض أو الاستفسار أولاً.'
      );

      return;
    }

    try {

      setSending(true);

      const response = await fetch(
        `${API_URL}/api/consultations`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            question: question.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
          'حدث خطأ أثناء إرسال الاستفسار'
        );
      }

      // ------------------------------------------
      // نجاح الإرسال
      // ------------------------------------------

      setSendMessage(
        '✅ تم استلام استفسارك بنجاح. سيتم مراجعته من فريق منصة دكتور.'
      );

      setName('');
      setPhone('');
      setQuestion('');

    } catch (error) {

      console.error(
        '❌ خطأ إرسال الاستفسار:',
        error
      );

      setSendMessage(
        error.message ||
        'حدث خطأ أثناء إرسال الاستفسار، حاول مرة أخرى.'
      );

    } finally {

      setSending(false);

    }
  };

  // ==========================================
  // فتح صفحة التخصص
  // ==========================================

  const handleSpecialty = (specialty) => {

    if (!specialty) return;

    navigate(
      `/search?specialty=${encodeURIComponent(specialty)}`
    );
  };

  // ==========================================
  // فتح صفحة الطبيب
  // ==========================================

  const handleDoctor = (doctorId) => {

    if (!doctorId) return;

    navigate(`/dr/${doctorId}`);
  };
  const [copiedUrl, setCopiedUrl] = useState(false);

  // الرابط المختصر الفائق الجمال للسوشيال ميديا
  const shortShareUrl = 'https://www.doctoreg.online/s/symptoms';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortShareUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  // ==========================================
  // واجهة الصفحة
  // ==========================================

return (

    <>
      <Helmet>

        <title>
          استشارات طبية وتوجيه للتخصص المناسب | منصة دكتور
        </title>

        <meta
          name="description"
          content="احكي عن الأعراض التي تشعر بها واستفسر من منصة دكتور، وتعرف على التخصص الطبي المناسب لك وأطباء التخصص المتاحين للحجز في مصر."
        />

        <meta
          name="robots"
          content="index,follow,max-image-preview:large"
        />

        <link
          rel="canonical"
          href="https://www.doctoreg.online/symptoms"
        />

        {/* Open Graph */}

        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content="استشارات طبية وتوجيه للتخصص المناسب | منصة دكتور"
        />

        <meta
          property="og:description"
          content="احكي عن أعراضك وتعرف على التخصص الطبي المناسب وأطباء التخصص المتاحين للحجز."
        />

        <meta
          property="og:url"
          content="https://www.doctoreg.online/symptoms"
        />

        <meta
          property="og:site_name"
          content="منصة دكتور"
        />

        <meta
          property="og:locale"
          content="ar_EG"
        />

        <meta
          property="og:image"
          content="https://www.doctoreg.online/logo512.webp"
        />

        {/* Twitter */}

        <meta
          name="twitter:card"
          content="summary_large_image"
        />

        <meta
          name="twitter:title"
          content="استشارات طبية وتوجيه للتخصص المناسب | منصة دكتور"
        />

        <meta
          name="twitter:description"
          content="احكي عن أعراضك وتعرف على التخصص الطبي المناسب وأطباء التخصص المتاحين للحجز."
        />

        <meta
          name="twitter:image"
          content="https://www.doctoreg.online/logo512.webp"
        />

        {/* Structured Data */}

        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

      </Helmet>


      <div
        dir="rtl"
      style={{
        minHeight: '100vh',
        background: '#f1f5f9',
        fontFamily: 'Cairo, sans-serif',
        paddingBottom: '60px'
      }}
    >

      {/* ======================================
          Header
      ====================================== */}

      <div
        style={{
          background:
            'linear-gradient(135deg, #0284c7, #0369a1)',
          color: '#fff',
          padding: '45px 20px',
          textAlign: 'center'
        }}
      >

        <div
          style={{
            fontSize: '48px',
            marginBottom: '10px'
          }}
        >
          🩺
        </div>

        <h1
          style={{
            margin: '0 0 12px',
            fontSize: '30px',
            fontWeight: '800'
          }}
        >
           استشارات طبية: احكي لنا عن أعراضك واعرف التخصص المناسب
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: '17px',
            lineHeight: '1.9',
            maxWidth: '700px',
            marginInline: 'auto',
            opacity: 0.95
          }}
        >
          لو مش عارف هتروح لأي دكتور؟
          <br />
          اكتب الأعراض التي تشعر بها و عرفنا المحافظه والمدينه بتاعتك و احنا هنساعدك  
          في الوصول إلى التخصص المناسب. وهنرشحلك أفضل دكتور 
        </p>
      

        {/* 🌟 زر مشاركة الصفحة على السوشيال ميديا 🌟 */}
        <div style={{ marginTop: '22px' }}>
          <button
            type="button"
            onClick={handleShare}
            style={{
              background: copiedUrl ? '#10b981' : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '30px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              if (!copiedUrl) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              if (!copiedUrl) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <span style={{ fontSize: '18px' }}>{copiedUrl ? '✅' : '🔗'}</span>
            <span>{copiedUrl ? 'تم نسخ رابط المشاركة!' : 'مشاركة الاستشارات الطبية'}</span>
          </button>
        </div>

      </div> 

    


      {/* ======================================
          المحتوى الرئيسي
      ====================================== */}

      <main
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '25px 15px'
        }}
      >

        {/* ====================================
            نموذج إرسال الاستفسار
        ==================================== */}

        <section
          style={{
            background: '#fff',
            borderRadius: '22px',
            padding: '28px',
            boxShadow:
              '0 8px 30px rgba(15,23,42,0.08)',
            border:
              '1px solid #e2e8f0',
            marginBottom: '35px'
          }}
        >

          <h2
            style={{
              marginTop: 0,
              color: '#0f172a',
              fontSize: '23px',
              fontWeight: '800'
            }}
          >
            🔍 اكتب أعراضك بالتفصيل
          </h2>

          <p
            style={{
              color: '#64748b',
              lineHeight: '1.8',
              marginBottom: '22px'
            }}
          >
            كلما شرحت الأعراض بصورة أوضح، أصبح من الأسهل
            على فريق منصة دكتور توجيهك إلى التخصص المناسب.
          </p>

{/* الاسم */}

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              fontWeight: '700',
              color: '#334155'
            }}
          >
            الاسم
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اكتب اسمك"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '13px 14px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '15px',
              marginBottom: '18px',
              outline: 'none'
            }}
          />


          {/* رقم الهاتف */}

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              fontWeight: '700',
              color: '#334155'
            }}
          >
            رقم الهاتف
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="مثال: 01012345678"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '13px 14px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              fontSize: '15px',
              marginBottom: '18px',
              outline: 'none'
            }}
          />


          {/* الأعراض */}

          <label
            style={{
              display: 'block',
              marginBottom: '7px',
              fontWeight: '700',
              color: '#334155'
            }}
          >
            الأعراض أو الاستفسار
            <span
              style={{
                color: '#dc2626'
              }}
            >
              {' '}*
            </span>
          </label>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              'مثال: عندي ألم أسفل الظهر منذ شهرين، والألم نازل في الرجل اليمنى مع تنميل في القدم...'
            }
            rows={7}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '15px',
              borderRadius: '14px',
              border: '1px solid #cbd5e1',
              fontSize: '16px',
              lineHeight: '1.9',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '18px'
            }}
          />


          {/* رسالة النجاح / الخطأ */}

          {sendMessage && (

            <div
              style={{
                background:
                  sendMessage.startsWith('✅')
                    ? '#ecfdf5'
                    : '#fef2f2',

                color:
                  sendMessage.startsWith('✅')
                    ? '#047857'
                    : '#b91c1c',

                border:
                  `1px solid ${
                    sendMessage.startsWith('✅')
                      ? '#a7f3d0'
                      : '#fecaca'
                  }`,

                padding: '13px 15px',
                borderRadius: '12px',
                marginBottom: '18px',
                lineHeight: '1.7',
                fontWeight: '600'
              }}
            >
              {sendMessage}
            </div>

          )}


          {/* زر الإرسال */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={sending}
            style={{
              width: '100%',
              padding: '15px',
              background:
                sending
                  ? '#94a3b8'
                  : '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '13px',
              fontSize: '17px',
              fontWeight: '800',
              cursor:
                sending
                  ? 'not-allowed'
                  : 'pointer',
              boxShadow:
                '0 5px 15px rgba(2,132,199,0.25)'
            }}
          >
            {sending
              ? '⏳ جاري إرسال الاستفسار...'
              : '🔵 إرسال الاستفسار'}
          </button>

          <p
            style={{
              fontSize: '12.5px',
              color: '#94a3b8',
              textAlign: 'center',
              margin:
                '13px 0 0'
            }}
          >
            هذه الخدمة تساعدك في الوصول إلى التخصص المناسب،
            ولا تُغني عن الكشف الطبي المباشر عند الحاجة.
          </p>

        </section>

{/* ====================================
    فقرة تعريفية لمحركات البحث
==================================== */}

<section
  style={{
    background: '#ffffff',
    borderRadius: '20px',
    padding: '25px',
    marginBottom: '35px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 5px 20px rgba(15,23,42,0.04)'
  }}
>

  <h2
    style={{
      margin: '0 0 12px',
      color: '#0f172a',
      fontSize: '22px',
      fontWeight: '800'
    }}
  >
    كيف تساعدك الاستشارات الطبية في منصة دكتور؟
  </h2>

  <p
    style={{
      margin: 0,
      color: '#475569',
      lineHeight: '2',
      fontSize: '15px'
    }}
  >
    إذا كنت تعاني من أعراض معينة ولا تعرف التخصص الطبي المناسب،
    يمكنك كتابة الأعراض التي تشعر بها من خلال منصة دكتور.
    تتم مراجعة الاستفسارات وإضافة التوجيه المناسب إلى التخصص الطبي،
    ويمكنك بعد ذلك استكشاف الأطباء المتاحين في هذا التخصص والوصول
    إلى صفحة الطبيب لإتمام الحجز.
  </p>

  <p
    style={{
      margin: '12px 0 0',
      color: '#475569',
      lineHeight: '2',
      fontSize: '15px'
    }}
  >
    كما يمكنك الاطلاع على أسئلة المرضى السابقة والإجابات المنشورة
    للاستفادة من المعلومات والتوجيهات العامة المتعلقة بمختلف
    الأعراض والتخصصات الطبية.
  </p>

</section>

        {/* ====================================
            الأسئلة والإجابات السابقة
        ==================================== */}

        <section>

          <div
            style={{
              textAlign: 'center',
              marginBottom: '25px'
            }}
          >

            <h2
              style={{
                color: '#0f172a',
                fontSize: '25px',
                margin: '0 0 8px',
                fontWeight: '800'
              }}
            >
              💬 أسئلة المرضى السابقة وإجابات منصة دكتور
            </h2>

            <p
              style={{
                color: '#215092',
                margin: 0
              }}
            >
              استكشف الأسئلة والإجابات السابقة واستفد منها.
            </p>

          </div>


          {/* Loading */}

          {loadingConsultations && (

            <div
              style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '35px',
                textAlign: 'center',
                color: '#64748b'
              }}
            >
              ⏳ جاري تحميل الأسئلة...
            </div>

          )}


          {/* لا توجد أسئلة */}

          {!loadingConsultations &&
            consultations.length === 0 && (

              <div
                style={{
                  background: '#fff',
                  borderRadius: '18px',
                  padding: '35px',
                  textAlign: 'center',
                  color: '#64748b',
                  border:
                    '1px solid #e2e8f0'
                }}
              >
                لا توجد أسئلة منشورة حتى الآن.
                <br />
                كن أول من يرسل استفساره.
              </div>

            )}


          {/* قائمة الأسئلة */}

          {!loadingConsultations &&
            consultations.length > 0 && (

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px'
                }}
              >

                {consultations.map((item) => (

                  <article
                    key={item.id}
                    style={{
                      background: '#fff',
                      borderRadius: '20px',
                      padding: '24px',
                      border:
                        '1px solid #e2e8f0',
                      boxShadow:
                        '0 5px 20px rgba(15,23,42,0.05)'
                    }}
                  >

                    {/* السؤال */}

                    <div
                      style={{
                        marginBottom: '18px'
                      }}
                    >

                      <div
                        style={{
                          color: '#0284c7',
                          fontWeight: '800',
                          marginBottom: '7px'
                        }}
                      >
                        ❓ سؤال
                      </div>

                      <div
                        style={{
                          color: '#1e293b',
                          fontSize: '16px',
                          lineHeight: '1.9',
                          whiteSpace: 'pre-wrap'
                        }}
                      >
                        {item.question}
                      </div>

                    </div>


                    {/* الرد */}

                    {item.answer && (

                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: '15px',
                          padding: '17px',
                          border:
                            '1px solid #e2e8f0',
                          marginBottom: '18px'
                        }}
                      >

                        <div
                          style={{
                            color: '#0f766e',
                            fontWeight: '800',
                            marginBottom: '7px'
                          }}
                        >
                          🩺 رد منصة دكتور
                        </div>

                        <div
                          style={{
                            color: '#334155',
                            lineHeight: '1.9',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {item.answer}
                        </div>

                      </div>

                    )}


                    {/* التوجيه */}

                    {(item.specialty ||
                      item.doctor_id) && (

                      <div
                        style={{
                          borderTop:
                            '1px solid #e2e8f0',
                          paddingTop: '17px'
                        }}
                      >

                        {item.specialty && (

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '10px',
                              flexWrap: 'wrap',
                              marginBottom:
                                item.doctor_id
                                  ? '12px'
                                  : '0'
                            }}
                          >

                            <div
                              style={{
                                color: '#475569',
                                fontWeight: '700'
                              }}
                            >
                              🩺 التخصص المقترح:
                              <span
                                style={{
                                  color: '#0284c7',
                                  marginRight: '6px'
                                }}
                              >
                                {item.specialty}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleSpecialty(
                                  item.specialty
                                )
                              }
                              style={{
                                border: 'none',
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding:
                                  '8px 13px',
                                borderRadius:
                                  '10px',
                                fontWeight: '700',
                                cursor: 'pointer'
                              }}
                            >
                              مشاهدة أطباء التخصص
                            </button>

                          </div>

                        )}


                        {/* الطبيب */}

                        {item.doctor_id && (

                          <button
                            type="button"
                            onClick={() =>
                              handleDoctor(
                                item.doctor_id
                              )
                            }
                            style={{
                              width: '100%',
                              border: 'none',
                              background: '#0284c7',
                              color: '#fff',
                              padding: '12px',
                              borderRadius: '11px',
                              fontSize: '15px',
                              fontWeight: '800',
                              cursor: 'pointer'
                            }}
                          >
                            👨‍⚕️ مشاهدة الطبيب المقترح وحجز موعد
                          </button>

                        )}

                      </div>

                    )}

                  </article>

                ))}

              </div>

            )}

        </section>

      </main>
      

    </div>
    </>

  );
}

export default SymptomsPage;