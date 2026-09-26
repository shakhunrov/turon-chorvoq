import { useMemo, useState } from 'react';
import { Search, Trash2, Download } from 'lucide-react';
import api from '../../shared/api/adminTisApi';
import { downloadCsv, fmtDateTime } from '../../shared/admin/exportCsv';

const STATUSES = [
    ['new', 'Yangi'],
    ['read', "O'qildi"],
    ['replied', 'Javob berildi'],
    ['closed', 'Yopildi'],
];

export default function MessagesList({ contacts, reload }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');
    const [busy, setBusy] = useState(null);

    const rows = useMemo(() => contacts.filter((c) => {
        if (status !== 'All' && c.status !== status) return false;
        const q = search.toLowerCase();
        return !q || `${c.name} ${c.phone} ${c.email} ${c.message}`.toLowerCase().includes(q);
    }), [contacts, search, status]);

    const setRowStatus = async (c, next) => {
        setBusy(c.id);
        try { await api.patch(`/website-sources/contact/${c.id}/`, { status: next }); await reload(); } finally { setBusy(null); }
    };
    const remove = async (c) => {
        if (!window.confirm(`"${c.name}" murojaatini o'chirasizmi?`)) return;
        setBusy(c.id);
        try { await api.delete(`/website-sources/contact/${c.id}/`); await reload(); } finally { setBusy(null); }
    };

    const exportCsv = () => downloadCsv('murojaatlar', [
        { label: 'Ism', get: (r) => r.name },
        { label: 'Telefon', get: (r) => r.phone },
        { label: 'Email', get: (r) => r.email },
        { label: 'Tashkilot', get: (r) => r.organization },
        { label: "So'rov turi", get: (r) => r.enquiry_type },
        { label: 'Xabar', get: (r) => r.message },
        { label: 'Holati', get: (r) => (STATUSES.find(([k]) => k === r.status) || [])[1] || r.status },
        { label: 'Sana', get: (r) => fmtDateTime(r.created_at) },
    ], rows);

    return (
        <>
            <div className="admin-list-header">
                <div className="admin-search-wrap">
                    <Search size={16} className="admin-search-icon" />
                    <input className="admin-search" placeholder="Ism, telefon yoki xabar bo'yicha izlash…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="admin-filters">
                    {[['All', 'Barchasi'], ...STATUSES].map(([k, l]) => (
                        <button key={k} onClick={() => setStatus(k)} className={`admin-filter-btn ${status === k ? 'active' : ''}`}>{l}</button>
                    ))}
                </div>
                <button className="btn btn-outline" onClick={exportCsv} disabled={!rows.length} title="Excel'da ochiladigan CSV">
                    <Download size={16} /> Excel
                </button>
            </div>
            <div className="admin-table-wrap">
                <table className="admin-table">
                    <thead><tr><th>Kim</th><th>Xabar</th><th>Holati</th><th>Sana</th><th /></tr></thead>
                    <tbody>
                    {rows.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Murojaatlar topilmadi.</td></tr>}
                    {rows.map((c) => (
                        <tr key={c.id} style={busy === c.id ? { opacity: 0.5 } : undefined}>
                            <td>
                                <div className="post-title">{c.name}</div>
                                <div className="post-desc-short">{[c.phone, c.email, c.organization].filter(Boolean).join(' · ')}</div>
                            </td>
                            <td style={{ maxWidth: 380 }}><div className="post-desc-short" style={{ whiteSpace: 'normal' }}>{c.message}</div></td>
                            <td>
                                <select className="admin-search" style={{ width: 150 }} value={c.status} onChange={(e) => setRowStatus(c, e.target.value)}>
                                    {STATUSES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                                </select>
                            </td>
                            <td className="date-cell">{fmtDateTime(c.created_at)}</td>
                            <td><button className="action-btn delete" title="O'chirish" onClick={() => remove(c)}><Trash2 size={15} /></button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
