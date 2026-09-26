import { useLang } from '../../shared/i18n';
import {
  TextSplit,
  GradientBlob,
  StaggerGrid,
  staggerItem,
  RevealOnScroll,
  TiltCard,
  TimelineRail,
} from '../../shared/components/kinetic';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../features/auth';
import { EditableText, EditableList, makeTx, makeLst } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import './AboutWhyTis.css';

export default function AboutWhyTis() {
  const { t } = useLang();
  const w = t.about.whyTis;

  const isEditableMode = useSelector(selectIsAuth);
  const { sections, handleSaveSection } = useEditableSections('about-why-tis', {});
  const tx = makeTx(sections, handleSaveSection);
  const lst = makeLst(sections, handleSaveSection);
  const differList = lst('differ', w.differItems);
  const pedList = lst('ped', w.pedItems.map((text) => ({ text })));
  const unifiedList = lst('unified', w.unifiedItems);

  const unifiedSteps = unifiedList.items.map((item) => ({
    title: item.title,
    text:  item.desc,
  }));

  return (
    <div className="page wt-page">
      {/* ── Hero ── */}
      <div className="wt-hero">
        <GradientBlob position="top-right" color="blue" size={380} opacity={0.14} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {tx('label', 'Biz haqimizda')}
          </motion.span>
          <EditableText
            value={sections.texts?.title || w.title}
            onSave={(v) => handleSaveSection('texts', { ...(sections.texts || {}), title: v })}
            label="Sarlavha"
            render={(v) => <TextSplit text={v} as="h1" className="section-title" style={{ marginTop: 12 }} />}
          />
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>

      <section className="section">
        <div className="container">

          {/* ── Differentiators intro ── */}
          <RevealOnScroll variant="fadeUp">
            <div className="differ-intro glass-card">
              <h2 className="differ-title">{tx('differTitle', w.differTitle)}</h2>
              <p className="differ-text">{tx('differText', w.differText, { multiline: true })}</p>
            </div>
          </RevealOnScroll>

          {/* ── Differ grid with TiltCard ── */}
          <StaggerGrid className="differ-grid" stagger={0.08}>
            <EditableList
              items={differList.items}
              onSave={differList.onSave}
              defaultItem={{ title: '', items: [] }}
              itemName="Karta"
              renderItem={(item, i) => (
                <motion.div variants={staggerItem}>
                  <TiltCard className="differ-card glass-card" intensity={6}>
                    <div className="differ-num">{String(i + 1).padStart(2, '0')}</div>
                    <h3 className="differ-card-title">{item.title}</h3>
                    <ul className="differ-list">
                      {(item.items || []).map((p, j) => (
                        <li key={j}><span className="differ-dot" />{p}</li>
                      ))}
                    </ul>
                  </TiltCard>
                </motion.div>
              )}
            />
          </StaggerGrid>

          {/* ── Pedagogical Strengths ── */}
          <div className="ped-section">
            <RevealOnScroll>
              <h2 className="section-title">{tx('pedTitle', w.pedTitle)}</h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 32 }}>{tx('pedText', w.pedText, { multiline: true })}</p>
            </RevealOnScroll>
            <StaggerGrid className="ped-grid" stagger={0.06}>
              <EditableList
                items={pedList.items}
                onSave={pedList.onSave}
                defaultItem={{ text: '' }}
                itemName="Kuchli tomon"
                renderItem={(p, i) => (
                  <motion.div className="ped-card glass-card" variants={staggerItem}>
                    <div className="ped-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="ped-text">{p.text}</div>
                  </motion.div>
                )}
              />
            </StaggerGrid>
          </div>

          {/* ── Unified Academic Approach → Timeline ── */}
          <div className="unified-section">
            <RevealOnScroll>
              <h2 className="section-title">{tx('unifiedTitle', w.unifiedTitle)}</h2>
              <div className="divider" />
              <p className="section-subtitle" style={{ marginBottom: 32 }}>{tx('unifiedText', w.unifiedText, { multiline: true })}</p>
            </RevealOnScroll>
            <TimelineRail steps={unifiedSteps} />
            {isEditableMode && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 24 }}>
                <EditableList
                  items={unifiedList.items}
                  onSave={unifiedList.onSave}
                  defaultItem={{ title: '', desc: '' }}
                  itemName="Bosqich"
                  renderItem={(u, i) => <div className="glass-card" style={{ padding: '8px 14px' }}><b>{i + 1}. {u.title}</b></div>}
                />
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
