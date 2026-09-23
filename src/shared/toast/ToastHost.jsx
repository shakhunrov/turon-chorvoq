import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import './ToastHost.css';

let nextId = 1;

// App.jsx da bir marta o'rnatiladi — showToast() qayerdan chaqirilishidan qat'i
// nazar (hook ichida ham) xabar shu yerda ko'rinadi.
export default function ToastHost() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const onToast = (e) => {
            const id = nextId++;
            const { message, type = 'error' } = e.detail || {};
            if (!message) return;
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
        };
        window.addEventListener('app-toast', onToast);
        return () => window.removeEventListener('app-toast', onToast);
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="app-toast-host">
            {toasts.map((t) => (
                <div key={t.id} className={`app-toast app-toast-${t.type}`}>
                    {t.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                    <span>{t.message}</span>
                    <button
                        type="button"
                        className="app-toast-close"
                        onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
}
