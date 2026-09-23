import { useState } from 'react';
import { Minus, Plus, RotateCcw, RefreshCw } from 'lucide-react';

const DESKTOP_WIDTH = 1440;
const IFRAME_HEIGHT = 900; // Oddiy brauzer oynasi balandligiga o'xshash — ichida o'zining tabiiy skrolli bo'ladi
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;

// Sayt admin panel ichida — yangi bland ochilmaydi. Iframe bir xil domenda
// bo'lgani uchun (masalan chirchiq.tisedu.uz/editable/) login holati (localStorage)
// avtomatik baham ko'riladi — pensillar shu yerning o'zida ham ishlaydi.
// Kattalashtirish shunchaki CSS transform: scale — Figma emas, lekin ko'rish/tekshirish
// uchun qulay: kichraytirib butun sahifani ko'rish, kattalashtirib detallarni tekshirish.
//
// Diqqat: iframe balandligini saytning haqiqiy tarkib balandligiga moslab avtomatik
// o'zgartirib turish ATAYLAB ishlatilmaydi — sinovda ma'lum bo'ldiki, saytdagi ba'zi
// bo'limlar `100vh` (ya'ni "iframe balandligi") ga bog'liq, shuning uchun bunday avtomatik
// moslashtirish o'z-o'zini kuchaytiruvchi halqaga aylanib, har safar ochilganda sahifa
// tobora "cho'zilib" ketardi. Shuning uchun iframe qat'iy balandlikda — ichida oddiy
// brauzerdagidek pastga skroll qilinadi.
export default function SitePreview() {
    const [zoom, setZoom] = useState(1);
    const [reloadTick, setReloadTick] = useState(0);

    const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
    const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
    const zoomReset = () => setZoom(1);

    return (
        <div className="pgsec-preview">
            <div className="pgsec-preview-toolbar">
                <button type="button" className="btn btn-outline" onClick={zoomOut} disabled={zoom <= MIN_ZOOM} title="Kichraytirish">
                    <Minus size={15} />
                </button>
                <span className="pgsec-preview-zoom">{Math.round(zoom * 100)}%</span>
                <button type="button" className="btn btn-outline" onClick={zoomIn} disabled={zoom >= MAX_ZOOM} title="Kattalashtirish">
                    <Plus size={15} />
                </button>
                <button type="button" className="btn btn-outline" onClick={zoomReset} title="Asl o'lcham">
                    <RotateCcw size={15} />
                </button>
                <span style={{ flex: 1 }} />
                <button type="button" className="btn btn-outline" onClick={() => setReloadTick((t) => t + 1)} title="Yangilash">
                    <RefreshCw size={15} /> Yangilash
                </button>
            </div>

            <div className="pgsec-preview-viewport">
                <div className="pgsec-preview-canvas" style={{ width: DESKTOP_WIDTH * zoom, height: IFRAME_HEIGHT * zoom }}>
                    <iframe
                        key={reloadTick}
                        src="/editable/"
                        title="Sayt ko'rinishi"
                        style={{
                            width: DESKTOP_WIDTH,
                            height: IFRAME_HEIGHT,
                            transform: `scale(${zoom})`,
                            transformOrigin: 'top left',
                            border: 'none',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
