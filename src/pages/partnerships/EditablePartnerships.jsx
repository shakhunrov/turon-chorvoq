import { useLang } from '../../shared/i18n';
import { EditableList, EditableText } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './Partnerships.css';

const CATEGORY_ICONS = ['🎓', '🏭', '🌐', '🤝'];

export default function EditablePartnerships() {
  const { t } = useLang();
  const p = t.partnerships;

  const { sections, handleSaveSection } = useEditableSections('partnerships', {
    hero: {
      label: 'Global tarmoq',
      title: p.title,
      subtitle: p.subtitle,
    },
    stats: {
      stats: p.stats,
    },
    network: {
      networkTitle: p.networkTitle,
      networkSubtitle: p.networkSubtitle,
      categories: p.categories,
    },
    opportunities: {
      oppTitle: p.oppTitle,
      opps: p.opps,
    },
  });

  return (
    <div className="page">
      <div className="page-hero-simple">
        <div className="container">
          <span className="section-label">
            <EditableText value={sections.hero.label} onSave={(v) => handleSaveSection('hero', { ...sections.hero, label: v })} label="Yorliq" />
          </span>
          <h1 className="section-title">
            <EditableText value={sections.hero.title} onSave={(v) => handleSaveSection('hero', { ...sections.hero, title: v })} label="Sarlavha" />
          </h1>
          <div className="divider" />
          <p className="section-subtitle">
            <EditableText value={sections.hero.subtitle} onSave={(v) => handleSaveSection('hero', { ...sections.hero, subtitle: v })} label="Subtitr" multiline />
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Stats */}
          <div className="partner-stats">
            <EditableList
              items={sections.stats.stats || []}
              onSave={(newStats) => handleSaveSection('stats', { ...sections.stats, stats: newStats })}
              defaultItem={{ val: '', label: '' }}
              itemName="Statistika"
              renderItem={(s) => (
                <div className="partner-stat glass-card">
                  <div className="partner-stat-val">{s.val}</div>
                  <div className="partner-stat-label">{s.label}</div>
                </div>
              )}
            />
          </div>

          {/* Network */}
          <div className="partner-network">
            <h2 className="section-title">
              <EditableText
                value={sections.network.networkTitle}
                onSave={(newTitle) => handleSaveSection('network', { ...sections.network, networkTitle: newTitle })}
                label="Sarlavha"
              />
            </h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: 48 }}>
              <EditableText
                value={sections.network.networkSubtitle}
                onSave={(newSubtitle) => handleSaveSection('network', { ...sections.network, networkSubtitle: newSubtitle })}
                label="Subtitr"
                multiline
              />
            </p>
            <div className="partner-grid">
              <EditableList
                items={sections.network.categories || []}
                onSave={(newCategories) => handleSaveSection('network', { ...sections.network, categories: newCategories })}
                defaultItem={{ title: '', desc: '' }}
                itemName="Kategoriya"
                renderItem={(cat, i) => (
                  <div className="partner-card glass-card">
                    <div className="partner-card-icon">
                      {CATEGORY_ICONS[i % CATEGORY_ICONS.length]}
                    </div>
                    <h3 className="partner-card-title">{cat.title}</h3>
                    <p className="partner-card-desc">{cat.desc}</p>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Opportunities */}
          <div className="opp-section">
            <h2 className="section-title">
              <EditableText
                value={sections.opportunities.oppTitle}
                onSave={(newTitle) => handleSaveSection('opportunities', { ...sections.opportunities, oppTitle: newTitle })}
                label="Sarlavha"
              />
            </h2>
            <div className="divider" />
            <div className="opp-list">
              <EditableList
                items={sections.opportunities.opps || []}
                onSave={(newOpps) => handleSaveSection('opportunities', { ...sections.opportunities, opps: newOpps })}
                defaultItem=""
                itemName="Imkoniyat"
                renderItem={(o) => (
                  <div className="opp-item glass-card">
                    <span className="opp-icon">✨</span>
                    <span>{o}</span>
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
