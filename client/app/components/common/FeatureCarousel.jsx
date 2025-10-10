import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_W } = Dimensions.get("window");

export default function FeatureCarousel() {
  const FEATURES = useMemo(
    () => [
      {
        icon: "pie-chart",
        color: "#2563eb",
        title: "ניהול תקציבים",
        desc: "הגדר תקציבים לפי קטגוריות ועקוב אחרי ההוצאות",
      },
      {
        icon: "card",
        color: "#059669",
        title: "מעקב עסקאות",
        desc: "הוסף, ערוך ונהל את כל העסקאות שלך במקום אחד",
      },
      {
        icon: "cloud-upload",
        color: "#7c3aed",
        title: "סריקת קבצים חכמה",
        desc: "העלה דוח הוצאות אשראי ותוסיף בקלות עסקאות",
      },
      {
        icon: "stats-chart",
        color: "#dc2626",
        title: "דוחות מפורטים",
        desc: "קבל תובנות על ההרגלים הכספיים שלך",
      },
    ],
    []
  );

  // Layout constants
  const CARD_WIDTH = 300;
  const CARD_HEIGHT = 160;
  const CARD_SPACING = 20;
  const ITEM_SIZE = CARD_WIDTH + CARD_SPACING;
  const EDGE = (SCREEN_W - ITEM_SIZE) / 2;

  // Autoplay & scrolling
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const OFFSETS = useMemo(
    () => FEATURES.map((_, i) => i * ITEM_SIZE),
    [FEATURES.length]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (index + 1) % FEATURES.length;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: OFFSETS[next], animated: true });
    }, 3000);

    return () => clearInterval(timer);
  }, [index, OFFSETS, FEATURES.length]);

  const handleScrollEnd = (e) => {
    const x = e.nativeEvent.contentOffset.x;
    const newIndex = Math.round(x / ITEM_SIZE);
    setIndex(newIndex);
  };

  return (
    <View className="w-full items-center">
      {/* Scrollable cards */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToOffsets={OFFSETS}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ paddingHorizontal: EDGE }}
        style={{ height: CARD_HEIGHT }}
      >
        {FEATURES.map((f, i) => (
          <View
            key={i}
            style={{
              width: ITEM_SIZE,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              className="rounded-2xl bg-white/95 border border-slate-200/50 p-5 shadow-sm"
              style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            >
              <View className="flex-1 items-center justify-center">
                <View
                  className="w-14 h-14 rounded-full items-center justify-center mb-3"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <Ionicons name={f.icon} size={28} color={f.color} />
                </View>
                <Text className="text-lg font-bold text-slate-800 text-center mb-1">
                  {f.title}
                </Text>
                <Text className="text-slate-600 text-center text-sm leading-5">
                  {f.desc}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
