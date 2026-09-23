import { useLang } from '../../shared/i18n';
import { EditableList, EditableText } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './WhyChoose.css';

const icons = ['🌍', '🔬', '👨‍🏫', '❤️', '🎓', '🏫', '💻', '🤖'];

export default function EditableWhyChoose() {
  const { t } = useLang();

  const { sections, handleSaveSection } = useEditableSections('why-choose', {
    main: {
      label: 'TIS afzalliklari',
      title: t.whyChoose.title,
      items: t.whyChoose.items.map((item, i) => ({ text: item, icon: icons[i] })),
    },
  });

  return (
    <section className="why-choose section">
      <div className="container">
        <div className="section-header center">
          <span className="section-label">
            <EditableText
              value={sections.main.label}
              onSave={(newLabel) => handleSaveSection('main', { ...sections.main, label: newLabel })}
              label="Yorliq"
            />
          </span>
          <h2 className="why-choose-title">
            <EditableText
              value={sections.main.title}
              onSave={(newTitle) => handleSaveSection('main', { ...sections.main, title: newTitle })}
              label="Sarlavha"
            />
          </h2>
          <div className="divider center" />
        </div>

        <div className="why-grid">
          <EditableList
            items={sections.main.items || []}
            onSave={(newItems) => handleSaveSection('main', { ...sections.main, items: newItems })}
            defaultItem={{ text: '', icon: '🌍' }}
            itemName="Card"
            renderItem={(item) => (
              <div className="why-card glass-card">
                <div className="why-icon">{item.icon}</div>
                <p className="why-text">{item.text}</p>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
}
