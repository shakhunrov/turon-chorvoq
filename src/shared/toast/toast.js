// Oddiy global toast — React context shart emas, chunki bu funksiyani ko'plab
// alohida joylardagi hook/komponentlar (useEditableSections va h.k.) chaqiradi.
// showToast(...) shunchaki hodisa yuboradi, ToastHost (App.jsx da bir marta
// o'rnatilgan) uni tinglab, ko'rsatadi.
export function showToast(message, type = 'error') {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type } }));
}
