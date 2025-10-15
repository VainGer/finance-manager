import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const navigate = useNavigate();

    const sections = [
        { 
            title: "ניהול פרופילים", 
            description: "צפייה, עדכון ומחיקת פרופילים", 
            route: "/admin/profiles",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            ),
            color: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-50",
            hoverBg: "hover:bg-blue-100"
        },
        { 
            title: "ניהול תקציבים", 
            description: "צפייה ומחיקת תקציבים", 
            route: "/admin/budgets",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
            ),
            color: "from-green-500 to-emerald-500",
            bgColor: "bg-green-50",
            hoverBg: "hover:bg-green-100"
        },
        { 
            title: "הוצאות", 
            description: "צפייה בהוצאות", 
            route: "/admin/expenses",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1S9 1.45 9 2V4H15V2C15 1.45 15.45 1 16 1S17 1.45 17 2V4H20C21.11 4 22 4.89 22 6V20C22 21.11 21.11 22 20 22H4C2.89 22 2 21.11 2 20V6C2 4.89 2.89 4 4 4H7M4 8V20H20V8H4M12 9L17 14H14V18H10V14H7L12 9Z"/>
                </svg>
            ),
            color: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-50",
            hoverBg: "hover:bg-purple-100"
        },
        { 
            title: "לוגים", 
            description: "צפייה בפעולות משתמשים", 
            route: "/admin/logs",
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
            ),
            color: "from-orange-500 to-red-500",
            bgColor: "bg-orange-50",
            hoverBg: "hover:bg-orange-100"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 p-6 rtl relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-80 h-80 bg-gradient-to-br from-blue-100/35 to-cyan-100/25 rounded-full blur-xl"></div>
                <div className="absolute top-1/4 -left-32 w-72 h-72 bg-gradient-to-br from-purple-100/30 to-blue-100/25 rounded-full blur-xl"></div>
                <div className="absolute -bottom-20 -left-16 w-76 h-76 bg-gradient-to-br from-green-100/25 to-cyan-100/20 rounded-full blur-xl"></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.1 16 12.7V16.2C16 16.8 15.4 17.3 14.8 17.3H9.2C8.6 17.3 8 16.8 8 16.2V12.7C8 12.1 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10V11.5H13.5V10C13.5 8.7 12.8 8.2 12 8.2Z"/>
                        </svg>
                    </div>
                    <h1 className="text-5xl font-bold text-slate-800 mb-4">
                        דשבורד ניהול
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        פאנל בקרה מתקדם לניהול מערכת Smart Finance
                    </p>
                </div>

                {/* Dashboard Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {sections.map((section, index) => (
                        <div
                            key={section.route}
                            onClick={() => navigate(section.route)}
                            className={`cursor-pointer group relative overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 ${section.hoverBg} animate-fadeIn`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Card Background Gradient */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity duration-500`}></div>
                            
                            {/* Icon Section */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${section.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                                    <div className="text-white">
                                        {section.icon}
                                    </div>
                                </div>
                                
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold mb-3 text-slate-800 group-hover:text-slate-900 transition-colors">
                                        {section.title}
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">
                                        {section.description}
                                    </p>
                                </div>
                            </div>

                            {/* Action Section */}
                            <div className="flex items-center justify-between">
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${section.color} text-white text-sm font-medium shadow-md group-hover:shadow-lg transition-all duration-300`}>
                                    <span>לחץ לכניסה</span>
                                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
                                    </svg>
                                </div>

                                {/* Status Indicator */}
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-slate-500">פעיל</span>
                                </div>
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* Footer Stats */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                        <p className="text-slate-600 text-sm">מערכת פעילה</p>
                    </div>
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                        <p className="text-slate-600 text-sm">מאובטח 24/7</p>
                    </div>
                    <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mx-auto mb-2 animate-pulse"></div>
                        <p className="text-slate-600 text-sm">ניטור בזמן אמת</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
