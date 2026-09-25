import { useLang } from '../../shared/i18n';
import { EditableList, EditableText } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './Education.css';

export default function EditableEducation() {
    const { t, lang } = useLang();
    const e = t.education;

    const defaultSections = {
        hero: {
            label: 'Ta\'lim',
            title: e.title,
        },
        truth: {
            num: '01',
            title: e.truthTitle,
            text: e.truthText,
        },
        approach: {
            title: e.approachTitle,
            text: e.approachText,
        },
        skills: {
            title: e.skillsTitle,
            skills: e.skills,
        },
        classroom: {
            title: e.classroomTitle || 'Ko\'nikmalar → Sinf amaliyoti',
            skillLabel: e.classroomSkillLabel || 'Ko\'nikma',
            practiceLabel: e.classroomPracticeLabel || 'Sinfda qanday ko\'rinadi',
            rows: e.skills?.map(skill => ({
                skill: skill.title,
                practice: skill.how
            })) || [],
        },
        assessment: {
            title: e.assessTitle,
            text: e.assessText,
        },
        curriculum: {
            title: e.curriculumTitle,
            curricula: e.curricula,
        },
        closing: {
            title: e.closingTitle,
            text: e.closingText,
        },
    };

    const { sections, handleSaveSection } = useEditableSections('education', defaultSections);

    return (
        <div className="page">
            <>
                <div className="page-hero-simple">
                    <div className="container">
                        <span className="section-label"><EditableText value={sections.hero.label} onSave={(v) => handleSaveSection('hero', { ...sections.hero, label: v })} label="Yorliq" /></span>
                        <h1 className="section-title"><EditableText value={sections.hero.title} onSave={(v) => handleSaveSection('hero', { ...sections.hero, title: v })} label="Sarlavha" /></h1>
                        <div className="divider" />
                    </div>
                </div>
            </>

            <section className="section">
                <div className="container">
                    {/* Truth about education */}
                    <>
                        <div className="edu-truth glass-card">
                            <div className="edu-truth-num"><EditableText value={sections.truth.num} onSave={(v) => handleSaveSection('truth', { ...sections.truth, num: v })} label="Raqam" /></div>
                            <div>
                                <h2 className="edu-truth-title"><EditableText value={sections.truth.title} onSave={(v) => handleSaveSection('truth', { ...sections.truth, title: v })} label="Sarlavha" /></h2>
                                <p className="edu-truth-text"><EditableText value={sections.truth.text} onSave={(v) => handleSaveSection('truth', { ...sections.truth, text: v })} label="Matn" multiline /></p>
                            </div>
                        </div>
                    </>

                    {/* Educational Approach */}
                    <>
                        <div className="edu-approach">
                            <h2 className="section-title"><EditableText value={sections.approach.title} onSave={(v) => handleSaveSection('approach', { ...sections.approach, title: v })} label="Sarlavha" /></h2>
                            <div className="divider" />
                            <p className="section-subtitle"><EditableText value={sections.approach.text} onSave={(v) => handleSaveSection('approach', { ...sections.approach, text: v })} label="Matn" multiline /></p>
                        </div>
                    </>

                    {/* Future Skills */}
                    <>
                        <div className="skills-section">
                            <h2 className="section-title"><EditableText value={sections.skills.title} onSave={(v) => handleSaveSection('skills', { ...sections.skills, title: v })} label="Sarlavha" /></h2>
                            <div className="divider" />
                            <div className="skills-grid">
                                <EditableList
                                    items={sections.skills.skills}
                                    onSave={(newSkills) => {
                                        handleSaveSection('skills', { ...sections.skills, skills: newSkills });
                                    }}
                                    renderItem={(skill) => (
                                        <div className="skill-card glass-card">
                                            <div className="skill-icon">{skill.icon}</div>
                                            <h3 className="skill-title">{skill.title}</h3>
                                            <p className="skill-desc">{skill.desc}</p>
                                            <div className="skill-how">
                                                <span className="skill-how-label">How:</span> {skill.how}
                                            </div>
                                        </div>
                                    )}
                                    defaultItem={{ icon: '🎯', title: '', desc: '', how: '' }}
                                    itemName="Ko'nikma"
                                />
                            </div>
                        </div>
                    </>

                    {/* Skills → Classroom table */}
                    <>
                        <div className="classroom-section">
                            <h2 className="section-title"><EditableText value={sections.classroom.title} onSave={(v) => handleSaveSection('classroom', { ...sections.classroom, title: v })} label="Sarlavha" /></h2>
                            <div className="divider" />
                            <div className="classroom-table glass-card">
                                <div className="classroom-header">
                                    <span><EditableText value={sections.classroom.skillLabel} onSave={(v) => handleSaveSection('classroom', { ...sections.classroom, skillLabel: v })} label="Birinchi ustun nomi" /></span>
                                    <span><EditableText value={sections.classroom.practiceLabel} onSave={(v) => handleSaveSection('classroom', { ...sections.classroom, practiceLabel: v })} label="Ikkinchi ustun nomi" /></span>
                                </div>
                                <EditableList
                                    items={sections.classroom.rows || []}
                                    onSave={(newRows) => {
                                        handleSaveSection('classroom', { ...sections.classroom, rows: newRows });
                                    }}
                                    renderItem={(row) => (
                                        <div className="classroom-row">
                                            <span className="classroom-skill">{row.skill}</span>
                                            <span className="classroom-practice">{row.practice}</span>
                                        </div>
                                    )}
                                    defaultItem={{ skill: '', practice: '' }}
                                    itemName="Qator"
                                />
                            </div>
                        </div>
                    </>

                    {/* Assessment */}
                    <>
                        <div className="assess-section glass-card">
                            <h2 className="assess-title"><EditableText value={sections.assessment.title} onSave={(v) => handleSaveSection('assessment', { ...sections.assessment, title: v })} label="Sarlavha" /></h2>
                            <p className="assess-text"><EditableText value={sections.assessment.text} onSave={(v) => handleSaveSection('assessment', { ...sections.assessment, text: v })} label="Matn" multiline /></p>
                        </div>
                    </>

                    {/* Curriculum */}
                    <>
                        <div className="curriculum-section">
                            <h2 className="section-title"><EditableText value={sections.curriculum.title} onSave={(v) => handleSaveSection('curriculum', { ...sections.curriculum, title: v })} label="Sarlavha" /></h2>
                            <div className="divider" />
                            <div className="curriculum-grid">
                                <EditableList
                                    items={sections.curriculum.curricula.map(c => ({ name: c }))}
                                    onSave={(newCurricula) => {
                                        handleSaveSection('curriculum', {
                                            ...sections.curriculum,
                                            curricula: newCurricula.map(c => c.name)
                                        });
                                    }}
                                    renderItem={(curriculum) => (
                                        <div className="curriculum-card glass-card">
                                            <span className="curriculum-icon">📋</span>
                                            <span className="curriculum-name">{curriculum.name}</span>
                                        </div>
                                    )}
                                    defaultItem={{ name: '' }}
                                    itemName="Dastur"
                                />
                            </div>
                        </div>
                    </>

                    {/* Closing */}
                    <>
                        <div className="edu-closing glass-card">
                            <h2 className="edu-closing-title"><EditableText value={sections.closing.title} onSave={(v) => handleSaveSection('closing', { ...sections.closing, title: v })} label="Sarlavha" /></h2>
                            <p className="edu-closing-text"><EditableText value={sections.closing.text} onSave={(v) => handleSaveSection('closing', { ...sections.closing, text: v })} label="Matn" multiline /></p>
                        </div>
                    </>
                </div>
            </section>
        </div>
    );
}
