// Jadvalni Excel'da ochiladigan CSV (UTF-8 BOM, ";" ajratgich) qilib yuklab olish.
// Excel o'zbek/rus sozlamalarida ";" ni ustun ajratgich sifatida taniydi, BOM esa
// kirill/lotin harflarni to'g'ri ko'rsatadi.
const esc = (v) => {
  const s = v === null || v === undefined ? '' : String(v).replace(/\r?\n/g, ' ');
  return /[";]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/**
 * @param {string} filename - masalan "arizalar"
 * @param {{label: string, get: (row) => any}[]} columns
 * @param {object[]} rows
 */
export function downloadCsv(filename, columns, rows) {
  const head = columns.map((c) => esc(c.label)).join(';');
  const body = rows.map((r) => columns.map((c) => esc(c.get(r))).join(';')).join('\r\n');
  const blob = new Blob(['\ufeff' + head + '\r\n' + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const fmtDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso.endsWith('Z') || /[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent', hour12: false });
};
