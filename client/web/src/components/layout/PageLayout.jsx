import Footer from '../common/Footer';

export default function PageLayout({ 
    children, 
    className = "",
    showFooter = true,
    dir = "rtl",
    maxWidth = "7xl", // Default max width
    spacing = true, // Whether to add responsive padding
    containerClassName = "" // Additional classes for the content container
}) {
    const maxWidthClass = {
        "none": "",
        "sm": "max-w-sm",
        "md": "max-w-md", 
        "lg": "max-w-lg",
        "xl": "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        "full": "max-w-full"
    }[maxWidth] || "max-w-7xl";

    const spacingClass = spacing ? "px-4 sm:px-6 lg:px-8 py-8" : "";

    return (
        <div className={`min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 flex flex-col ${className}`} dir={dir}>
            {spacing ? (
                <div className={`${maxWidthClass} mx-auto ${spacingClass} flex-1 w-full ${containerClassName}`}>
                    {children}
                </div>
            ) : (
                <div className="flex-1">
                    {children}
                </div>
            )}
            
            {showFooter && <Footer />}
        </div>
    );
}
