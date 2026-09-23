import { useEffect, useMemo, useState } from 'react';
import { Image as ImageIcon, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';

// Saytdagi har bir "pencil" bilan tahrirlanadigan joy shu ro'yxatdagi (page, section_id)
// juftligiga mos keladi (qarang: src/**/Editable*.jsx dagi useEditableSections/getPageSections
// chaqiruvlari). Yangi editable joy qo'shilsa, shu yerga ham qo'shib qo'yish kerak — aks holda
// u saytda ko'rinadi-yu, admin panelda ko'rinmaydi.
export const PAGES = [
    { key: 'home', label: 'Bosh sahifa — Hero banner', hint: 'Katta sarlavha, tugmalar' },
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

// Ko'p uchraydigan kalitlar uchun tushunarli o'zbekcha nomlar. Ro'yxatda yo'q kalit
// avtomatik "sarlavhaSingari" -> "Sarlavha Singari" ko'rinishiga o'giriladi.
const FRIENDLY_LABELS = {
    title: 'Sarlavha', subtitle: 'Kichik sarlavha', label: 'Yorliq (belgi)',
    text: 'Matn', desc: 'Tavsif', description: 'Tavsif', cta: 'Tugma matni',
    buttonText: 'Tugma matni', val: 'Raqam/Qiymat', note: 'Izoh', icon: 'Ikonka (emoji)',
    image: 'Rasm (havola)', name: 'Ism', role: 'Lavozim', suffix: 'Qo\'shimcha belgi (masalan +)',
};

const humanize = (key) => FRIENDLY_LABELS[key] || key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase());

const parseContent = (raw) => {
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    try {
        const p = JSON.parse(raw);
        return p && typeof p === 'object' ? p : {};
    } catch {
        return {};
    }
};

const isLongText = (v) => typeof v === 'string' && (v.length > 70 || v.includes('\n'));

const emptyLike = (sample) => {
    if (Array.isArray(sample)) return sample.length ? emptyLike(sample[0]) : '';
    if (sample && typeof sample === 'object') {
        const o = {};
        Object.keys(sample).forEach((k) => { o[k] = emptyLike(sample[k]); });
        return o;
    }
    return '';
};

// ── Bitta maydon: qiymat turiga qarab input/textarea, ro'yxat yoki ichki guruh ──
function Field({ label, value, onChange }) {
    if (Array.isArray(value)) {
        return (
            <div className="pgsec-group">
                <div className="pgsec-group-title">{label}</div>
                {value.map((item, i) => (
                    <div key={i} className="pgsec-array-item">
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {item && typeof item === 'object' ? (
                                <ObjectFields
                                    value={item}
                                    onChange={(next) => {
                                        const copy = [...value];
                                        copy[i] = next;
                                        onChange(copy);
                                    }}
                                />
                            ) : (
                                <input
                                    className="form-input"
                                    value={item ?? ''}
                                    onChange={(e) => {
                                        const copy = [...value];
                                        copy[i] = e.target.value;
                                        onChange(copy);
                                    }}
                                />
                            )}
                        </div>
                        <button type="button" className="action-btn delete" title="O'chirish"
                                onClick={() => onChange(value.filter((_, idx) => idx !== i))}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                <button type="button" className="btn btn-outline" style={{ marginTop: 8 }}
                        onClick={() => onChange([...value, emptyLike(value[0] ?? '')])}>
                    <Plus size={14} /> Qator qo'shish
                </button>
            </div>
        );
    }

    if (value && typeof value === 'object') {
        return (
            <div className="pgsec-group">
                <div className="pgsec-group-title">{label}</div>
                <ObjectFields value={value} onChange={onChange} />
            </div>
        );
    }

    return (
        <div className="form-group">
            <label className="form-label">{label}</label>
            {isLongText(value) ? (
                <textarea className="form-input" rows={4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
            ) : (
                <input className="form-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
            )}
        </div>
    );
}

// ── Obyektning barcha kalitlarini Field sifatida chizadi + yangi maydon qo'shish ──
function ObjectFields({ value, onChange }) {
    const [newKey, setNewKey] = useState('');

    const setField = (key, v) => onChange({ ...value, [key]: v });
    const addField = () => {
        const k = newKey.trim();
        if (!k || k in value) return;
        onChange({ ...value, [k]: '' });
        setNewKey('');
    };

    return (
        <div className="pgsec-fields">
            {/* "image" pastdagi alohida "Rasm" yuklash maydoni orqali boshqariladi, bu yerda ko'rsatilmaydi */}
            {Object.keys(value).filter((k) => k !== 'image').map((k) => (
                <Field key={k} label={humanize(k)} value={value[k]} onChange={(v) => setField(k, v)} />
            ))}
            <div className="pgsec-add-field">
                <input
                    className="form-input"
                    placeholder="Yangi maydon nomi (masalan: subtitle)"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addField())}
                />
                <button type="button" className="btn btn-outline" onClick={addField}>
                    <Plus size={14} /> Qo'shish
                </button>
            </div>
        </div>
    );
}

// ── Bitta section'ni tahrirlash — katta modal, tillar bo'yicha forma ──
function SectionEditor({ branchId, pageKey, section, onSaved, onCancel }) {
    const isNew = !section.id;
    const [sectionId, setSectionId] = useState(section.section_id || '');
    const [lang, setLang] = useState('uz');
    const [values, setValues] = useState(() => {
        const v = {};
        LANGS.forEach(({ key }) => { v[key] = parseContent(section[`content_${key}`]); });
        return v;
    });
    const [imageFile, setImageFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const save = async () => {
        if (!sectionId.trim()) {
            setError("Bo'lim nomi (Section ID) kiritilmagan — masalan: main");
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = {
                branch: branchId,
                page: pageKey,
                section_id: sectionId.trim(),
                content_uz: JSON.stringify(values.uz),
                content_ru: JSON.stringify(values.ru),
                content_en: JSON.stringify(values.en),
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

    const fieldCount = Object.keys(values[lang] || {}).filter((k) => k !== 'image').length;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-box" style={{ maxWidth: 860, width: '92vw', maxHeight: '88vh', overflowY: 'auto' }}
                 onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onCancel}><X size={18} /></button>

                <h2 style={{ marginTop: 0, marginBottom: 4 }}>
                    {isNew ? "Yangi bo'lim" : `Bo'lim: ${section.section_id}`}
                </h2>
                <p style={{ color: '#94a3b8', marginTop: 0, marginBottom: 20, fontSize: 13 }}>
                    Bu yerdagi yozuvlar saytda darhol ko'rinadi. Har bir maydonni to'g'ridan-to'g'ri o'zgartirishingiz mumkin.
                </p>

                <div className="form-group">
                    <label className="form-label">Bo'lim nomi (Section ID)</label>
                    <input
                        className="form-input"
                        placeholder="masalan: main"
                        value={sectionId}
                        disabled={!isNew}
                        onChange={(e) => setSectionId(e.target.value)}
                    />
                </div>

                {section.image && (
                    <img src={section.image} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }} />
                )}

                <div style={{ display: 'flex', gap: 8, margin: '4px 0 18px', borderBottom: '1px solid #e2e8f0', paddingBottom: 14 }}>
                    {LANGS.map(({ key, label }) => (
                        <button
                            key={key}
                            type="button"
                            className={`btn ${lang === key ? 'btn-primary' : 'btn-outline'}`}
                            style={{ padding: '7px 18px', fontSize: 13 }}
                            onClick={() => setLang(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {fieldCount === 0 && (
                    <p style={{ color: '#94a3b8', marginBottom: 12 }}>
                        Bu til uchun hali matn yo'q — saytda standart matn ko'rinadi. Quyidan maydon qo'shing.
                    </p>
                )}
                <ObjectFields value={values[lang]} onChange={(v) => setValues((prev) => ({ ...prev, [lang]: v }))} />

                <div className="form-group" style={{ marginTop: 20 }}>
                    <label className="form-label"><ImageIcon size={14} style={{ verticalAlign: -2 }} /> Rasm (ixtiyoriy)</label>
                    <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>{error}</p>}

                <div className="form-actions" style={{ marginTop: 20 }}>
                    <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>Bekor qilish</button>
                    <button type="button" className="btn btn-primary" onClick={save} disabled={saving}>
                        <Save size={15} /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                </div>
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
    const [editingId, setEditingId] = useState(null); // section.id yoki 'new' yoki null
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
    const editingSection = editingId && editingId !== 'new' ? sections.find((s) => s.id === editingId) : null;

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
                <nav style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
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

                    {!loading && !error && sections.length === 0 && (
                        <p style={{ color: '#94a3b8' }}>
                            Bu sahifada hali hech qanday bo'lim tahrirlanmagan — saytda standart (kod ichidagi) matnlar ko'rinadi.
                        </p>
                    )}

                    {!loading && sections.length > 0 && (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead><tr><th>Bo'lim</th><th>To'ldirilgan maydonlar</th><th>Harakatlar</th></tr></thead>
                                <tbody>
                                {sections.map((s) => (
                                    <tr key={s.id}>
                                        <td><div className="post-title">{s.section_id}</div></td>
                                        <td style={{ color: '#94a3b8', fontSize: 13 }}>
                                            {Object.keys(parseContent(s.content_uz)).map(humanize).join(', ') || 'bo\'sh'}
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

                    {!loading && (
                        <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => setEditingId('new')}>
                            <Plus size={15} /> Yangi bo'lim qo'shish
                        </button>
                    )}
                </div>
            </div>

            {editingId === 'new' && (
                <SectionEditor
                    branchId={branchId}
                    pageKey={pageKey}
                    section={{}}
                    onSaved={() => { setEditingId(null); refresh(); }}
                    onCancel={() => setEditingId(null)}
                />
            )}
            {editingSection && (
                <SectionEditor
                    branchId={branchId}
                    pageKey={pageKey}
                    section={editingSection}
                    onSaved={() => { setEditingId(null); refresh(); }}
                    onCancel={() => setEditingId(null)}
                />
            )}
        </>
    );
}
