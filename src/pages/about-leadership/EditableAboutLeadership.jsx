import { useState } from 'react';
import { useLang } from '../../shared/i18n';
import { EditableList, EditableText, EditableImage, makeTx, SwapButton, swapClass } from '../../shared/editable';
import { useEditableSections } from '../../shared/api/useEditableSections';
import { savePageSection } from '../../shared/api/pageSections';
import { showToast } from '../../shared/toast/toast';
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
      showToast("Saqlashda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    } finally {
      setUploading(false);
    }
  };

  const directorPhoto =
    typeof sections.director.image === 'string' && sections.director.image
      ? sections.director.image
      : sections.director.image instanceof File
        ? URL.createObjectURL(sections.director.image)
        : directorImg;

  const tx = makeTx(sections, handleSaveSection);

  return (
    <div className="page ls-page">

      {/* ════════════════════════════════════════
          CINEMATIC HERO  (director photo + title)
      ════════════════════════════════════════ */}
      <>
        <div className="ls-hero">
          <div className="ls-hero-mesh" />
          <div className="ls-orb ls-orb-1" />
          <div className="ls-orb ls-orb-2" />

          <div className={`container ls-hero-inner ${swapClass(sections.director.flip)}`} style={{ position: 'relative' }}>
            <SwapButton flipped={!!sections.director.flip} onToggle={() => handleSaveSection('director', { ...sections.director, flip: !sections.director.flip })} />
            {/* Left: director photo with gold rings */}
            <div className="ls-hero-photo-col">
              <EditableImage onSave={(file) => handleSaveSection('director', { ...sections.director, image: file })}>
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
              </EditableImage>
              <div className="ls-hero-role-badge">
                <span className="ls-role-dot" />
                <EditableText value={sections.director.title} onSave={(v) => handleSaveSection('director', { ...sections.director, title: v })} label="Lavozim" />
              </div>
            </div>

            {/* Right: name + subtitle */}
            <div className="ls-hero-text-col">
              <span className="ls-eyebrow"><EditableText value={sections.hero.label} onSave={(v) => handleSaveSection('hero', { ...sections.hero, label: v })} label="Yorliq" /></span>
              <h1 className="ls-hero-name"><EditableText value={sections.director.name} onSave={(v) => handleSaveSection('director', { ...sections.director, name: v })} label="Ism" /></h1>
              <div className="ls-hero-title-line" />
              <p className="ls-hero-subtitle"><EditableText value={sections.hero.title} onSave={(v) => handleSaveSection('hero', { ...sections.hero, title: v })} label="Sarlavha" multiline /></p>
            </div>
          </div>

          <div className="ls-scroll-hint">↓</div>
        </div>
      </>

      {/* ════════════════════════════════════════
          DIRECTOR QUOTE
      ════════════════════════════════════════ */}
      <>
        <div className="ls-quote-section">
          <div className="container">
            <div className="ls-quote-card">
              <div className="ls-giant-quote">"</div>
              <div className="ls-quote-inner">
                <p className="ls-quote-text"><EditableText value={sections.director.message} onSave={(v) => handleSaveSection('director', { ...sections.director, message: v })} label="Xabar" multiline /></p>
                <div className="ls-quote-sig">
                  <div className="ls-sig-line" />
                  <div>
                    <div className="ls-sig-name"><EditableText value={sections.director.name} onSave={(v) => handleSaveSection('director', { ...sections.director, name: v })} label="Ism" /></div>
                    <div className="ls-sig-role"><EditableText value={sections.director.title} onSave={(v) => handleSaveSection('director', { ...sections.director, title: v })} label="Lavozim" /></div>
                  </div>
                </div>
              </div>
              <div className="ls-quote-bottom-strip" />
            </div>
          </div>
        </div>
      </>

      {/* ════════════════════════════════════════
          ADVISORY BOARD
      ════════════════════════════════════════ */}
      <>
        {/* Board intro */}
        <section className="ls-board-intro-section">
          <div className="container">
            <div className="ls-board-intro">
              <div className="ls-board-intro-left">
                <span className="ls-section-eyebrow">{tx('boardLabel', 'Bizning Jamoamiz')}</span>
                <h2 className="ls-board-title"><EditableText value={sections.board.title} onSave={(v) => handleSaveSection('board', { ...sections.board, title: v })} label="Sarlavha" /></h2>
              </div>
              <p className="ls-board-desc-text"><EditableText value={sections.board.desc} onSave={(v) => handleSaveSection('board', { ...sections.board, desc: v })} label="Matn" multiline /></p>
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
      </>

      {/* ════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div className="ls-cta-banner">
            <div className="ls-cta-mesh" />
            <div className="ls-cta-orb" />
            <div className="ls-cta-inner">
              <h2 className="ls-cta-title">{tx('ctaTitle', "Jamoamiz bilan bog'laning")}</h2>
              <p className="ls-cta-sub">{tx('ctaSub', 'Savollaringiz bormi? Biz har doim yordam berishga tayyormiz.', { multiline: true })}</p>
              <a href="/contact" className="btn btn-primary ls-cta-btn">
                {tx('ctaBtn', "Bog'lanish →")}
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
