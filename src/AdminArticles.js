import { useState, useEffect } from 'react';

export default function AdminArticles() {
    const [editingId, setEditingId] = useState(null);
    const [articlesList, setArticlesList] = useState([]);
const [loadingArticles, setLoadingArticles] = useState(true);
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

  useEffect(() => {
  const fetchArticles = async () => {
    try {
      const response = await fetch(
        'https://clinic-api-ig3d.onrender.com/api/admin/medical-articles'
      );

      if (!response.ok) {
        throw new Error('فشل تحميل المقالات');
      }

      const data = await response.json();
      setArticlesList(data.articles || []);

    } catch (error) {
      console.error('خطأ تحميل المقالات:', error);
    } finally {
      setLoadingArticles(false);
    }
  };

  fetchArticles();
}, []);

const handleDeleteArticle = async (item) => {
  const confirmed = window.confirm(
    `هل أنت متأكد من حذف المقال "${item.title}" نهائيًا؟`
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `https://clinic-api-ig3d.onrender.com/api/admin/medical-articles/${item.id}`,
      { method: 'DELETE' }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'فشل حذف المقال');
    }

    setArticlesList(prev =>
      prev.filter(article => article.id !== item.id)
    );

    if (editingId === item.id) {
      setEditingId(null);
    }

    alert('✅ تم حذف المقال بنجاح');

  } catch (error) {
    alert(`❌ ${error.message}`);
  }
};

const handleEditArticle = (item) => {
  setEditingId(item.id);

  setArticle({
    title: item.title || '',
    slug: item.slug || '',
    summary: item.summary || '',
    content: item.content || '',
    specialty: item.specialty || '',
    author_name: item.author_name || '',
    reviewer_name: item.reviewer_name || '',
    sources: item.sources || '',
    seo_title: item.seo_title || '',
    seo_description: item.seo_description || '',
    status: item.status || 'draft'
  });

  setSelectedImage(null);

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const handleSaveArticle = async () => {
  if (!article.title.trim() || !article.slug.trim() || !article.content.trim()) {
    alert('من فضلك اكتب عنوان المقال والرابط والمحتوى');
    return;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug.trim())) {
    alert('رابط المقال يجب أن يكون بحروف إنجليزية صغيرة وأرقام وشرطات فقط');
    return;
  }

  try {
    const formData = new FormData();

    Object.entries(article).forEach(([key, value]) => {
      formData.append(key, value || '');
    });

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

  const response = await fetch(
  editingId
    ? `https://clinic-api-ig3d.onrender.com/api/admin/medical-articles/${editingId}`
    : 'https://clinic-api-ig3d.onrender.com/api/admin/medical-articles',
  {
    method: editingId ? 'PUT' : 'POST',
    body: formData
  }
);

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'فشل حفظ المقال');
    }
// ✅ تحديث قائمة المقالات بعد الحفظ أو التعديل
const updatedResponse = await fetch(
  'https://clinic-api-ig3d.onrender.com/api/admin/medical-articles'
);

if (updatedResponse.ok) {
  const updatedData = await updatedResponse.json();
  setArticlesList(updatedData.articles || []);
}

// الخروج من وضع التعديل
setEditingId(null);
    alert(
      article.status === 'published'
        ? '✅ تم نشر المقال بنجاح!'
        : '✅ تم حفظ المقال كمسودة بنجاح!'
    );

    if (article.status === 'published') {
      window.open(
        `https://www.doctoreg.online/medical-articles/${data.article.slug}`,
        '_blank'
      );
    }

  } catch (error) {
    console.error('خطأ حفظ المقال:', error);
    alert(`❌ ${error.message}`);
  }
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

<div style={{
  background: '#fff',
  padding: '20px',
  borderRadius: '12px',
  marginBottom: '25px'
}}>
  <h3>📚 المقالات الموجودة</h3>

  {loadingArticles ? (
    <p>جاري تحميل المقالات...</p>
  ) : articlesList.length === 0 ? (
    <p>لا توجد مقالات حتى الآن.</p>
  ) : (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'right' }}>العنوان</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>الحالة</th>
            <th style={{ padding: '10px', textAlign: 'right' }}>الإجراء</th>
            <td style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
  <button
    type="button"
    onClick={() => handleEditArticle(item)}
    style={{
      background: '#0284c7',
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer'
    }}
  >
    ✏️ تعديل
  </button>
  <button
    type="button"
    onClick={() => handleDeleteArticle(item)}
    style={{
      background: '#dc2626',
      color: '#fff',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginLeft: '10px'
    }}
  >
    🗑️ حذف
  </button>
</td>
          </tr>
        </thead>
        <tbody>
          {articlesList.map(item => (
            <tr key={item.id}>
              <td style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
                {item.title}
              </td>
              <td style={{ padding: '10px', borderTop: '1px solid #ddd' }}>
                {item.status === 'published' ? '✅ منشور' : '📝 مسودة'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

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

{/* 📰 معاينة المقال قبل النشر */}
<details style={{
  background: '#f8fafc',
  border: '1px solid #cbd5e1',
  borderRadius: '12px',
  padding: '20px',
  marginTop: '15px'
}}>
  <summary style={{
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0284c7'
  }}>
    👁️ معاينة المقال قبل النشر
  </summary>

  <div style={{
    background: '#fff',
    padding: '25px',
    marginTop: '20px',
    borderRadius: '12px',
    lineHeight: '1.9'
  }}>
    {article.specialty && (
      <p style={{ color: '#0284c7', fontWeight: 'bold' }}>
        {article.specialty}
      </p>
    )}

    <h1 style={{ color: '#0f172a', fontSize: '28px' }}>
      {article.title || 'عنوان المقال سيظهر هنا'}
    </h1>

    <p style={{ color: '#64748b', fontSize: '17px' }}>
      {article.summary || 'ملخص المقال سيظهر هنا'}
    </p>

    {imagePreview && (
      <img
        src={imagePreview}
        alt="صورة المقال"
        style={{
          width: '100%',
          maxHeight: '350px',
          objectFit: 'cover',
          borderRadius: '12px',
          marginBottom: '20px'
        }}
      />
    )}

    <div style={{
      whiteSpace: 'pre-wrap',
      color: '#334155',
      fontSize: '17px'
    }}>
      {article.content || 'محتوى المقال سيظهر هنا'}
    </div>

    {article.author_name && (
      <p><strong>الكاتب:</strong> {article.author_name}</p>
    )}

    {article.reviewer_name && (
      <p><strong>المراجع الطبي:</strong> {article.reviewer_name}</p>
    )}
  </div>
</details>

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
         💾 حفظ المقال / نشر المقال
        </button>
      </div>
    </div>
  );
}