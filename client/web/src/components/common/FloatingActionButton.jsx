import { useState, useEffect } from 'react';

export default function FloatingActionButton({ onClick, icon, className = "" }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const documentHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const footerHeight = 150; // Distance from footer where button should hide
            
            // Show button always except when very close to footer
            if (currentScrollY + windowHeight >= documentHeight - footerHeight) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        // Check initial position
        handleScroll();
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    return (
        <div className={`
            fixed left-4 bottom-4 z-[9999] 
            transition-all duration-300 ease-in-out
            ${isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-16 opacity-0 pointer-events-none'}
        `}>
            <button
                onClick={onClick}
                className={`
                    w-14 h-14 sm:w-16 sm:h-16
                    bg-gradient-to-br from-blue-500 to-blue-600
                    hover:from-blue-600 hover:to-blue-700
                    text-white
                    rounded-full shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-600/40
                    flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    transform hover:scale-110 active:scale-95
                    border-2 border-white/20 hover:border-white/30
                    backdrop-blur-sm
                    ${className}
                `}
                style={{
                    position: 'relative'
                }}
                aria-label="פתח תפריט פעולות"
            >
                {icon}
            </button>
        </div>
    );
}
