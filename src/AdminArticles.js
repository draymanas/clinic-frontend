import React, { useState } from 'react';

export default function AdminArticles() {
  const [article, setArticle] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    specialty: '',
    author_name: '',
    reviewer_name: '',
    sources: '',
    seo_title: '',
    seo_description: '',
    status: 'draft'
  });

  const updateField = (field, value) => {
    setArticle(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fieldStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '15px',
    marginTop: '6px'
  };

  const fields = [
    ['title', 'عنوان المقال'],
    ['slug', 'رابط المقال بالإنجليزية (Slug)'],
    ['specialty', 'التخصص الطبي'],
    ['author_name', 'اسم الكاتب'],
    ['reviewer_name', 'اسم المراجع الطبي'],
    ['seo_title', 'عنوان SEO']
  ];

  return (
    <div dir="rtl" style={{ maxWidth: '950px' }}>
      <h2>📰 إدارة المقالات - كل يوم معلومة</h2>

      <p style={{ color: '#64748b' }}>
        إنشاء المقالات الطبية وتجهيزها للنشر على منصة دكتور
      </p>

      <div style={{
        background: 'white',
        borderRadius: '14px',
        padding: '25px',
        display: 'grid',
        gap: '18px'
      }}>
        {fields.map(([key, label]) => (
          <label key={key}>
            <strong>{label}</strong>
            <input
              style={fieldStyle}
              value={article[key]}
              onChange={e => updateField(key, e.target.value)}
            />
          </label>
        ))}

        {[
          ['summary', 'ملخص المقال'],
          ['content', 'محتوى المقال الطبي'],
          ['sources', 'المصادر العلمية'],
          ['seo_description', 'وصف SEO']
        ].map(([key, label]) => (
          <label key={key}>
            <strong>{label}</strong>
            <textarea
              rows={key === 'content' ? 12 : 3}
              style={fieldStyle}
              value={article[key]}
              onChange={e => updateField(key, e.target.value)}
            />
          </label>
        ))}

        <label>
          <strong>حالة المقال</strong>
          <select
            style={fieldStyle}
            value={article.status}
            onChange={e => updateField('status', e.target.value)}
          >
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
          </select>
        </label>

        <button
          type="button"
          disabled
          style={{
            padding: '14px',
            background: '#94a3b8',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'not-allowed'
          }}
        >
          💾 حفظ المقال (سنفعّله في الخطوة القادمة)
        </button>
      </div>
    </div>
  );
}