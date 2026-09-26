import { ArrowLeftRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../features/auth';
import './EditableText.css';

/**
 * Rasm va matn yonma-yon turadigan bo'lim uchun: admin "Joyini almashtirish" tugmasi bilan
 * rasm/matn tomonlarini almashtiradi. `flip` bo'lim ma'lumotida (data.flip) saqlanadi.
 *
 * Ishlatish: ota-elementga className={swapClass(data.flip)} qo'shing (position: relative bo'lsin)
 * va ichiga <SwapButton flipped={!!data.flip} onToggle={() => onSave({...data, flip: !data.flip})}/> qo'ying.
 */
export const swapClass = (flip) => (flip ? 'swap-sides' : '');

export function SwapButton({ flipped, onToggle }) {
    const editMode = useSelector(selectIsAuth);
    if (!editMode) return null;
    return (
        <button
            type="button"
            className={`swap-btn${flipped ? ' is-on' : ''}`}
            title="Rasm va matn joyini almashtirish"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
        >
            <ArrowLeftRight size={16}/>
        </button>
    );
}
