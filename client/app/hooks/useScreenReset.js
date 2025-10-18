import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

export function useScreenReset() {
    useFocusEffect(
        useCallback(() => {
            //cleanup to reset states on navigation
            return () => { };
        }, [])
    );
}