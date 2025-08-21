import FeatureCard from './FeatureCard';

export default function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: "מעקב הוצאות חכם",
            description: "עקוב אחר ההוצאות שלך בזמן אמת עם קטגוריות מותאמות אישית וניתוח מתקדם של הרגלי הצריכה"
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            title: "תכנון תקציב מקצועי",
            description: "צור תקציב מפורט עם יעדי חיסכון, התראות חכמות והמלצות אישיות לניהול כספי אופטימלי"
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
            ),
            title: "ניהול חשבונות מרובים",
            description: "נהל מספר חשבונות בנק, כרטיסי אשראי וחשבונות חיסכון במקום אחד עם סנכרון אוטומטי"
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
            ),
            title: "דוחות מתקדמים",
            description: "קבל תובנות עמוקות עם גרפים אינטראקטיביים, דוחות חודשיים ושנתיים וניתוח טרנדים פיננסיים"
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: "אבטחה מתקדמת",
            description: "הגנה מלאה על הנתונים שלך עם הצפנה מתקדמת, אימות דו-שלבי וגיבוי אוטומטי לענן"
        },
        {
            icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            title: "גישה בכל מקום",
            description: "אפליקציה רספונסיבית הפועלת בצורה מושלמת על מחשב, טאבלט וסמארטפון עם סנכרון בזמן אמת"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-800 mb-6">
                        כל מה שאתה צריך לניהול כספי מושלם
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        מערכת מקצועית וידידותית שמספקת את כל הכלים הדרושים לך כדי לקחת שליטה מלאה על הכספים שלך
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
