
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
        const response = await fetch(
          `${API_URL}/api/medical-articles/${encodeURIComponent(slug)}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'المقال غير موجود أو لم يتم نشره بعد'
              : 'حدث خطأ أثناء تحميل المقال'
          );
        }

        const data = await response.json();

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

  const formattedContent = (article?.content || '').split(/\n\s*\n/).filter(Boolean);

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
            <title>{articleTitle} | منصة دكتور</title>
            <meta name="description" content={articleDescription} />
            <link rel="canonical" href={pageUrl} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={articleTitle} />
            <meta property="og:description" content={articleDescription} />
            <meta property="og:url" content={pageUrl} />
            {article.image_url && (
              <meta property="og:image" content={article.image_url} />
            )}
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
              {formattedContent.map((paragraph, index) => (
                <p key={index} style={{
                  fontSize: '17px',
                  color: '#334155',
                  whiteSpace: 'pre-wrap'
                }}>
                  {paragraph}
                </p>
              ))}
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
