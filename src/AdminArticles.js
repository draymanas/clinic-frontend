import { useState, useEffect } from 'react';

export default function AdminArticles() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

useEffect(() => {
  if (!selectedImage) {
    setImagePreview('');
    return;
  }

  const previewUrl = URL.createObjectURL(selectedImage);
  setImagePreview(previewUrl);

  return () => URL.revokeObjectURL(previewUrl);
}, [selectedImage]);
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

const handleSaveArticle = () => {
  if (!article.title.trim()) {
    alert('من فضلك اكتب عنوان المقال');
    return;
  }

  if (!article.slug.trim()) {
    alert('من فضلك اكتب رابط المقال Slug');
    return;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug.trim())) {
    alert('رابط المقال يجب أن يكون بالإنجليزية، بحروف صغيرة وأرقام وشرطات فقط');
    return;
  }

  if (!article.content.trim()) {
    alert('من فضلك اكتب محتوى المقال');
    return;
  }

  alert('✅ بيانات المقال مكتملة وجاهزة للحفظ');
};

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

{/* 📸 اختيار صورة المقال */}
<div>
  <label
    htmlFor="article-image"
    style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}
  >
    📸 صورة المقال
  </label>

  <input
    id="article-image"
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) {
        setSelectedImage(null);
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('اختر صورة JPG أو PNG أو WebP');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب ألا يتجاوز 5 ميجابايت');
        e.target.value = '';
        return;
      }

      setSelectedImage(file);
    }}
    style={fieldStyle}
  />

  {selectedImage && (
    <p style={{ color: '#16a34a', fontSize: '14px' }}>
      ✅ تم اختيار الصورة: {selectedImage.name}
    </p>
  )}
  {imagePreview && (
  <div style={{ marginTop: '15px' }}>
    <p style={{ fontWeight: 'bold' }}>معاينة صورة المقال:</p>

    <img
      src={imagePreview}
      alt="معاينة صورة المقال"
      style={{
        width: '100%',
        maxWidth: '450px',
        maxHeight: '280px',
        objectFit: 'cover',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}
    />
  </div>
)}
</div>

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
  onClick={handleSaveArticle}
          style={{
            padding: '14px',
            background: '#0284c7',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          💾  تجهيز حفظ المقال (سنفعّله في الخطوة القادمة)
        </button>
      </div>
    </div>
  );
}