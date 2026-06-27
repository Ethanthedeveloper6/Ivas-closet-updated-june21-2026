const COLORS = ['#7c3aed', '#0d9488', '#db2777', '#2563eb', '#ea580c', '#16a34a', '#dc2626', '#9333ea'];

export function initials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function colorFor(name = '') {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ user, size = 40, className = '', style = {} }) {
    const dimension = { width: size, height: size, fontSize: size * 0.42 };

    if (user?.avatar) {
        return (
            <img
                src={user.avatar}
                alt={user.name}
                className={`avatar ${className}`}
                style={{ ...dimension, objectFit: 'cover', borderRadius: '50%', ...style }}
            />
        );
    }

    return (
        <span
            className={`avatar avatar-initials ${className}`}
            style={{
                ...dimension,
                background: colorFor(user?.name || ''),
                color: '#fff',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                lineHeight: 1,
                ...style,
            }}
        >
            {initials(user?.name)}
        </span>
    );
}
