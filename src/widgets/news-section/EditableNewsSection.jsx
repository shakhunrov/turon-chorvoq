import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLang } from '../../shared/i18n';
import { EditableText, EditableImage } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import { fetchPublicNews, uploadNewsImage, selectNewsList, selectNewsLoading } from '../../features/news';
import { selectIsAuth } from '../../features/auth';
import './NewsSection.css';

export default function EditableNewsSection() {
  const { t } = useLang();
  const dispatch = useDispatch();
  const isEditableMode = useSelector(selectIsAuth);
  const basePrefix = isEditableMode ? '/editable' : '';
  const branchId = localStorage.getItem('globalBranchId');

  const newsList = useSelector(selectNewsList);
  const newsLoading = useSelector(selectNewsLoading);

  const { sections, handleSaveSection } = useEditableSections('news-section', {
    main: {
      label: "So'nggi",
      title: t.news.title,
    },
  });


  // Backend'dan yangiliklar ma'lumotlarini yuklash (faqat nashr etilganlar — public endpoint)
  useEffect(() => {
    dispatch(fetchPublicNews({ branch: branchId }));
  }, [dispatch, branchId]);

  // Faqat nashr etilgan va eng so'nggi 3ta yangilikni olish
    const latestNews = newsList
        // .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);


  return (
    <section className="news-section section">
      <div className="container">
        <>
          <div className="section-header">
            <span className="section-label">
              <EditableText value={sections.main.label} onSave={(v) => handleSaveSection('main', { ...sections.main, label: v })} label="Yorliq" />
            </span>
            <h2 className="section-title">
              <EditableText value={sections.main.title} onSave={(v) => handleSaveSection('main', { ...sections.main, title: v })} label="Sarlavha" />
            </h2>
            <div className="divider" />
          </div>

          {newsLoading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
              <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} />
              Yangiliklar yuklanmoqda…
            </div>
          ) : (
            <>
              <div className="news-grid">
                {latestNews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', gridColumn: '1 / -1' }}>
                    Yangiliklar topilmadi.
                  </div>
                ) : (
                  latestNews.map((item, i) => (
                    <article key={item.id} className="news-card glass-card" style={{ position: 'relative' }}>
                      <EditableImage overlay onSave={(file) => dispatch(uploadNewsImage({ id: item.id, imageFile: file }))} />
                      <div
                        className="news-img-placeholder"
                        style={{
                          background: item.image ? `url(${item.image}) center/cover` : `var(--grad-${['cyan','gold','purple'][i % 3]})`,
                          opacity: item.image ? 1 : 0.15,
                          height: 200,
                        }}
                      />
                      <div className="news-body">
                        <time className="news-date">{item.date}</time>
                        <h3 className="news-title">{item.title}</h3>
                        <p className="news-desc">{(item.description || '').slice(0, 100)}…</p>
                        <Link to={`${basePrefix}/news/${item.id}`} className="news-read-more">{t.news.readMore} →</Link>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: 40 }}>
                <Link to={`${basePrefix}/news`} className="btn btn-outline">Barcha yangiliklar</Link>
              </div>
            </>
          )}
        </>
      </div>
    </section>
  );
}
