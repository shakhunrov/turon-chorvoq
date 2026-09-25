import { useState } from 'react';
import { useLang } from '../../shared/i18n';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useSelector } from 'react-redux';
import { EditableList, EditableText } from '../../shared/editable';
import { selectIsAuth } from '../../features/auth';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './Testimonials.css';

export default function EditableTestimonials() {
  const { t } = useLang();
  const [idx, setIdx] = useState(0);

  const { sections, handleSaveSection } = useEditableSections('testimonials', {
    main: {
      label: 'Jamiyat',
      title: t.testimonials.title,
      items: t.testimonials.items,
    },
  });

  const isEditableMode = useSelector(selectIsAuth);
  const items = sections.main.items;
  const prev = () => setIdx((i) => (i - 1 + items.length) % items.length);
  const next = () => setIdx((i) => (i + 1) % items.length);
  const safeIdx = Math.min(idx, Math.max(items.length - 1, 0));

  return (
    <>
      <section className="testimonials section">
        <div className="container">
          <div className="section-header center">
            <span className="section-label">
              <EditableText value={sections.main.label} onSave={(v) => handleSaveSection('main', { ...sections.main, label: v })} label="Yorliq" />
            </span>
            <h2 className="section-title">
              <EditableText value={sections.main.title} onSave={(v) => handleSaveSection('main', { ...sections.main, title: v })} label="Sarlavha" />
            </h2>
            <div className="divider center" />
          </div>

          <div className="testimonial-wrapper">
            <button className="testi-nav prev" onClick={prev}><ChevronLeft size={20} /></button>

            <div className="testimonial-card glass-card" style={{ position: 'relative' }}>
              <Quote size={36} className="testi-quote-icon" />
              <p className="testi-text">{items[safeIdx]?.text}</p>
              <div className="testi-author">
                <div className="testi-avatar">{items[safeIdx]?.name?.[0]}</div>
                <div>
                  <div className="testi-name">{items[safeIdx]?.name}</div>
                  <div className="testi-role">{items[safeIdx]?.role}</div>
                </div>
              </div>
            </div>

            <button className="testi-nav next" onClick={next}><ChevronRight size={20} /></button>
          </div>

          <div className="testi-dots">
            {items.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`testi-dot ${i === idx ? 'active' : ''}`} />
            ))}
          </div>

          {/* Fikrlarni boshqarish: qo'shish / tahrirlash / o'chirish / sudrab tartiblash (faqat tahrirlash rejimida) */}
          {isEditableMode && (
            <div className="testi-manage" style={{ marginTop: 40, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              <EditableList
                items={items}
                onSave={(newItems) => {
                  handleSaveSection('main', { ...sections.main, items: newItems });
                  if (idx >= newItems.length) setIdx(0);
                }}
                defaultItem={{ name: '', role: '', text: '' }}
                itemName="Fikr"
                renderItem={(item) => (
                  <div className="glass-card" style={{ padding: 16, height: '100%' }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>{item.role}</div>
                    <div style={{ fontSize: 13 }}>{item.text}</div>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
