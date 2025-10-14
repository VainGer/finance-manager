import { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");

export const FEATURES = [
  {
    icon: "pie-chart",
    color: "#2563eb",
    title: "ניהול תקציבים",
    desc: "הגדר תקציבים חכמים לפי קטגוריות ועקוב בקלות אחרי ההוצאות שלך."
  },
  {
    icon: "card",
    color: "#059669",
    title: "מעקב עסקאות",
    desc: "נהל את כל העסקאות שלך במקום אחד, עם אפשרויות עריכה והוספה פשוטות."
  },
  {
    icon: "cloud-upload",
    color: "#7c3aed",
    title: "סריקת קבצים חכמה",
    desc: "העלה בקלות דוח הוצאות אשראי, והמערכת תזהה ותוסיף את העסקאות אוטומטית."
  },
  {
    icon: "stats-chart",
    color: "#dc2626",
    title: "דוחות מפורטים",
    desc: "קבל תובנות ממוקדות על ההרגלים הכספיים שלך, בדוחות ברורים ומפורטים."
  },
  {
    icon: "sparkles",
    color: "#f59e0b",
    title: "תובנות חכמות",
    desc: "קבל ניתוחים מותאמים אישית והמלצות מעשיות מבוססות בינה מלאכותית."
  }
];


export default function FeatureTabs() {
  const [index, setIndex] = useState(0);
  const feature = FEATURES[index];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % FEATURES.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [index]);


  const CARD_WIDTH = SCREEN_W * 0.80;
  const CARD_HEIGHT = 160;

  return (
    <View className="items-center my-6 w-full px-4">
      <View
        className="rounded-2xl bg-white/95 border border-slate-200/50 shadow-sm"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT, padding: 20 }}
      >
        <View className="flex-1 items-center justify-center">
          <View
            className="w-14 h-14 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: `${feature.color}15` }}
          >
            <Ionicons name={feature.icon} size={28} color={feature.color} />
          </View>
          <Text className="text-lg font-bold text-slate-800 text-center mb-1">{feature.title}</Text>
          <Text className="text-slate-600 text-center text-sm leading-5">{feature.desc}</Text>
        </View>
      </View>
    </View>
  );
}
