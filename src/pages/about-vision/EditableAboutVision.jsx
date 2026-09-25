import { useLang } from '../../shared/i18n';
import { EditableList, EditableText } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './AboutVision.css';

export default function EditableAboutVision() {
    const { t, lang } = useLang();
    const v = t.about.vision;

    const defaultSections = {
        hero: {
            label: 'Biz haqimizda',
            title: v.title,
        },
        vision: {
            icon: '🌟',
            title: v.vision,
            text: v.visionText,
        },
        values: {
            title: v.valuesTitle,
            values: v.values,
        },
        outcomes: {
            title: v.outcomesTitle,
            outcomes: v.outcomes,
        },
    };

    const { sections, handleSaveSection } = useEditableSections('about-vision', defaultSections);

    return (
        <div className="page">
            <div className="page-hero">
                <div className="container">
                    <span className="section-label">
                        <EditableText value={sections.hero.label} onSave={(v) => handleSaveSection('hero', { ...sections.hero, label: v })} label="Yorliq" />
                    </span>
                    <h1 className="section-title">
                        <EditableText value={sections.hero.title} onSave={(v) => handleSaveSection('hero', { ...sections.hero, title: v })} label="Sarlavha" />
                    </h1>
                    <div className="divider" />
                </div>
            </div>

            <section className="section">
                <div className="container">
                    {/* Vision */}
                    <div className="vision-block glass-card">
                        <div className="vision-icon">
                            <EditableText value={sections.vision.icon} onSave={(v) => handleSaveSection('vision', { ...sections.vision, icon: v })} label="Emoji" />
                        </div>
                        <h2 className="vision-block-title">
                            <EditableText value={sections.vision.title} onSave={(v) => handleSaveSection('vision', { ...sections.vision, title: v })} label="Sarlavha" />
                        </h2>
                        <p className="vision-text">
                            <EditableText value={sections.vision.text} onSave={(v) => handleSaveSection('vision', { ...sections.vision, text: v })} label="Matn" multiline />
                        </p>
                    </div>

                    {/* Values */}
                    <div className="vision-values-section">
                        <h2 className="section-title">
                            <EditableText
                                value={sections.values.title}
                                onSave={(newTitle) => handleSaveSection('values', { ...sections.values, title: newTitle })}
                                label="Sarlavha"
                            />
                        </h2>
                        <div className="divider" />
                        <div className="values-grid">
                            <EditableList
                                items={sections.values.values || []}
                                onSave={(newValues) => handleSaveSection('values', { ...sections.values, values: newValues })}
                                defaultItem=""
                                itemName="Qadriyat"
                                renderItem={(val) => (
                                    <div className="value-tag glass-card">
                                        <span className="value-dot" />
                                        {val}
                                    </div>
                                )}
                            />
                        </div>
                    </div>

                    {/* Student Outcomes */}
                    <div className="outcomes-section">
                        <h2 className="section-title">
                            <EditableText
                                value={sections.outcomes.title}
                                onSave={(newTitle) => handleSaveSection('outcomes', { ...sections.outcomes, title: newTitle })}
                                label="Sarlavha"
                            />
                        </h2>
                        <div className="divider" />
                        <div className="outcomes-list">
                            <EditableList
                                items={sections.outcomes.outcomes || []}
                                onSave={(newOutcomes) => handleSaveSection('outcomes', { ...sections.outcomes, outcomes: newOutcomes })}
                                defaultItem=""
                                itemName="Natija"
                                renderItem={(o, i) => (
                                    <div className="outcome-item glass-card">
                                        <span className="outcome-num">{String(i + 1).padStart(2, '0')}</span>
                                        <p>{o}</p>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
