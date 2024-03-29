import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import color from '@abong.code/theme/color';

type Props = {
  bottomRef: React.RefObject<BottomSheetModalMethods>;
  snapPoints?: (string | number)[];
  children?: React.ReactNode;
  disappearsOnIndex?: number;
};

const BottomSheetContainer = (props: Props) => {
  const snapPoints = useMemo(() => {
    if (props.snapPoints) {
      return props.snapPoints;
    }
    return ['90%', '100%'];
  }, [props.snapPoints]);

  //backdrop
  const renderBackdrop = (_props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {..._props}
      disappearsOnIndex={props.disappearsOnIndex || 1}
      appearsOnIndex={-1}
    />
  );

  // renders
  return (
    <BottomSheetModal
      ref={props.bottomRef}
      index={0}
      enablePanDownToClose
      enableOverDrag={false}
      backdropComponent={renderBackdrop}
      style={styles.modal}
      snapPoints={snapPoints}>
      <BottomSheetView style={styles.contentContainer}>
        {props.children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export default BottomSheetContainer;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: color.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: color.white,
  },
});
