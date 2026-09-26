import { useCallback, useEffect, useState } from 'react';
import api from '../../shared/api/adminTisApi';

const EMPTY = { admissions: [], applications: [], contacts: [] };

// Filialning arizalari / CV'lari / murojaatlarini bir marta yuklab (har 60 soniyada yangilab)
// dashboard'ning "Bosh sahifa" statistikasi va sidebar'dagi yangi-belgi (badge) uchun beradi.
export function useFormsSummary(branchId) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const params = branchId ? { branch: branchId } : {};
    try {
      const [a, c, m] = await Promise.all([
        api.get('/website-sources/admin/admissions/', { params }),
        api.get('/website-sources/admin/careers/applications/', { params }),
        api.get('/website-sources/contact/', { params }),
      ]);
      setData({ admissions: a.data || [], applications: c.data || [], contacts: m.data || [] });
    } catch {
      /* sessiya tugagan bo'lsa adminTisApi o'zi login sahifasiga qaytaradi */
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, [load]);

  const pending = {
    admissions: data.admissions.filter((x) => x.status === 'pending').length,
    applications: data.applications.filter((x) => x.status === 'pending').length,
    contacts: data.contacts.filter((x) => x.status === 'new').length,
  };
  return { ...data, pending, loading, reload: load };
}
