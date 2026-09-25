import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditableHeroBanner from '../../widgets/hero-banner/EditableHeroBanner';
import EditableWhyChoose from '../../widgets/why-choose/EditableWhyChoose';
import EditableTestimonials from '../../widgets/testimonials/EditableTestimonials';
import EditableNewsSection from '../../widgets/news-section/EditableNewsSection';
import { EditableList, EditableText, EditableImage } from '../../shared/editable';
import { useLang } from '../../shared/i18n';
import { selectIsAuth } from '../../features/auth';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';
import { showToast } from '../../shared/toast/toast';
import schoolImg from '../../shared/assets/img/school.png';
import '../home/Home.css';

export default function EditableHome() {
    const { t, lang } = useLang();
    const branchId = localStorage.getItem('globalBranchId');
    const isEditableMode = useSelector(selectIsAuth);
    const basePrefix = isEditableMode ? '/editable' : '';

    // Section ma'lumotlari
    const [sections, setSections] = useState({
        whoWeAre: {
            label: t.nav.about,
            title: t.whoWeAre.title,
            text: t.whoWeAre.text,
            image: schoolImg,
        },
        stats: {
            title: t.stats.title,
            students: { val: t.stats.studentsVal, label: t.stats.students, icon: '👨‍🎓' },
            teachers: { val: t.stats.teachersVal, label: t.stats.teachers, icon: '👩‍🏫', note: t.stats.teachersNote },
            programs: { val: t.stats.programsVal, label: t.stats.programs, icon: '📚' },
            universities: { val: t.stats.universitiesVal, label: t.stats.universities, icon: '🏛️' },
        },
        philosophy: {
            label: 'Falsafa',
            title: t.philosophy.title,
            text: t.philosophy.text,
            tags: [
                { name: 'STEAM', icon: '🔬' },
                { name: 'AI', icon: '🤖' },
                { name: 'Cambridge', icon: '🎓' },
                { name: 'Kelajak ko\'nikmalari', icon: '🚀' }
            ],
        },
        cta: {
            title: t.cta.title,
            button: t.cta.button,
            consult: t.cta.consult,
        },
    });

    // Backend'dan ma'lumotlarni yuklash
    useEffect(() => {
        const loadSections = async () => {
            try {
                const data = await getPageSections({ branch: branchId, page: 'home' });
                if (data && data.length > 0) {
                    const loadedSections = {};
                    data.forEach(section => {
                        try {
                            // Получаем контент для текущего языка
                            const contentField = `content_${lang}`;
                            let content = section[contentField];

                            // Если content - строка, парсим JSON
                            if (typeof content === 'string') {
                                content = JSON.parse(content);
                            }

                            if (content && Object.keys(content).length > 0) {
                                loadedSections[section.section_id] = content;

                                // Agar section'da image field alohida bo'lsa, uni qo'shamiz
                                if (section.image) {
                                    loadedSections[section.section_id].image = section.image;
                                }
                            }
                        } catch (e) {
                            console.error(`Section ${section.section_id} parse error:`, e);
                        }
                    });
                    setSections(prev => ({ ...prev, ...loadedSections }));
                }
            } catch (error) {
                console.error('Section ma\'lumotlarini yuklashda xatolik:', error);
            }
        };
        loadSections();
    }, [branchId, lang]);

    // Section'ni saqlash
    const handleSaveSection = async (sectionId, data) => {
        try {
            const payload = {
                branch: branchId,
                page: 'home',
                section_id: sectionId,
            };

            // Agar data ichida File obyekti bo'lsa, uni alohida yuboramiz
            const contentData = {};

            Object.keys(data).forEach(key => {
                if (data[key] instanceof File) {
                    // File obyektini to'g'ridan-to'g'ri payload'ga qo'shamiz
                    payload[key] = data[key];
                } else {
                    contentData[key] = data[key];
                }
            });

            // Content'ni til uchun saqlash
            const contentField = `content_${lang}`;
            payload[contentField] = JSON.stringify(contentData);

            await savePageSection(payload);

            setSections(prev => ({
                ...prev,
                [sectionId]: data,
            }));
        } catch (error) {
            console.error('Section saqlashda xatolik:', error);
            showToast('Saqlashda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        }
    };

    // Statistika kartalari avval nomlangan maydonlarda saqlangan (students/teachers/...).
    // Endi umumiy ro'yxat (items) sifatida saqlaymiz — shu bilan har bir kartani alohida
    // tahrirlash/o'chirish/qo'shish/sudrash (EditableList) mumkin bo'ladi. Eski (hali `items`ga
    // o'tmagan) ma'lumot uchun quyidagi fallback bilan o'qiymiz — hech narsa yo'qolmaydi.
    const STAT_KEYS_DEFAULT = ['students', 'teachers', 'programs', 'universities'];
    const statsItems = Array.isArray(sections.stats.items)
        ? sections.stats.items
        : STAT_KEYS_DEFAULT.map((k) => sections.stats[k]).filter(Boolean);

    return (
        <div className="page">
            <EditableHeroBanner />

            {/* Biz haqimizda — matnlar alohida pen, rasm alohida tugma */}
            <section className="section">
                <div className="container who-we-are">
                    <div className="wwa-content">
                        <span className="section-label">
                            <EditableText value={sections.whoWeAre.label} onSave={(v) => handleSaveSection('whoWeAre', { ...sections.whoWeAre, label: v })} label="Yorliq" />
                        </span>
                        <h2 className="section-title">
                            <EditableText value={sections.whoWeAre.title} onSave={(v) => handleSaveSection('whoWeAre', { ...sections.whoWeAre, title: v })} label="Sarlavha" />
                        </h2>
                        <div className="divider" />
                        <p className="wwa-text">
                            <EditableText value={sections.whoWeAre.text} onSave={(v) => handleSaveSection('whoWeAre', { ...sections.whoWeAre, text: v })} label="Matn" multiline />
                        </p>
                        <Link to={`${basePrefix}/about/vision`} className="btn btn-primary" style={{ marginTop: 16 }}>
                            Batafsil →
                        </Link>
                    </div>
                    <div className="wwa-image-side">
                        <EditableImage onSave={(file) => handleSaveSection('whoWeAre', { ...sections.whoWeAre, image: file })}>
                            <img
                                src={typeof sections.whoWeAre.image === 'string' ? sections.whoWeAre.image : (sections.whoWeAre.image instanceof File ? URL.createObjectURL(sections.whoWeAre.image) : schoolImg)}
                                alt="Turon International School"
                                className="wwa-school-img"
                            />
                        </EditableImage>
                    </div>
                </div>
            </section>

            {/* Asosiy raqamlar - Editable (sarlavha alohida pen, kartalar EditableList orqali) */}
            <section className="stats-section section">
                <div className="container">
                    <div className="section-header center">
                        <span className="section-label">Ta'sir</span>
                        <h2 className="section-title">
                            <EditableText
                                value={sections.stats.title}
                                onSave={(newTitle) => handleSaveSection('stats', { ...sections.stats, title: newTitle })}
                                label="Sarlavha"
                            />
                        </h2>
                        <div className="divider center" />
                    </div>
                    <div className="stats-grid">
                        <EditableList
                            items={statsItems}
                            onSave={(newItems) => handleSaveSection('stats', { ...sections.stats, items: newItems })}
                            defaultItem={{ icon: '⭐', val: '', label: '', note: '' }}
                            itemName="Statistika"
                            renderItem={(s) => (
                                <div className="stat-card glass-card">
                                    <div className="stat-icon">{s.icon}</div>
                                    <div className="stat-val">{s.val}</div>
                                    <div className="stat-label">{s.label}</div>
                                    {s.note && <div className="stat-note">{s.note}</div>}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>

            {/* Ta'lim falsafasi — matnlar alohida pen, kartalar EditableList */}
            <section className="section">
                <div className="container philosophy-section">
                    <div className="philosophy-content">
                        <span className="section-label">
                            <EditableText
                                value={sections.philosophy.label}
                                onSave={(v) => handleSaveSection('philosophy', { ...sections.philosophy, label: v })}
                                label="Yorliq"
                            />
                        </span>
                        <h2 className="section-title">
                            <EditableText
                                value={sections.philosophy.title}
                                onSave={(v) => handleSaveSection('philosophy', { ...sections.philosophy, title: v })}
                                label="Sarlavha"
                            />
                        </h2>
                        <div className="divider" />
                        <p className="section-subtitle">
                            <EditableText
                                value={sections.philosophy.text}
                                onSave={(v) => handleSaveSection('philosophy', { ...sections.philosophy, text: v })}
                                label="Matn"
                                multiline
                            />
                        </p>
                        <Link to={`${basePrefix}/education`} className="btn btn-outline" style={{ marginTop: 24 }}>
                            Bizning yondashuvimiz →
                        </Link>
                    </div>
                    <div className="philosophy-cards">
                        <EditableList
                            items={sections.philosophy.tags || []}
                            onSave={(newTags) => handleSaveSection('philosophy', { ...sections.philosophy, tags: newTags })}
                            defaultItem={{ name: '', icon: '' }}
                            itemName="Teg"
                            renderItem={(tag) => (
                                <div className="phil-tag glass-card">
                                    {tag.icon && <span style={{ marginRight: '8px' }}>{tag.icon}</span>}
                                    {tag.name || tag}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>

            <EditableWhyChoose />
            <EditableTestimonials />
            <EditableNewsSection />

            {/* CTA Banner — har bir matn alohida pen */}
            <section className="cta-banner section">
                <div className="container">
                    <div className="cta-box glass-card">
                        <div className="cta-glow" />
                        <h2 className="cta-title">
                            <EditableText value={sections.cta.title} onSave={(v) => handleSaveSection('cta', { ...sections.cta, title: v })} label="Sarlavha" multiline />
                        </h2>
                        <div className="cta-actions">
                            <Link to={`${basePrefix}/admissions`} className="btn btn-primary">
                                <EditableText value={sections.cta.button} onSave={(v) => handleSaveSection('cta', { ...sections.cta, button: v })} label="Birinchi tugma matni" />
                            </Link>
                            <Link to={`${basePrefix}/contact`} className="btn btn-outline">
                                <EditableText value={sections.cta.consult} onSave={(v) => handleSaveSection('cta', { ...sections.cta, consult: v })} label="Ikkinchi tugma matni" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
