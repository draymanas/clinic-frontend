
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const API_URL = 'https://clinic-api-ig3d.onrender.com';

export default function MedicalArticleDetails() {
  const { slug } = useParams();


const [article, setArticle] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [relatedArticles, setRelatedArticles] = useState([]);


  useEffect(() => {
    let cancelled = false;

    async function fetchArticle() {
      setLoading(true);
      setError('');
      setArticle(null);

      try {
      
let data = null;
let lastError = null;

for (let attempt = 1; attempt <= 3; attempt++) {
  if (cancelled) return;

  try {
    const response = await fetch(
      `${API_URL}/api/medical-articles/${encodeURIComponent(slug)}`
    );

    if (response.status === 404) {
      throw new Error('المقال غير موجود أو لم يتم نشره بعد');
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    data = await response.json();
    break;

  } catch (err) {
    lastError = err;

    // لا نكرر المحاولة لو المقال غير موجود
    if (err.message === 'المقال غير موجود أو لم يتم نشره بعد') {
      throw err;
    }

    if (attempt < 3) {
      await new Promise(resolve =>
        setTimeout(resolve, attempt * 1000)
      );
    }
  }
}

if (!data) {
  throw lastError || new Error('تعذر تحميل المقال');
}

if (!cancelled) {
  setArticle(data.article);
}

      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchArticle();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  
useEffect(() => {
  if (!article) {
    setRelatedArticles([]);
    return;
  }

  let cancelled = false;

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch(
        'https://clinic-api-ig3d.onrender.com/api/medical-articles'
      );

      if (!response.ok) return;

      const data = await response.json();

      const currentSpecialties = Array.isArray(article.related_specialties)
        ? article.related_specialties
        : [];

      const articles = (data.articles || [])
        .filter(item => item.slug !== article.slug)
        .map(item => {
          const matchScore = currentSpecialties.filter(
            specialty =>
              item.specialty?.includes(specialty)
          ).length;

          return { ...item, matchScore };
        })
        .sort((a, b) =>
          b.matchScore - a.matchScore ||
          new Date(b.published_at || 0) -
          new Date(a.published_at || 0)
        )
        .slice(0, 3);

      if (!cancelled) {
        setRelatedArticles(articles);
      }

    } catch (err) {
      console.error('خطأ تحميل المقالات ذات الصلة:', err);
    }
  };

  fetchRelatedArticles();

  return () => {
    cancelled = true;
  };
}, [article]);


  const pageUrl = `https://www.doctoreg.online/medical-articles/${encodeURIComponent(slug)}`;

  const articleTitle = article?.seo_title || article?.title || 'مقال طبي';
  
const articleDescription =
  article?.seo_description || article?.summary || 'مقالات ومعلومات طبية من منصة دكتور';

// رابط المشاركة المختصر الخاص بالمقال
const shareUrl = `https://www.doctoreg.online/a/${encodeURIComponent(slug)}`;

const handleShareArticle = async () => {
  const shareData = {
    title: article?.title || 'مقال طبي - منصة دكتور',
    text: article?.summary || 'اقرأ هذا المقال الطبي على منصة دكتور',
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      alert('✅ تم نسخ رابط المقال، يمكنك مشاركته الآن');
    } else {
      window.prompt('انسخ رابط مشاركة المقال:', shareUrl);
    }
  } catch (error) {
    // إلغاء المستخدم لنافذة المشاركة لا يُعد خطأ
    if (error.name !== 'AbortError') {
      window.prompt('انسخ رابط مشاركة المقال:', shareUrl);
    }
  }
};

 
const renderFormattedText = (text) => {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part
  );
};

const contentBlocks = (article?.content || '')
  .split(/\n\s*\n/)
  .map(block => block.trim())
  .filter(Boolean);

const renderContentBlock = (block, index) => {
  if (block.startsWith('### ')) {
    return (
      <h3 key={index} style={{
        color: '#0f172a',
        fontSize: '21px',
        marginTop: '25px',
        lineHeight: '1.6'
      }}>
        {block.slice(4)}
      </h3>
    );
  }

  if (block.startsWith('## ')) {
    return (
      <h2 key={index} style={{
        color: '#0369a1',
        fontSize: '25px',
        marginTop: '35px',
        lineHeight: '1.6'
      }}>
        {block.slice(3)}
      </h2>
    );
  }

  if (block.startsWith('# ')) {
    // عنوان المقال موجود بالفعل كـ H1 أعلى الصفحة
    // نتجنب تكراره مرة ثانية داخل المحتوى
    return null;
  }

  const lines = block.split('\n');
  const isList = lines.every(line =>
    /^\s*(?:[-*]\s+|\d+\.\s+)/.test(line)
  );

  if (isList) {
    const isOrdered = lines.every(line => /^\s*\d+\.\s+/.test(line));
    const ListTag = isOrdered ? 'ol' : 'ul';

    return (
      <ListTag key={index} style={{
        paddingRight: '25px',
        paddingLeft: '10px',
        color: '#334155',
        fontSize: '17px',
        lineHeight: '2'
      }}>
        {lines.map((line, i) => (
          <li key={i}>
            {renderFormattedText(
              line.replace(/^\s*(?:[-*]\s+|\d+\.\s+)/, '')
            )}
          </li>
        ))}
      </ListTag>
    );
  }

  return (
    <p key={index} style={{
      fontSize: '17px',
      color: '#334155',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.9'
    }}>
      {renderFormattedText(block)}
    </p>
  );
};


  return (
   
<div
  dir="rtl"
  style={{
    width: '100%',
    maxWidth: '900px',
    minWidth: 0,
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: '20px 15px',
    fontFamily: 'Cairo, sans-serif',
    lineHeight: '1.9',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word'
  }}
>

      {loading && <p>جاري تحميل المقال...</p>}

      {error && (
        <div>
          <h2>{error}</h2>
          <Link to="/medical-articles">العودة إلى كل يوم معلومة</Link>
        </div>
      )}

      {article && (
        <>
          <Helmet>
          <title>{articleTitle.includes('منصة دكتور') ? articleTitle : `${articleTitle} | منصة دكتور`}</title>
            <meta name="description" content={articleDescription} />
            <link rel="canonical" href={pageUrl} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={articleTitle} />
            <meta property="og:description" content={articleDescription} />
            <meta property="og:url" content={pageUrl} />
            {article.image_url && (
              <meta property="og:image" content={article.image_url} />
            )}
            
{/* 📰 بيانات المقال المنظمة لمحركات البحث */}
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": pageUrl
    },
    "headline": article.title,
    "description": articleDescription,
    ...(article.image_url && {
      "image": [article.image_url]
    }),
    ...(article.published_at && {
      "datePublished": article.published_at
    }),
    ...(article.updated_at && {
      "dateModified": article.updated_at
    }),
    "author": article.author_name
      ? {
          "@type": "Person",
          "name": article.author_name
        }
      : {
          "@type": "Organization",
          "name": "منصة دكتور"
        },
    "publisher": {
      "@type": "Organization",
      "name": "منصة دكتور",
      "url": "https://www.doctoreg.online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.doctoreg.online/logo512.png"
      }
    },
    "inLanguage": "ar-EG"
  })}
</script>

          </Helmet>

          <Link to="/medical-articles" style={{ color: '#0284c7' }}>
            ← كل يوم معلومة
          </Link>

          <article>
            <header>
              {article.specialty && (
                <p style={{ color: '#0284c7', fontWeight: 'bold' }}>
                  {article.specialty}
                </p>
              )}

              <h1 style={{
                fontSize: '32px',
                color: '#0f172a',
                lineHeight: '1.5'
              }}>
                {article.title}
              </h1>

              {article.summary && (
                <p style={{ fontSize: '18px', color: '#64748b' }}>
                  {article.summary}
                </p>
              )}

              {article.published_at && (
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  تاريخ النشر:{' '}
                  {new Date(article.published_at).toLocaleDateString('ar-EG')}
                </p>
              )}
            </header>

         
{article.image_url && (
  <img
    src={article.image_url}
    alt={article.title}
    style={{
      width: '100%',
      maxHeight: '450px',
      objectFit: 'cover',
      borderRadius: '15px',
      margin: '20px 0'
    }}
  />
)}

{/* زر مشاركة المقال */}
<div style={{
  display: 'flex',
  justifyContent: 'center',
  margin: '15px 0 30px'
}}>
  <button
    type="button"
    onClick={handleShareArticle}
    style={{
      background: '#0284c7',
      color: 'white',
      border: 'none',
      padding: '13px 28px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }}
  >
    🔗 مشاركة المقال
  </button>
</div>


            <section style={{ marginTop: '30px' }}>
              {contentBlocks.map(renderContentBlock)}
            </section>

{/* 🩺 عرض أطباء التخصصات المرتبطة بالمقال */}
{Array.isArray(article.related_specialties) &&
  article.related_specialties.length > 0 && (

  <div style={{
    marginTop: '35px',
    padding: '25px',
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '15px',
    textAlign: 'center'
  }}>

    <h2 style={{
      color: '#0f172a',
      fontSize: '24px',
      marginBottom: '10px'
    }}>
      🩺 هل تحتاج إلى استشارة طبيب متخصص؟
    </h2>

    <p style={{
      color: '#475569',
      fontSize: '16px',
      marginBottom: '20px'
    }}>
      يمكنك استعراض الأطباء المتخصصين واختيار
      الطبيب والموعد المناسب لك.
    </p>

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '12px'
    }}>

      {article.related_specialties.map((specialty, index) => (

        <Link
          key={index}
          to={`/doctors/${encodeURIComponent(
            specialty.trim().replace(/\s+/g, '-')
          )}`}
          style={{
            display: 'inline-block',
            background: '#0284c7',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '14px 22px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          👨‍⚕️ عرض أطباء {specialty}
        </Link>

      ))}

    </div>
  </div>
)}
            <footer style={{
              marginTop: '40px',
              padding: '20px',
              background: '#f1f5f9',
              borderRadius: '12px'
            }}>
              {article.author_name && (
                <p><strong>كاتب المقال:</strong> {article.author_name}</p>
              )}

              {article.reviewer_name && (
                <p><strong>المراجع الطبي:</strong> {article.reviewer_name}</p>
              )}

              {article.sources && (
                <div>
                  <strong>المصادر العلمية:</strong>
                <p style={{
  whiteSpace: 'pre-wrap',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
  maxWidth: '100%'
}}>
  {article.sources}
</p>
                </div>
              )}

              {article.related_specialties && article.related_specialties.length > 0 && (
                <div>
                  <strong>التخصصات المرتبطة:</strong>
                  <p>{article.related_specialties.join(', ')}</p>
                </div>
              )}

              <p style={{ color: '#64748b', fontSize: '13px' }}>
                المعلومات المنشورة للتثقيف الصحي ولا تغني عن استشارة الطبيب.
              </p>
            
</footer>


{/* 📚 مقالات طبية ذات صلة */}
{relatedArticles.length > 0 && (
  <section style={{
    marginTop: '35px',
    paddingTop: '25px',
    borderTop: '1px solid #e2e8f0'
  }}>
    <h2 style={{
      color: '#0f172a',
      fontSize: '24px',
      marginBottom: '20px'
    }}>
      📚 مقالات طبية قد تهمك
    </h2>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
      gap: '18px'
    }}>
      {relatedArticles.map(item => (
        <Link
          key={item.id}
          to={`/medical-articles/${encodeURIComponent(item.slug)}`}
          style={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            overflow: 'hidden',
            boxShadow: '0 3px 10px rgba(0,0,0,0.05)'
          }}
        >
          {item.image_url && (
            <img
              src={item.image_url}
              alt={item.title}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                height: '160px',
                objectFit: 'cover'
              }}
            />
          )}

          <div style={{ padding: '15px' }}>
            <h3 style={{
              fontSize: '17px',
              lineHeight: '1.7',
              color: '#0369a1',
              margin: '0 0 10px'
            }}>
              {item.title}
            </h3>

            {item.summary && (
              <p style={{
                color: '#64748b',
                fontSize: '14px',
                lineHeight: '1.7',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {item.summary}
              </p>
            )}

            <span style={{
              color: '#0284c7',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              اقرأ المقال ←
            </span>
          </div>
        </Link>
      ))}
    </div>
  </section>
)}


</article>

        </>
      )}
    </div>
  );
}
