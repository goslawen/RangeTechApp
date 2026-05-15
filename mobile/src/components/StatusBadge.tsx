import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/styles';

type Props = {
  value: string;
};

export function StatusBadge({value}: Props) {
  const normalized = value.toLowerCase();
  const isDone =
    normalized.includes('done') ||
    normalized.includes('closed') ||
    normalized.includes('complete');

  return (
    <View style={[styles.badge, isDone ? styles.done : styles.open]}>
      <Text style={[styles.text, isDone ? styles.doneText : styles.openText]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  done: {
    backgroundColor: colors.primarySoft,
  },
  doneText: {
    color: colors.primary,
  },
  open: {
    backgroundColor: colors.warningSoft,
  },
  openText: {
    color: colors.warning,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
  },
});
