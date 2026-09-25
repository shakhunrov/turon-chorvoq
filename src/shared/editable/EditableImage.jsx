import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { ImagePlus } from 'lucide-react';
import { selectIsAuth } from '../../features/auth';
import { showToast } from '../toast/toast';
import './EditableText.css';

/**
 * EditableImage - rasm yonida kichik tugma: bosilsa fayl tanlanadi va onSave(file) chaqiriladi.
 * Butun section'ni qamrab oluvchi katta pen o'rniga faqat shu rasm uchun.
 */
export default function EditableImage({ children, onSave, alwaysVisible = false, style }) {
    const isEditableMode = useSelector(selectIsAuth);
    const inputRef = useRef(null);

    if (!isEditableMode) return children;

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        if (file.size > 3 * 1024 * 1024) {
            showToast('Rasm hajmi 3MB dan oshmasligi kerak');
            return;
        }
        onSave(file);
    };

    return (
        <div className={`editable-image-wrap${alwaysVisible ? ' always-visible' : ''}`} style={style}>
            {children}
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            <button
                type="button"
                className="editable-image-pen"
                title="Rasmni almashtirish"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
            >
                <ImagePlus size={16} />
            </button>
        </div>
    );
}
