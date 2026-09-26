import EditableText from './EditableText';

/**
 * makeTx(sections, save) — sahifadagi qattiq yozilgan (i18n/hardcoded) qisqa matnlar va tugma
 * yozuvlari uchun tahrirlash yordamchisi. `tx("kalit", "Standart matn")` oddiy foydalanuvchiga
 * matnni, adminga esa matn + pen tugmasini qaytaradi. O'zgargan matnlar sahifaning "texts"
 * bo'limida (til bo'yicha alohida) saqlanadi.
 */
export function makeTx(sections, save) {
    const texts = sections?.texts || {};
    return (key, def, props = {}) => (
        <EditableText
            value={texts[key] || def}
            onSave={(v) => save('texts', { ...texts, [key]: v })}
            label="Matn"
            {...props}
        />
    );
}

/**
 * makeLst(sections, save) — ro'yxatlar uchun: `lst("kalit", standartRoyxat)` → { items, onSave }.
 * Saqlangan ro'yxat bo'lsa u, bo'lmasa standart ro'yxat qaytadi ("lists" bo'limida saqlanadi).
 */
export function makeLst(sections, save) {
    const lists = sections?.lists || {};
    return (key, def) => ({
        items: lists[key] || def,
        onSave: (items) => save('lists', { ...lists, [key]: items }),
    });
}
