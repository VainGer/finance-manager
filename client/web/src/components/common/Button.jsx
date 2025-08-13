import { motion } from "framer-motion";

export default function Button({
    onClick,
    children,
    style = 'primary',
    disabled = false,
    type = 'button',
    fullWidth = false,
    className = '',
    bg
}) {
    // Generate hover class from bg class using string manipulation
    const getHoverClass = (bgClass) => {
        if (!bgClass || typeof bgClass !== 'string') return '';

        const colorMatch = bgClass.match(/^bg-([a-z]+)-([0-9]+)$/);
        if (colorMatch) {
            const [_, color, shade] = colorMatch;
            const nextShade = parseInt(shade) + 100;

            if (nextShade <= 950) {
                return `hover:bg-${color}-${nextShade}`;
            }
        }

        return '';
    };

    const getButtonStyle = (style) => {
        if (bg) {
            const hoverClass = getHoverClass(bg);

            switch (style) {
                case 'primary':
                    return `${bg} text-white ${hoverClass} focus:ring-blue-400`;
                case 'secondary':
                    return `${bg} text-gray-800 ${hoverClass} focus:ring-gray-300`;
                case 'success':
                    return `${bg} text-white ${hoverClass} focus:ring-green-400`;
                case 'danger':
                    return `${bg} text-white ${hoverClass} focus:ring-red-400`;
                case 'warning':
                    return `${bg} text-white ${hoverClass} focus:ring-yellow-400`;
                case 'info':
                    return `${bg} text-white ${hoverClass} focus:ring-indigo-400`;
                case 'outline':
                    return `${bg} ${hoverClass} focus:ring-blue-300`;
                case 'link':
                    return `${bg} text-blue-500 hover:underline hover:text-blue-700 p-0`;
                default:
                    return `${bg} text-white ${hoverClass} focus:ring-blue-400`;
            }
        }

        switch (style) {
            case 'primary':
                return 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400';
            case 'secondary':
                return 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300';
            case 'success':
                return 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400';
            case 'danger':
                return 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400';
            case 'warning':
                return 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400';
            case 'info':
                return 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-400';
            case 'outline':
                return 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-300';
            case 'link':
                return 'bg-transparent text-blue-500 hover:underline hover:text-blue-700 p-0';
            case 'side-menu':
                return 'w-full text-right py-2 px-4 rounded-md text-gray-700 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex items-center';
            default:
                return 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400';
        }
    };

    const buttonClass = `
        ${getButtonStyle(style)} 
        ${fullWidth ? 'w-full' : ''} 
        ${style !== 'link' ? 'px-6 py-2 rounded-lg shadow-sm' : ''}
        w-full
        font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
    `.trim();

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            type={type}
            whileHover={!disabled ? { scale: 1.03 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            transition={{ ease: 'easeInOut', duration: 0.2 }}
            className={buttonClass}
        >
            {children}
        </motion.button>
    );
}