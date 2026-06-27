import { useToast } from '../context/ToastContext';

export default function ToastContainer() {
    const { toasts } = useToast();

    if (!toasts.length) return null;

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast ${t.type}`}>
                    <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span> {t.msg}
                </div>
            ))}
        </div>
    );
}
