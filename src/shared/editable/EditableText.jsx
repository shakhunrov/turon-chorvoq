import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { Edit2, Save, X } from 'lucide-react';
import { selectIsAuth } from '../../features/auth';
import './EditableList.css';
import './EditableText.css';

/**
 * EditableText - bitta matn maydonini (masalan section sarlavhasi) tahrirlash uchun,
 * butun section'ni qamrab oluvchi katta pen o'rniga, matnning o'zi yonida kichik pen tugmasi.
 * Ro'yxat (EditableList) allaqachon o'z pen/o'chirish/sudrash tugmalariga ega bo'lgan
 * section'larda, qolgan yagona matn maydoni (masalan title) uchun ishlatiladi.
 */
export default function EditableText({ value, onSave, as: Tag = 'span', className, multiline = false, label = 'Matn' }) {
    const isEditableMode = useSelector(selectIsAuth);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(value || '');

    if (!isEditableMode) {
        return <Tag className={className}>{value}</Tag>;
    }

    const handleOpen = () => {
        setText(value || '');
        setIsEditing(true);
    };

    const handleClose = () => setIsEditing(false);

    const handleSave = () => {
        onSave(text);
        handleClose();
    };

    return (
        <span className="editable-text-wrap">
            <Tag className={className}>{value}</Tag>
            <button type="button" className="editable-text-pen" onClick={handleOpen} title="Tahrirlash">
                <Edit2 size={14} />
            </button>

            {isEditing && createPortal(
                <div className="edit-modal-overlay" onClick={handleClose}>
                    <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="edit-modal-header">
                            <h3>Tahrirlash</h3>
                            <button className="modal-close-btn" onClick={handleClose}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className="edit-modal-body">
                            <div className="form-group">
                                <label className="form-label">{label}</label>
                                {multiline ? (
                                    <textarea
                                        className="form-input"
                                        rows={4}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="edit-modal-footer">
                            <button type="button" className="btn btn-outline" onClick={handleClose}>
                                Bekor qilish
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>
                                <Save size={16} />
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </span>
    );
}
