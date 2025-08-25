import { useEffect, useRef, useState, useMemo } from "react";
import { View, Text, ScrollView, Dimensions, I18nManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");

export default function FeatureCarousel({
  cardHeight = 120,
  maxCardWidth = 320,
  sideGutter = 24,
  interval = 3000,
  autoPlay = true,
}) {
  const isRTL = I18nManager.isRTL;
  const FEATURES = useMemo(
    () => [
      { icon: "pie-chart", color: "#2563eb", title: "ניהול תקציבים", desc: "הגדר תקציבים לפי קטגוריות ועקוב אחרי ההוצאות" },
      { icon: "card", color: "#059669", title: "מעקב עסקאות", desc: "הוסף, ערוך ונהל את כל העסקאות שלך במקום אחד" },
      { icon: "cloud-upload", color: "#7c3aed", title: " סריקת קבצים חכמה", desc: "העלה דוח הוצאות אשראי ו-AI יוסיף את העסקאות אוטומטית" },
      { icon: "stats-chart", color: "#dc2626", title: "דוחות מפורטים", desc: "קבל תובנות על ההרגלים הכספיים שלך" },
    ],
    []
  );

  const CARD_W = Math.min(maxCardWidth, SCREEN_W - sideGutter * 2);
  const EDGE = (SCREEN_W - CARD_W) / 2; // כדי למרכז את הכרטיסים בקצוות
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      const next = (index + 1) % FEATURES.length;
      setIndex(next);
      const target =
        isRTL
          ? (FEATURES.length - 1 - next) * CARD_W
          : next * CARD_W;
      scrollRef.current?.scrollTo({ x: target, animated: true });
    }, interval);
    return () => clearInterval(id);
  }, [index, autoPlay, interval, CARD_W, isRTL]);

  const onMomentumScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const page = Math.round(x / CARD_W);
    const newIndex = isRTL ? (FEATURES.length - 1 - page) : page;
    setIndex(newIndex);
  };

  return (
    <View className="w-full items-center">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        inverted={isRTL}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: sideGutter,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }}
        snapToInterval={CARD_W}
        decelerationRate="fast"
        style={{ height: cardHeight + 36 }}
      >
        {FEATURES.map((f, i) => (
          <View key={i} style={{ width: CARD_W }} className="px-2">
            <View
              className="rounded-2xl bg-white/95 border border-slate-200/50 backdrop-blur p-5"
              style={{ height: cardHeight }}
            >
              <View className="flex-1 items-center justify-center">
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <Ionicons name={f.icon} size={28} color={f.color} />
                </View>
                <Text
                  className="text-lg font-bold text-slate-800 text-center mb-2"
                  style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                >
                  {f.title}
                </Text>
                <Text
                  className="text-slate-600 text-center leading-5 text-sm"
                  style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
                >
                  {f.desc}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* נקודות אינדיקציה */}
      <View className="flex-row items-center justify-center mt-2">
        {FEATURES.map((_, i) => {
          const active = i === index;
          return (
            <View
              key={i}
              className={`h-2 rounded-full mx-1 ${active ? "w-5" : "w-2"}`}
              style={{
                backgroundColor: active ? "rgba(30, 64, 175, 0.9)" : "rgba(30, 64, 175, 0.35)",
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
