export default function Section({ 
    children, 
    background = 'default',
    padding = 'default',
    className = ''
}) {
    const getBackgroundClasses = (bg) => {
        switch (bg) {
            case 'gradient':
                return 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900';
            case 'light':
                return 'bg-slate-50';
            case 'white':
                return 'bg-white';
            case 'dark':
                return 'bg-slate-900';
            default:
                return 'bg-white';
        }
    };

    const getPaddingClasses = (padding) => {
        switch (padding) {
            case 'small':
                return 'py-8 px-4 sm:px-6 lg:px-8';
            case 'large':
                return 'py-24 px-4 sm:px-6 lg:px-8';
            case 'none':
                return '';
            default:
                return 'py-16 px-4 sm:px-6 lg:px-8';
        }
    };

    return (
        <section className={`${getBackgroundClasses(background)} ${getPaddingClasses(padding)} ${className}`}>
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </section>
    );
}
