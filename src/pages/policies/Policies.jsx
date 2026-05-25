import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLang } from '../../shared/i18n';
import {
  TextSplit,
  GradientBlob,
  RevealOnScroll,
  StaggerGrid,
  staggerItem,
} from '../../shared/components/kinetic';
import './Policies.css';

function PolicyAccordion({ policy }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      id={policy.id}
      className={`policy-block glass-card policy-accordion${open ? ' open' : ''}`}
      variants={staggerItem}
      layout
    >
      <button className="policy-accordion-header" onClick={() => setOpen((o) => !o)}>
        <div className="policy-icon">{policy.icon}</div>
        <h2 className="policy-title">{policy.title}</h2>
        <motion.span
          className="policy-chevron"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="policy-accordion-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="policy-text">{policy.content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Policies() {
  const { t } = useLang();

  const policies = [
    {
      id: 'privacy',
      icon: '🔒',
      title: t.footer.policies,
      content: 'Turon International School is committed to protecting the privacy and personal data of all students, parents, and staff. We collect only the information necessary to provide our educational services and never share personal data with third parties without consent, except where required by law. All data is stored securely and in accordance with applicable data protection regulations.',
    },
    {
      id: 'safeguarding',
      icon: '🛡️',
      title: t.footer.safeguarding,
      content: 'The safety and well-being of every student is our highest priority. Turon International School has a comprehensive child protection policy aligned with international best practices. All staff undergo background checks and safeguarding training. Any concerns about student safety are taken seriously and addressed promptly in accordance with our established procedures.',
    },
    {
      id: 'terms',
      icon: '📋',
      title: t.footer.terms,
      content: 'By enrolling your child at Turon International School, you agree to our terms and conditions regarding school fees, attendance, code of conduct, and academic expectations. Our school reserves the right to update these terms with appropriate notice to families. A full copy of our terms and conditions is available from the school administration.',
    },
  ];

  return (
    <div className="page">
      {/* ── Hero ── */}
      <div className="page-hero-simple" style={{ position: 'relative', overflow: 'hidden' }}>
        <GradientBlob position="top-right" color="blue" size={340} opacity={0.12} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span
            className="section-label"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Huquqiy
          </motion.span>
          <TextSplit text="Siyosat va muvofiqlik" as="h1" className="section-title" style={{ marginTop: 12 }} />
          <motion.div
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.65, delay: 0.35 }}
            style={{ transformOrigin: 'left' }}
          />
          <motion.p
            className="policy-hero-chip"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            Last updated: January 2026
          </motion.p>
        </div>
      </div>

      <section className="section">
        <div className="container policies-content">
          <StaggerGrid stagger={0.1}>
            {policies.map((policy) => (
              <PolicyAccordion key={policy.id} policy={policy} />
            ))}
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
