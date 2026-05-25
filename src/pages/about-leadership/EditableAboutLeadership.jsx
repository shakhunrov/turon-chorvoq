import { useState } from 'react';
import { useLang } from '../../shared/i18n';
import { EditableSection, EditableList } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import { savePageSection } from '../../shared/api/pageSections';
import directorImg from '../../shared/assets/img/director.png';
import './AboutLeadership.css';

export default function EditableAboutLeadership() {
  const { t } = useLang();
  const l = t.about.leadership;
  const branchId = localStorage.getItem('globalBranchId');
  const [uploading, setUploading] = useState(false);

  const { sections, handleSaveSection } = useEditableSections('about-leadership', {
    hero: {
      label: 'Biz haqimizda',
      title: l.title,
    },
    director: {
      name: l.directorName,
      title: l.directorTitle,
      message: l.directorMessage,
      image: directorImg,
    },
    board: {
      title: l.boardTitle,
      desc: l.boardDesc,
      members: [
        { name: 'Board Member 1', role: 'Academic Advisor', avatar: '👤' },
        { name: 'Board Member 2', role: 'Academic Advisor', avatar: '👤' },
        { name: 'Board Member 3', role: 'Academic Advisor', avatar: '👤' },
        { name: 'Board Member 4', role: 'Academic Advisor', avatar: '👤' },
      ],
    },
  });

  /* ── Board member image upload ── */
  const handleSaveBoardMembers = async (newMembers) => {
    try {
      setUploading(true);
      const processedMembers = await Promise.all(
        newMembers.map(async (member) => {
          if (member.avatar instanceof File) {
            const formData = new FormData();
            formData.append('branch', branchId);
            formData.append('page', 'about-leadership');
            formData.append('section_id', 'board');
            formData.append('image', member.avatar);
            try {
              const response = await savePageSection(formData, true);
              const imageUrl = response.image || response.url || response.file;
              return { ...member, avatar: imageUrl };
            } catch (error) {
              console.error('Rasm yuklashda xatolik:', error);
              return { ...member, avatar: '👤' };
            }
          }
          return member;
        })
      );
      await handleSaveSection('board', { ...sections.board, members: processedMembers });
    } catch (error) {
      console.error('Board members saqlashda xatolik:', error);
      alert("Xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setUploading(false);
    }
  };

  const directorPhoto =
    typeof sections.director.image === 'string' && sections.director.image
      ? sections.director.image
      : directorImg;

  return (
    <div className="page ls-page">

      {/* ════════════════════════════════════════
          CINEMATIC HERO  (director photo + title)
      ════════════════════════════════════════ */}
      <EditableSection
        sectionId="hero"
        data={sections.hero}
        onSave={(data) => handleSaveSection('hero', data)}
      >
        <div className="ls-hero">
          <div className="ls-hero-mesh" />
          <div className="ls-orb ls-orb-1" />
          <div className="ls-orb ls-orb-2" />

          <div className="container ls-hero-inner">
            {/* Left: director photo with gold rings */}
            <div className="ls-hero-photo-col">
              <div className="ls-director-frame">
                <div className="ls-ring ls-ring-1" />
                <div className="ls-ring ls-ring-2" />
                <div className="ls-ring ls-ring-3" />
                <img
                  src={directorPhoto}
                  alt={sections.director.name}
                  className="ls-director-photo"
                />
              </div>
              <div className="ls-hero-role-badge">
                <span className="ls-role-dot" />
                {sections.director.title}
              </div>
            </div>

            {/* Right: name + subtitle */}
            <div className="ls-hero-text-col">
              <span className="ls-eyebrow">{sections.hero.label}</span>
              <h1 className="ls-hero-name">{sections.director.name}</h1>
              <div className="ls-hero-title-line" />
              <p className="ls-hero-subtitle">{sections.hero.title}</p>
            </div>
          </div>

          <div className="ls-scroll-hint">↓</div>
        </div>
      </EditableSection>

      {/* ════════════════════════════════════════
          DIRECTOR QUOTE
      ════════════════════════════════════════ */}
      <EditableSection
        sectionId="director"
        data={sections.director}
        onSave={(data) => handleSaveSection('director', data)}
      >
        <div className="ls-quote-section">
          <div className="container">
            <div className="ls-quote-card">
              <div className="ls-giant-quote">"</div>
              <div className="ls-quote-inner">
                <p className="ls-quote-text">{sections.director.message}</p>
                <div className="ls-quote-sig">
                  <div className="ls-sig-line" />
                  <div>
                    <div className="ls-sig-name">{sections.director.name}</div>
                    <div className="ls-sig-role">{sections.director.title}</div>
                  </div>
                </div>
              </div>
              <div className="ls-quote-bottom-strip" />
            </div>
          </div>
        </div>
      </EditableSection>

      {/* ════════════════════════════════════════
          ADVISORY BOARD
      ════════════════════════════════════════ */}
      <EditableSection
        sectionId="board"
        data={sections.board}
        onSave={(data) => handleSaveSection('board', data)}
      >
        {/* Board intro */}
        <section className="ls-board-intro-section">
          <div className="container">
            <div className="ls-board-intro">
              <div className="ls-board-intro-left">
                <span className="ls-section-eyebrow">Bizning Jamoamiz</span>
                <h2 className="ls-board-title">{sections.board.title}</h2>
              </div>
              <p className="ls-board-desc-text">{sections.board.desc}</p>
            </div>
          </div>
        </section>

        {/* Board member cards */}
        <section className="ls-teachers-section">
          <div className="container">
            <div className="ls-board-members">
              <EditableList
                items={sections.board.members}
                onSave={handleSaveBoardMembers}
                renderItem={(member, i) => (
                  <div className="ls-board-card">
                    <div className="ls-board-photo">
                      {typeof member.avatar === 'string' &&
                      (member.avatar.startsWith('http') || member.avatar.startsWith('/')) ? (
                        <>
                          <img src={member.avatar} alt={member.name} />
                          <div className="ls-board-photo-overlay" />
                        </>
                      ) : (
                        <div className="ls-board-emoji-wrap">
                          <div className="ls-board-emoji-icon">
                            {typeof member.avatar === 'string' ? member.avatar : '👤'}
                          </div>
                        </div>
                      )}
                      <div className="ls-board-index-badge">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="ls-board-info">
                      <div className="ls-board-name">{member.name}</div>
                      <div className="ls-board-role">{member.role}</div>
                    </div>
                  </div>
                )}
                defaultItem={{ name: '', role: 'Academic Advisor', avatar: '👤' }}
                itemName="Kengash a'zosi"
              />
              {uploading && (
                <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-secondary)' }}>
                  Rasmlar yuklanmoqda...
                </div>
              )}
            </div>
          </div>
        </section>
      </EditableSection>

      {/* ════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="ls-cta-banner">
            <div className="ls-cta-mesh" />
            <div className="ls-cta-orb" />
            <div className="ls-cta-inner">
              <h2 className="ls-cta-title">Jamoamiz bilan bog'laning</h2>
              <p className="ls-cta-sub">Savollaringiz bormi? Biz har doim yordam berishga tayyormiz.</p>
              <a href="/contact" className="btn btn-primary ls-cta-btn">
                Bog'lanish →
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
