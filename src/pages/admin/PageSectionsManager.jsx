import { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Plus, Save, Sparkles, X } from 'lucide-react';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';

// Saytdagi har bir "pencil" bilan tahrirlanadigan joy shu ro'yxatdagi (page, section_id)
// juftligiga mos keladi (qarang: src/**/Editable*.jsx dagi useEditableSections/getPageSections
// chaqiruvlari). Yangi editable joy qo'shilsa, shu yerga ham qo'shib qo'yish kerak — aks holda
// u saytda ko'rinadi-yu, admin panelda ko'rinmaydi.
export const PAGES = [
    { key: 'home', label: 'Bosh sahifa — Hero banner', hint: 'Katta sarlavha, tugmalar (EditableHeroBanner)' },
    { key: 'why-choose', label: 'Bosh sahifa — Nega TIS', hint: 'Afzalliklar bo\'limi' },
    { key: 'testimonials', label: 'Bosh sahifa — Fikrlar', hint: 'Ota-ona/o\'quvchi sharhlari' },
    { key: 'news-section', label: 'Bosh sahifa — Yangiliklar sarlavhasi', hint: 'Faqat sarlavha/label — yangiliklarning o\'zi "Yangiliklar" bo\'limida' },
    { key: 'about-vision', label: 'Biz haqimizda — Missiya', hint: '' },
    { key: 'about-campus', label: 'Biz haqimizda — Kampus hayoti', hint: 'Ta\'lim / O\'quvchi uylari / Sport tablari' },
    { key: 'about-leadership', label: 'Biz haqimizda — Rahbariyat', hint: '' },
    { key: 'education', label: 'Ta\'lim', hint: '' },
    { key: 'partnerships', label: 'Hamkorlik', hint: '' },
    { key: 'careers', label: 'Ish o\'rinlari', hint: 'Vakansiyalar ro\'yxatidan tashqari matnlar' },
];

const LANGS = [
    { key: 'uz', label: "O'zbekcha" },
    { key: 'ru', label: 'Русский' },
    { key: 'en', label: 'English' },
];

const parseContent = (raw) => {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
};

// Bitta section'ni tahrirlash formasi — har bir til uchun alohida JSON matn maydoni.
function SectionEditor({ branchId, pageKey, section, onSaved, onCancel }) {
    const isNew = !section.id;
    const [sectionId, setSectionId] = useState(section.section_id || '');
    const [lang, setLang] = useState('uz');
    const [texts, setTexts] = useState(() => {
        const t = {};
        LANGS.forEach(({ key }) => {
            t[key] = JSON.stringify(parseContent(section[`content_${key}`]), null, 2);
        });
        return t;
    });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const save = async () => {
        if (!sectionId.trim()) {
            setError("Section ID kiritilmagan (masalan: main)");
            return;
        }
        // Har bir til matnini avval JSON sifatida tekshiramiz — noto'g'ri JSON bo'lsa saqlamaymiz
        const parsed = {};
        for (const { key } of LANGS) {
            const raw = texts[key].trim();
            if (!raw) {
                parsed[key] = {};
                continue;
            }
            try {
                parsed[key] = JSON.parse(raw);
            } catch {
                setError(`${key.toUpperCase()} matni to'g'ri JSON emas`);
                return;
            }
        }
        setSaving(true);
        setError('');
        try {
            const payload = {
                branch: branchId,
                page: pageKey,
                section_id: sectionId.trim(),
                content_uz: JSON.stringify(parsed.uz),
                content_ru: JSON.stringify(parsed.ru),
                content_en: JSON.stringify(parsed.en),
            };
            if (imageFile) payload.image = imageFile;
            await savePageSection(payload);
            onSaved();
        } catch (e) {
            setError(e?.response?.data?.detail || "Saqlashda xatolik yuz berdi");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="news-form-wrap" style={{ maxWidth: 640, marginBottom: 20 }}>
            <div className="news-form-header">
                <h2>{isNew ? "Yangi bo'lim" : `"${section.section_id}" bo'limi`}</h2>
                <button className="form-close" onClick={onCancel} title="Yopish"><X size={18} /></button>
            </div>

            <div className="form-group">
                <label className="form-label">Section ID</label>
                <input
                    className="form-input"
                    placeholder="masalan: main"
                    value={sectionId}
                    disabled={!isNew}
                    onChange={(e) => setSectionId(e.target.value)}
                />
            </div>

            {section.image && (
                <img src={section.image} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }} />
            )}

            <div style={{ display: 'flex', gap: 8, margin: '4px 0 12px' }}>
                {LANGS.map(({ key, label }) => (
                    <button
                        key={key}
                        type="button"
                        className={`btn ${lang === key ? 'btn-primary' : 'btn-outline'}`}
                        style={{ padding: '6px 14px', fontSize: 13 }}
                        onClick={() => setLang(key)}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="form-group">
                <textarea
                    className="form-input"
                    style={{ width: '100%', minHeight: 160, fontFamily: 'monospace', fontSize: 13 }}
                    value={texts[lang]}
                    onChange={(e) => setTexts((prev) => ({ ...prev, [lang]: e.target.value }))}
                    placeholder='{"title": "...", "text": "..."}'
                />
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                    JSON ko'rinishida — saytdagi shu bo'lim qanday maydonlarni kutsa, o'sha kalitlarni yozing
                    (masalan title, subtitle, text). Bo'sh qoldirilsa, shu til uchun saytdagi standart matn ko'rinadi.
                </p>
            </div>

            <div className="form-group">
                <label className="form-label"><ImageIcon size={14} style={{ verticalAlign: -2 }} /> Rasm (ixtiyoriy)</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>{error}</p>}

            <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>Bekor qilish</button>
                <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                    <Save size={15} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
            </div>
        </div>
    );
}

// Sahifa/bo'lim bo'yicha ajratilgan CMS ro'yxati — pastdagi bo'limlarning har biri saytda
// mos "pencil" bilan tahrirlanadigan joy bilan bir xil (branch + page + section_id).
export default function PageSectionsManager({ branchId }) {
    const [pageKey, setPageKey] = useState(PAGES[0].key);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null); // section.id yoki 'new'
    const [reloadTick, setReloadTick] = useState(0);

    const currentPage = useMemo(() => PAGES.find((p) => p.key === pageKey), [pageKey]);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError('');
        setEditingId(null);
        getPageSections({ branch: branchId, page: pageKey })
            .then((data) => { if (!cancelled) setSections(Array.isArray(data) ? data : []); })
            .catch(() => { if (!cancelled) setError("Ma'lumotni yuklab bo'lmadi"); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [branchId, pageKey, reloadTick]);

    const refresh = () => setReloadTick((t) => t + 1);

    return (
        <>
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <Sparkles size={22} style={{ color: '#1a2b6b' }} />
                    <div className="stat-info"><div className="stat-val">{PAGES.length}</div><div className="stat-label">Tahrirlanadigan sahifa</div></div>
                </div>
                <div className="admin-stat-card">
                    <Save size={22} style={{ color: '#10b981' }} />
                    <div className="stat-info"><div className="stat-val">{sections.length}</div><div className="stat-label">"{currentPage?.label}" da to'ldirilgan bo'lim</div></div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginTop: 20 }}>
                {/* Sahifalar ro'yxati */}
                <nav style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {PAGES.map((p) => (
                        <button
                            key={p.key}
                            className={`sidebar-item ${p.key === pageKey ? 'active' : ''}`}
                            style={{ textAlign: 'left', width: '100%' }}
                            onClick={() => setPageKey(p.key)}
                        >
                            {p.label}
                        </button>
                    ))}
                </nav>

                {/* Tanlangan sahifaning bo'limlari */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ marginTop: 0 }}>{currentPage?.label}</h3>
                    {currentPage?.hint && <p style={{ color: '#94a3b8', fontSize: 13, marginTop: -8 }}>{currentPage.hint}</p>}

                    {loading && (
                        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8' }}>
                            <div className="al-spinner" style={{ margin: '0 auto 16px', borderTopColor: '#4f46e5' }} /> Yuklanmoqda…
                        </div>
                    )}
                    {error && <p style={{ color: '#ef4444' }}>{error}</p>}

                    {!loading && !error && sections.length === 0 && editingId !== 'new' && (
                        <p style={{ color: '#94a3b8' }}>
                            Bu sahifada hali hech qanday bo'lim tahrirlanmagan — saytda standart (kod ichidagi) matnlar ko'rinadi.
                        </p>
                    )}

                    {!loading && sections.length > 0 && editingId === null && (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead><tr><th>Section ID</th><th>To'ldirilgan maydonlar</th><th>Harakatlar</th></tr></thead>
                                <tbody>
                                {sections.map((s) => (
                                    <tr key={s.id}>
                                        <td><div className="post-title">{s.section_id}</div></td>
                                        <td style={{ color: '#94a3b8', fontSize: 13 }}>
                                            {Object.keys(parseContent(s.content_uz)).join(', ') || 'bo\'sh'}
                                        </td>
                                        <td style={{ width: 120 }}>
                                            <div className="action-btns">
                                                <button className="action-btn edit" title="Tahrirlash" onClick={() => setEditingId(s.id)}>Tahrirlash</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {editingId !== null && editingId !== 'new' && (
                        <SectionEditor
                            branchId={branchId}
                            pageKey={pageKey}
                            section={sections.find((s) => s.id === editingId) || {}}
                            onSaved={() => { setEditingId(null); refresh(); }}
                            onCancel={() => setEditingId(null)}
                        />
                    )}

                    {editingId === 'new' ? (
                        <SectionEditor
                            branchId={branchId}
                            pageKey={pageKey}
                            section={{}}
                            onSaved={() => { setEditingId(null); refresh(); }}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        editingId === null && !loading && (
                            <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => setEditingId('new')}>
                                <Plus size={15} /> Yangi bo'lim qo'shish
                            </button>
                        )
                    )}
                </div>
            </div>
        </>
    );
}
