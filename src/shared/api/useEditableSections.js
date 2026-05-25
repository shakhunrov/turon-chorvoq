import { useState, useEffect, useRef } from 'react';
import { getPageSections, savePageSection } from './pageSections';
import { useLang } from '../i18n';

/**
 * useEditableSections - Editable sections uchun custom hook
 *
 * @param {string} pageName - Sahifa nomi (home, education, about-vision, etc.)
 * @param {object} defaultSections - Default section ma'lumotlari (joriy tilda)
 * @returns {object} { sections, handleSaveSection }
 */
export function useEditableSections(pageName, defaultSections) {
    const branchId = localStorage.getItem('globalBranchId');
    const { lang } = useLang();
    const [sections, setSections] = useState(defaultSections);

    // defaultSections har render da yangilanishi mumkin (t dan keladi),
    // lekin uni dependency array ga qo'yib bo'lmaydi (infinite loop).
    // Ref orqali har doim oxirgi qiymatini olamiz.
    const defaultsRef = useRef(defaultSections);
    useEffect(() => {
        defaultsRef.current = defaultSections;
    });

    useEffect(() => {
        const loadSections = async () => {
            // Avval joriy til uchun default tarjimalarni qo'yamiz.
            // Shunday qilib, API content bo'sh bo'lsa ham to'g'ri til ko'rinadi.
            const base = defaultsRef.current;
            setSections(base);

            try {
                const data = await getPageSections({ branch: branchId, page: pageName });
                if (data && data.length > 0) {
                    const apiSections = {};
                    data.forEach(section => {
                        try {
                            const contentField = `content_${lang}`;
                            let content = section[contentField];

                            if (typeof content === 'string') {
                                content = JSON.parse(content);
                            }

                            if (content && Object.keys(content).length > 0) {
                                // Default + API content: API ustunlik qiladi
                                apiSections[section.section_id] = {
                                    ...(base[section.section_id] || {}),
                                    ...content,
                                };

                                if (section.image) {
                                    apiSections[section.section_id].image = section.image;
                                }
                            }
                        } catch (e) {
                            console.error(`Section ${section.section_id} parse error:`, e);
                        }
                    });

                    // API dan kelgan sectionlarni default ustiga qo'yamiz
                    if (Object.keys(apiSections).length > 0) {
                        setSections(prev => ({ ...prev, ...apiSections }));
                    }
                }
            } catch (error) {
                console.error('Section ma\'lumotlarini yuklashda xatolik:', error);
            }
        };
        loadSections();
    }, [branchId, pageName, lang]);

    const handleSaveSection = async (sectionId, data) => {
        try {
            const payload = {
                branch: branchId,
                page: pageName,
                section_id: sectionId,
            };

            // Agar data ichida File obyekti bo'lsa, uni alohida yuboramiz
            const contentData = {};

            Object.keys(data).forEach(key => {
                if (data[key] instanceof File) {
                    // File obyektini to'g'ridan-to'g'ri payload'ga qo'shamiz
                    payload[key] = data[key];
                } else {
                    contentData[key] = data[key];
                }
            });

            // Content'ni til uchun saqlash
            const contentField = `content_${lang}`;
            payload[contentField] = JSON.stringify(contentData);

            await savePageSection(payload);
            setSections(prev => ({ ...prev, [sectionId]: data }));
            alert('Section muvaffaqiyatli saqlandi!');
        } catch (error) {
            console.error('Section saqlashda xatolik:', error);
            alert('Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        }
    };

    return { sections, handleSaveSection, setSections };
}
