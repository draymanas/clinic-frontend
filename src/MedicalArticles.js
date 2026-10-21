
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MedicalArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          'https://clinic-api-ig3d.onrender.com/api/medical-articles'
        );

        if (!response.ok) {
          throw new Error('فشل تحميل المقالات');
        }

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error('خطأ تحميل المقالات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div dir="rtl" style={{
      maxWidth: '1200px',
      margin: 'auto',
      padding: '40px 20px',
      fontFamily: 'Cairo, sans-serif'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#0284c7' }}>
          📰 كل يوم معلومة
        </h1>

        <p style={{ color: '#64748b', fontSize: '17px' }}>
          مقالات ومعلومات طبية من منصة دكتور
        </p>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center' }}>جاري تحميل المقالات...</p>
      ) : articles.length === 0 ? (
        <div style={{
          textAlign: 'center',
          background: '#f1f5f9',
          padding: '50px 20px',
          borderRadius: '15px'
        }}>
          <h3>قريبًا أولى مقالاتنا الطبية</h3>
          <p>تابعنا لمعلومات طبية جديدة ومفيدة.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '25px'
        }}>
          {articles.map(article => (
            <article key={article.id} style={{
              background: '#fff',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
              )}

              <div style={{ padding: '22px' }}>
                <span style={{ color: '#0284c7' }}>
                  {article.specialty}
                </span>

                <h2 style={{ fontSize: '20px' }}>
                  {article.title}
                </h2>

                <p style={{ color: '#64748b' }}>
                  {article.summary}
                </p>

                <Link
                  to={`/medical-articles/${article.slug}`}
                  style={{
                    color: '#0284c7',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                  }}
                >
                  اقرأ المقال ←
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
