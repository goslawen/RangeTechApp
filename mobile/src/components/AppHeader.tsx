import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, sharedStyles} from '../theme/styles';

type Props = {
  title: string;
  eyebrow?: string;
};

export function AppHeader({title, eyebrow = 'RangeTech Service'}: Props) {
  return (
    <View style={sharedStyles.header}>
      <View style={styles.brandPill}>
        <Text style={sharedStyles.headerEyebrow}>{eyebrow}</Text>
      </View>
      <Text style={sharedStyles.headerTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderColor: colors.primarySoft,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
});
