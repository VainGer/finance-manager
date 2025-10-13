import { useEffect, useRef, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { Asset } from 'expo-asset';

const SplashScreen = ({ onFinish }) => {
  const [shouldFadeOut, setShouldFadeOut] = useState(false);
  const finishedOnce = useRef(false);

  // טען את האייקון מראש כדי למנוע קפיצה בפריסה
  useEffect(() => {
    Asset.fromModule(require('../../assets/images/icon.png')).downloadAsync().catch(() => {});
  }, []);

  // helper לסיום בטוח פעם אחת
  const finishSafely = () => {
    if (!finishedOnce.current) {
      finishedOnce.current = true;
      onFinish?.();
    }
  };

  // טיימר להתחלת fade out אחרי 2.2 שניות (כמו באתר)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFadeOut(true);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // סיום אחרי fade out
  useEffect(() => {
    if (shouldFadeOut) {
      const timer = setTimeout(finishSafely, 800);
      return () => clearTimeout(timer);
    }
  }, [shouldFadeOut]);

  return (
    <MotiView
      className="flex-1 justify-center items-center bg-white"
      animate={{ opacity: shouldFadeOut ? 0 : 1 }}
      transition={{ type: 'timing', duration: 600 }}
    >
      <LinearGradient
        colors={['#2563eb', '#0891b2']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />

      {/* רקעים דקורטיביים צפים */}
      <MotiView
        from={{ 
          scale: 0.8, 
          opacity: 0,
          translateX: 0,
          translateY: 0,
        }}
        animate={{ 
          scale: [0.8, 1.05, 1.02, 1.08, 1],
          opacity: 0.1,
          translateX: [0, 12, -6, -10, 0],
          translateY: [0, -8, -15, 5, 0],
        }}
        transition={{ 
          type: 'timing', 
          duration: 8000, 
          loop: true,
        }}
        style={{
          position: 'absolute', top: '22%', left: '20%',
          width: 224, height: 224, borderRadius: 112, backgroundColor: 'white',
        }}
      />
      <MotiView
        from={{ 
          scale: 0.8, 
          opacity: 0,
          translateX: 0,
          translateY: 0,
        }}
        animate={{ 
          scale: [0.8, 1.03, 1.06, 1.01, 1],
          opacity: 0.1,
          translateX: [0, -8, 15, 3, 0],
          translateY: [0, 10, -5, 12, 0],
        }}
        transition={{ 
          type: 'timing', 
          duration: 7000, 
          delay: 200,
          loop: true,
        }}
        style={{
          position: 'absolute', bottom: '28%', right: '18%',
          width: 160, height: 160, borderRadius: 80, backgroundColor: 'white',
        }}
      />
      <MotiView
        from={{ 
          scale: 0.8, 
          opacity: 0,
          translateX: 0,
          translateY: 0,
        }}
        animate={{ 
          scale: [0.8, 1.04, 1.02, 1.07, 1],
          opacity: 0.2,
          translateX: [0, -5, 10, -12, 0],
          translateY: [0, -12, 8, -3, 0],
        }}
        transition={{ 
          type: 'timing', 
          duration: 9000, 
          delay: 400,
          loop: true,
        }}
        style={{
          position: 'absolute', top: '50%', right: '33%',
          width: 112, height: 112, borderRadius: 56, backgroundColor: '#22d3ee',
        }}
      />

      {/* לוגו עם bounce-in מתקדם + glow */}
      <MotiView
        from={{ 
          scale: 0.85, 
          opacity: 0,
          translateY: 16,
        }}
        animate={{ 
          scale: [0.85, 1.08, 0.98, 1],
          opacity: 1,
          translateY: [16, -6, 3, 0],
        }}
        transition={{ 
          type: 'timing', 
          duration: 720,
          delay: 0,
        }}
        className="mb-8"
      >
        <MotiView
          animate={{
            shadowOpacity: [0.25, 0.35, 0.25],
          }}
          transition={{
            type: 'timing',
            duration: 3400,
            loop: true,
          }}
          style={{
            shadowColor: '#60a5fa',
            shadowOffset: { width: 0, height: 15 },
            shadowRadius: 25,
            elevation: 15,
          }}
        >
          <View style={{
            width: 128, height: 128, borderRadius: 64,
            backgroundColor: 'white',
            justifyContent: 'center', alignItems: 'center',
            padding: 24,
          }}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 64, height: 64 }}
              resizeMode="contain"
            />
          </View>
        </MotiView>
      </MotiView>

      {/* כותרת עם bounce */}
      <MotiText
        from={{ 
          opacity: 0, 
          translateY: 20,
          scale: 0.85,
        }}
        animate={{ 
          opacity: 1, 
          translateY: [20, -6, 3, 0],
          scale: [0.85, 1.08, 0.98, 1],
        }}
        transition={{ 
          type: 'timing', 
          duration: 680, 
          delay: 180,
        }}
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Smart Finance
      </MotiText>

      {/* כותרת משנה עם fade-up */}
      <MotiText
        from={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 540, delay: 340 }}
        style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          marginBottom: 40,
          paddingHorizontal: 32,
        }}
      >
        ניהול כספים חכם ופשוט
      </MotiText>

      {/* טעינה: "טוען" + נקודות */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 380, delay: 480 }}
        style={{ alignItems: 'center' }}
      >
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: 20,
        }}>
          <Text style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: 16, 
            marginRight: 8,
          }}>
            טוען
          </Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <MotiView
                key={i}
                from={{ scale: 0.85, opacity: 0.35 }}
                animate={{ scale: 1.15, opacity: 1 }}
                transition={{
                  type: 'timing',
                  duration: 900,
                  delay: 200 * i,
                  loop: true,
                  repeatReverse: true,
                }}
                style={{
                  width: 8, height: 8, 
                  borderRadius: 4, 
                  backgroundColor: 'rgba(255,255,255,0.7)',
                }}
              />
            ))}
          </View>
        </View>

        {/* Progress bar מתקדם */}
        <View style={{
          width: 288, height: 8, 
          backgroundColor: 'rgba(255,255,255,0.2)', 
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <MotiView
            from={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              type: 'timing', 
              duration: 2200, 
              delay: 0,
            }}
            style={{ 
              height: '100%', 
              backgroundColor: '#ffffff', 
              borderRadius: 4,
            }}
          />
        </View>
      </MotiView>
    </MotiView>
  );
};

export default SplashScreen;
