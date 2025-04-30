import { View, Text, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useRef, useMemo } from 'react';

interface AppBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
}

export default function AppBottomSheet({
  children,
  snapPoints = ['25%', '50%']
}: AppBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  const memoizedSnapPoints = useMemo(() => snapPoints, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={memoizedSnapPoints}
      backgroundStyle={{ backgroundColor: '#fff' }}
      handleIndicatorStyle={{ backgroundColor: '#6b7280' }}
    >
      <View className="p-4">
        {children}
      </View>
    </BottomSheet>
  );
}