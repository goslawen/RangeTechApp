import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {sharedStyles} from '../theme/styles';

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
    backgroundColor: 'rgba(219, 234, 254, 0.12)',
    borderColor: 'rgba(219, 234, 254, 0.26)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
