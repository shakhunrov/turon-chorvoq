import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe2, FlaskConical, GraduationCap, Heart,
  Award, Building2, Monitor, Bot,
} from 'lucide-react';
import { useLang } from '../../shared/i18n';
import { getPageSections } from '../../shared/api/pageSections';
import {
  useAnimateOnScroll,
  fadeUp,
  staggerContainer,
  staggerChildScale,
} from '../../shared/hooks/useScrollAnimation';
import './WhyChoose.css';

const CARD_THEMES = [
  { Icon: Globe2,        grad: 'linear-gradient(145deg, #3B82F6 0%, #1D4ED8 100%)', glow: 'rgba(37,99,235,0.40)' },
  { Icon: FlaskConical,  grad: 'linear-gradient(145deg, #A855F7 0%, #7C3AED 100%)', glow: 'rgba(124,58,237,0.40)' },
  { Icon: GraduationCap, grad: 'linear-gradient(145deg, #22C55E 0%, #16A34A 100%)', glow: 'rgba(22,163,74,0.40)' },
  { Icon: Heart,         grad: 'linear-gradient(145deg, #F43F5E 0%, #BE123C 100%)', glow: 'rgba(225,29,72,0.40)' },
  { Icon: Award,         grad: 'linear-gradient(145deg, #FBBF24 0%, #D97706 100%)', glow: 'rgba(217,119,6,0.40)' },
  { Icon: Building2,     grad: 'linear-gradient(145deg, #64748B 0%, #334155 100%)', glow: 'rgba(51,65,85,0.40)' },
  { Icon: Monitor,       grad: 'linear-gradient(145deg, #818CF8 0%, #4F46E5 100%)', glow: 'rgba(79,70,229,0.40)' },
  { Icon: Bot,           grad: 'linear-gradient(145deg, #22D3EE 0%, #0891B2 100%)', glow: 'rgba(8,145,178,0.40)' },
];

export default function WhyChoose() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');

  const [section, setSection] = useState({
    label: 'TIS afzalliklari',
    title: t.whyChoose.title,
    items: t.whyChoose.items.map((item) => ({ text: item })),
  });

  useEffect(() => {
    const loadSection = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'why-choose' });
        if (data && data.length > 0) {
          const mainSection = data.find(s => s.section_id === 'main');
          if (mainSection) {
            try {
              const contentField = `content_${lang}`;
              let content = mainSection[contentField];
              if (typeof content === 'string') content = JSON.parse(content);
              if (content && Object.keys(content).length > 0)
                setSection(prev => ({ ...prev, ...content }));
            } catch (e) {
              console.error('WhyChoose section parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error("WhyChoose ma'lumotlarini yuklashda xatolik:", error);
      }
    };
    loadSection();
  }, [branchId, lang, t]);

  const header = useAnimateOnScroll(0.15);
  const grid = useAnimateOnScroll(0.10);

  return (
    <section className="why-choose section">
      <div className="container">
        <motion.div
          className="section-header center"
          ref={header.ref}
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate={header.animate}
        >
          <motion.span className="section-label" variants={fadeUp}>{section.label}</motion.span>
          <motion.h2 className="section-title why-choose-title" variants={fadeUp}>{section.title}</motion.h2>
          <motion.div className="divider center" variants={fadeUp} />
        </motion.div>

        <motion.div
          className="why-grid"
          ref={grid.ref}
          variants={staggerContainer(0.09, 0.10)}
          initial="hidden"
          animate={grid.animate}
        >
          {section.items.map((item, i) => {
            const theme = CARD_THEMES[i % CARD_THEMES.length];
            const { Icon } = theme;
            return (
              <motion.div key={i} className="why-card" variants={staggerChildScale}>
                <div
                  className="why-icon-wrap"
                  style={{
                    background: theme.grad,
                    boxShadow: `0 4px 0 rgba(0,0,0,0.18), 0 10px 24px ${theme.glow}, inset 0 1px 0 rgba(255,255,255,0.28)`,
                  }}
                >
                  <Icon size={28} className="why-icon-svg" />
                </div>
                <p className="why-text">{typeof item === 'object' ? item.text : item}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
