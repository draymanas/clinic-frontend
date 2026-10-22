
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const API_URL = 'https://clinic-api-ig3d.onrender.com';

export default function MedicalArticleDetails() {
  const { slug } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const pageUrl = `https://www.doctoreg.online/medical-articles/${encodeURIComponent(slug)}`;

  const articleTitle = article?.seo_title || article?.title || 'مقال طبي';
  const articleDescription =
    article?.seo_description || article?.summary || 'مقالات ومعلومات طبية من منصة دكتور';

 
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
        maxWidth: '900px',
        margin: 'auto',
        padding: '35px 20px',
        fontFamily: 'Cairo, sans-serif',
        lineHeight: '1.9'
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

            <section style={{ marginTop: '30px' }}>
              {contentBlocks.map(renderContentBlock)}
            </section>

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
                  <p style={{ whiteSpace: 'pre-wrap' }}>{article.sources}</p>
                </div>
              )}

              <p style={{ color: '#64748b', fontSize: '13px' }}>
                المعلومات المنشورة للتثقيف الصحي ولا تغني عن استشارة الطبيب.
              </p>
            </footer>
          </article>
        </>
      )}
    </div>
  );
}
