import { useLang } from '../../shared/i18n';
import { EditableSection, EditableList, EditableText } from '../../shared/editable';
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
            <EditableSection
                sectionId="hero"
                data={sections.hero}
                onSave={(data) => handleSaveSection('hero', data)}
            >
                <div className="page-hero">
                    <div className="container">
                        <span className="section-label">{sections.hero.label}</span>
                        <h1 className="section-title">{sections.hero.title}</h1>
                        <div className="divider" />
                    </div>
                </div>
            </EditableSection>

            <section className="section">
                <div className="container">
                    {/* Vision */}
                    <EditableSection
                        sectionId="vision"
                        data={sections.vision}
                        onSave={(data) => handleSaveSection('vision', data)}
                    >
                        <div className="vision-block glass-card">
                            <div className="vision-icon">{sections.vision.icon}</div>
                            <h2 className="vision-block-title">{sections.vision.title}</h2>
                            <p className="vision-text">{sections.vision.text}</p>
                        </div>
                    </EditableSection>

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
