import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, GraduationCap } from 'lucide-react';
import { useLang } from '../../shared/i18n';
import { EditableSection } from '../../shared/editable';
import { getPageSections, savePageSection } from '../../shared/api/pageSections';
import schoolImg from '../../shared/assets/img/school.png';
import './HeroBanner.css';

export default function EditableHeroBanner() {
  const { t, lang } = useLang();
  const branchId = localStorage.getItem('globalBranchId');

  const [heroData, setHeroData] = useState({
    subtitle: t.hero.subtitle,
    vision: t.hero.vision,
    text: t.whoWeAre.text,
    cta: t.hero.cta,
    apply: t.hero.apply,
    image: null,
  });

  const [statsData, setStatsData] = useState({
    students: { val: t.stats.studentsVal, label: t.stats.students },
    teachers: { val: t.stats.teachersVal, label: t.stats.teachers },
    universities: { val: t.stats.universitiesVal, label: t.stats.universities },
    languages: { val: '3', label: 'Languages' },
  });

  // Backend'dan ma'lumotlarni yuklash
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const data = await getPageSections({ branch: branchId, page: 'home' });
        if (data && data.length > 0) {
          const heroSection = data.find(section => section.section_id === 'hero');
          if (heroSection) {
            try {
              const contentField = `content_${lang}`;
              let content = heroSection[contentField];
              if (typeof content === 'string') content = JSON.parse(content);

              if (content && Object.keys(content).length > 0) {
                const bgImage = heroSection.image || null;
                setHeroData(prev => ({ ...prev, ...content, image: bgImage }));
              }
            } catch (e) {
              console.error('Hero section parse error:', e);
            }
          }

          const statsSection = data.find(section => section.section_id === 'hero-stats');
          if (statsSection) {
            try {
              const contentField = `content_${lang}`;
              let content = statsSection[contentField];
              if (typeof content === 'string') content = JSON.parse(content);

              if (content && Object.keys(content).length > 0) {
                setStatsData(prev => ({
                  students: content.students || prev.students,
                  teachers: content.teachers || prev.teachers,
                  universities: content.universities || prev.universities,
                  languages: content.languages || prev.languages,
                }));
              }
            } catch (e) {
              console.error('Stats section parse error:', e);
            }
          }
        }
      } catch (error) {
        console.error('Hero ma\'lumotlarini yuklashda xatolik:', error);
      }
    };
    loadHeroData();
  }, [branchId, lang, t]);

  // Hero'ni saqlash
  const handleSaveHero = async (data) => {
    try {
      const payload = {
        branch: branchId,
        page: 'home',
        section_id: 'hero',
      };

      const contentData = {};
      Object.keys(data).forEach(key => {
        if (data[key] instanceof File) {
          payload[key] = data[key];
        } else if (key !== 'image') { // image field alohida payload'da ketadi
          contentData[key] = data[key];
        }
      });

      const contentField = `content_${lang}`;
      payload[contentField] = JSON.stringify(contentData);

      await savePageSection(payload);
      
      // Yangilangan ma'lumotlarni qayta o'qish yoki state'ni yangilash
      if (data.image instanceof File) {
        // Preview uchun rasm url'ini yaratish
        const reader = new FileReader();
        reader.onloadend = () => {
          setHeroData({ ...data, image: reader.result });
        };
        reader.readAsDataURL(data.image);
      } else {
        setHeroData(data);
      }
      
      alert('Hero muvaffaqiyatli saqlandi!');
    } catch (error) {
      console.error('Hero saqlashda xatolik:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  // Stats'ni saqlash
  const handleSaveStats = async (data) => {
    try {
      const payload = {
        branch: branchId,
        page: 'home',
        section_id: 'hero-stats',
      };

      const contentData = {};
      Object.keys(data).forEach(key => {
        if (data[key] instanceof File) {
          payload[key] = data[key];
        } else {
          contentData[key] = data[key];
        }
      });

      const contentField = `content_${lang}`;
      payload[contentField] = JSON.stringify(contentData);

      await savePageSection(payload);
      setStatsData(data);
      alert('Stats muvaffaqiyatli saqlandi!');
    } catch (error) {
      console.error('Stats saqlashda xatolik:', error);
      alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  };

  const bgStyle = heroData.image 
    ? { backgroundImage: `url(${heroData.image})` }
    : { backgroundImage: `url(${schoolImg})` };

  return (
    <EditableSection
      sectionId="hero"
      data={heroData}
      onSave={handleSaveHero}
      buttonStyle={{ top: '80px', right: '20px' }}
    >
      <section className="hero">
        <div className="hero-bg-container" style={bgStyle}>
          <div className="hero-overlay" />
        </div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge fade-up">
              <span className="badge badge-primary">
                <Sparkles size={14} className="badge-icon" /> {heroData.subtitle}
              </span>
            </div>

            <h1 className="hero-title fade-up-d1">
              {heroData.vision.split(' ').slice(0, 5).join(' ')}{' '}
              <span className="text-gradient-vibrant">{heroData.vision.split(' ').slice(5, 9).join(' ')}</span>{' '}
              {heroData.vision.split(' ').slice(9).join(' ')}
            </h1>

            <p className="hero-sub fade-up-d2">{heroData.text}</p>

            <div className="hero-actions fade-up-d3">
              <div className="btn btn-primary">
                {heroData.cta} <ArrowRight size={18} />
              </div>
              <div className="btn btn-outline">
                {heroData.apply}
              </div>
            </div>

            <EditableSection
              sectionId="hero-stats"
              data={statsData}
              onSave={handleSaveStats}
              buttonStyle={{ bottom: '20px', right: '20px' }}
            >
              <div className="hero-stats fade-up-d3">
                {[
                  statsData.students,
                  statsData.teachers,
                  statsData.universities,
                  statsData.languages,
                ].map((s, idx) => (
                  <div key={idx} className="hero-stat">
                    <div className="hero-stat-val">{s.val}</div>
                    <div className="hero-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </EditableSection>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-dot" />
        </div>
      </section>
    </EditableSection>
  );
}

