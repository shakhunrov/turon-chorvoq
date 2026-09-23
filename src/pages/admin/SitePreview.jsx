import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, RotateCcw, RefreshCw } from 'lucide-react';

const DESKTOP_WIDTH = 1440;
const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 1.5;

// Sayt admin panel ichida — yangi bland ochilmaydi. Iframe bir xil domenda
// bo'lgani uchun (masalan chirchiq.tisedu.uz/editable/) login holati (localStorage)
// avtomatik baham ko'riladi — pensillar shu yerning o'zida ham ishlaydi.
// Kattalashtirish shunchaki CSS transform: scale — Figma emas, lekin ko'rish/tekshirish
// uchun qulay: kichraytirib butun sahifani ko'rish, kattalashtirib detallarni tekshirish.
export default function SitePreview() {
    const [zoom, setZoom] = useState(1);
    const [reloadTick, setReloadTick] = useState(0);
    const [frameHeight, setFrameHeight] = useState(2000);
    const iframeRef = useRef(null);

    const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)));
    const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)));
    const zoomReset = () => setZoom(1);

    const measure = () => {
        try {
            const doc = iframeRef.current?.contentWindow?.document;
            if (doc?.documentElement) {
                setFrameHeight(Math.max(doc.documentElement.scrollHeight, 800));
            }
        } catch {
            // Boshqa domen bo'lsa (kross-origin) o'lchab bo'lmaydi — standart balandlik qoladi
        }
    };

    // Iframe ichidagi sahifa o'zgarsa (SPA navigatsiya) balandlikni vaqti-vaqti bilan qayta o'lchaymiz
    useEffect(() => {
        const id = setInterval(measure, 1000);
        return () => clearInterval(id);
    }, []);

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
                <div className="pgsec-preview-canvas" style={{ width: DESKTOP_WIDTH * zoom, height: frameHeight * zoom }}>
                    <iframe
                        key={reloadTick}
                        ref={iframeRef}
                        src="/editable/"
                        title="Sayt ko'rinishi"
                        style={{
                            width: DESKTOP_WIDTH,
                            height: frameHeight,
                            transform: `scale(${zoom})`,
                            transformOrigin: 'top left',
                            border: 'none',
                        }}
                        onLoad={() => setTimeout(measure, 400)}
                    />
                </div>
            </div>
        </div>
    );
}
