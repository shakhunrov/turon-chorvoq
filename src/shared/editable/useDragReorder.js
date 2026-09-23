import { useState } from 'react';
import './dragReorder.css';

/**
 * useDragReorder - mavjud .map() bilan chizilgan kartalar ustiga sudrab-tartiblash
 * qo'shish uchun kichik yordamchi (EditableList'dan farqli — bu yerda add/edit/delete
 * o'z formasi allaqachon bor, faqat TARTIBNI o'zgartirish kerak).
 *
 * @param {any[]} items
 * @param {(next: any[]) => void} onReorder - yangi tartibni saqlash (masalan handleSaveSection chaqiradi)
 * @returns {{ itemProps: (index:number) => object, gripProps: (index:number) => object, dragIndex: number|null }}
 */
export function useDragReorder(items, onReorder) {
    const [dragIndex, setDragIndex] = useState(null);
    const [overIndex, setOverIndex] = useState(null);

    const itemProps = (index) => ({
        onDragOver: (e) => {
            if (dragIndex === null) return;
            e.preventDefault();
            if (overIndex !== index) setOverIndex(index);
        },
        onDrop: (e) => {
            if (dragIndex === null) return;
            e.preventDefault();
            if (dragIndex !== index) {
                const next = [...items];
                const [moved] = next.splice(dragIndex, 1);
                next.splice(index, 0, moved);
                onReorder(next);
            }
            setDragIndex(null);
            setOverIndex(null);
        },
        dragClassName: [
            dragIndex === index ? 'drag-reorder-dragging' : '',
            overIndex === index && dragIndex !== null && dragIndex !== index ? 'drag-reorder-over' : '',
        ].filter(Boolean).join(' '),
    });

    const gripProps = (index) => ({
        draggable: true,
        onDragStart: (e) => {
            setDragIndex(index);
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', String(index)); } catch { /* ignore */ }
        },
        onDragEnd: () => {
            setDragIndex(null);
            setOverIndex(null);
        },
    });

    return { itemProps, gripProps, dragIndex };
}
