import { UserPlus, FileText, MessageSquare, CalendarDays, Clock, Inbox, ChevronRight } from 'lucide-react';
import { fmtDateTime } from '../../shared/admin/exportCsv';

const parse = (iso) => {
    if (!iso) return null;
    const d = new Date(iso.endsWith('Z') || /[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
    return Number.isNaN(d.getTime()) ? null : d;
};
const dayKey = (d) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' });

const TYPES = {
    admission: { label: 'Qabul arizasi', view: 'adm-list', Icon: UserPlus, color: '#4f46e5' },
    application: { label: 'CV / ish arizasi', view: 'app-list', Icon: FileText, color: '#0ea5e9' },
    contact: { label: 'Murojaat', view: 'msg-list', Icon: MessageSquare, color: '#f59e0b' },
};

const STATUS_ROWS = [
    ['pending', 'Kutilmoqda', '#f59e0b'],
    ['contacted', "Bog'lanildi", '#0ea5e9'],
    ['enrolled', 'Qabul qilindi', '#10b981'],
    ['rejected', 'Rad etildi', '#ef4444'],
];

export default function DashboardOverview({ summary, onGo }) {
    const { admissions, applications, contacts, pending, loading } = summary;

    const all = [
        ...admissions.map((x) => ({ ...x, kind: 'admission', title: x.student_name, sub: x.grade ? `${x.grade}` : '' })),
        ...applications.map((x) => ({ ...x, kind: 'application', title: x.name, sub: x.email || '' })),
        ...contacts.map((x) => ({ ...x, kind: 'contact', title: x.name, sub: (x.message || '').slice(0, 60) })),
    ]
        .map((x) => ({ ...x, at: parse(x.created_at) }))
        .filter((x) => x.at)
        .sort((a, b) => b.at - a.at);

    const now = new Date();
    const today = dayKey(now);
    const weekAgo = now.getTime() - 7 * 24 * 3600 * 1000;
    const todayCount = all.filter((x) => dayKey(x.at) === today).length;
    const weekCount = all.filter((x) => x.at.getTime() >= weekAgo).length;

    const stat = (Icon, color, val, label, go) => (
        <div className="admin-stat-card" style={go ? { cursor: 'pointer' } : undefined} onClick={go}>
            <Icon size={22} style={{ color }} />
            <div className="stat-info"><div className="stat-val">{loading ? '…' : val}</div><div className="stat-label">{label}</div></div>
        </div>
    );

    const byStatus = (s) => admissions.filter((a) => a.status === s).length;
    const total = admissions.length || 1;

    return (
        <>
            <div className="admin-stats">
                {stat(CalendarDays, '#4f46e5', todayCount, 'Bugun kelgan (ariza, CV, murojaat)')}
                {stat(Clock, '#0ea5e9', weekCount, 'Oxirgi 7 kun')}
                {stat(UserPlus, '#f59e0b', pending.admissions, 'Javob kutayotgan qabul arizalari', () => onGo('adm-list'))}
                {stat(Inbox, '#ef4444', pending.contacts + pending.applications, 'Yangi murojaat va CV', () => onGo(pending.contacts ? 'msg-list' : 'app-list'))}
            </div>

            <div className="ov-grid">
                <div className="admin-table-wrap ov-recent">
                    <div className="ov-title">Oxirgi kelganlar</div>
                    {all.length === 0 && !loading && <div className="ov-empty">Hozircha hech narsa kelmagan.</div>}
                    {all.slice(0, 10).map((x) => {
                        const T = TYPES[x.kind];
                        return (
                            <button key={`${x.kind}-${x.id}`} className="ov-row" onClick={() => onGo(T.view)}>
                                <span className="ov-ico" style={{ background: `${T.color}18`, color: T.color }}><T.Icon size={16} /></span>
                                <span className="ov-main">
                                    <b>{x.title}</b>
                                    <small>{T.label}{x.phone ? ` · ${x.phone}` : ''}{x.sub ? ` · ${x.sub}` : ''}</small>
                                </span>
                                <span className="ov-date">{fmtDateTime(x.created_at)}</span>
                                <ChevronRight size={16} style={{ color: '#94a3b8' }} />
                            </button>
                        );
                    })}
                </div>

                <div className="admin-table-wrap ov-status">
                    <div className="ov-title">Qabul arizalari holati</div>
                    {STATUS_ROWS.map(([key, label, color]) => (
                        <div key={key} className="ov-bar-row">
                            <div className="ov-bar-top"><span>{label}</span><b>{byStatus(key)}</b></div>
                            <div className="ov-bar"><div style={{ width: `${(byStatus(key) / total) * 100}%`, background: color }} /></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
