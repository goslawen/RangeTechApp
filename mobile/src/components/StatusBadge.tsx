import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme/styles';

type Props = {
  value: string;
};

export function StatusBadge({value}: Props) {
  const normalized = value.toLowerCase();
  const variant = getVariant(normalized);

  return (
    <View style={[styles.badge, getBadgeStyle(variant)]}>
      <Text style={[styles.text, getTextStyle(variant)]}>{value}</Text>
    </View>
  );
}

function getVariant(value: string): 'danger' | 'done' | 'info' | 'neutral' | 'open' {
  if (
    value.includes('done') ||
    value.includes('closed') ||
    value.includes('complete') ||
    value.includes('zako')
  ) {
    return 'done';
  }

  if (
    value.includes('realiz') ||
    value.includes('przyj') ||
    value.includes('progress')
  ) {
    return 'info';
  }

  if (
    value.includes('high') ||
    value.includes('critical') ||
    value.includes('wysoki') ||
    value.includes('odrzu')
  ) {
    return 'danger';
  }

  if (
    value.includes('normal') ||
    value.includes('niski') ||
    value.includes('low')
  ) {
    return 'neutral';
  }

  return 'open';
}

function getBadgeStyle(variant: ReturnType<typeof getVariant>) {
  switch (variant) {
    case 'danger':
      return styles.danger;
    case 'done':
      return styles.done;
    case 'info':
      return styles.info;
    case 'neutral':
      return styles.neutral;
    default:
      return styles.open;
  }
}

function getTextStyle(variant: ReturnType<typeof getVariant>) {
  switch (variant) {
    case 'danger':
      return styles.dangerText;
    case 'done':
      return styles.doneText;
    case 'info':
      return styles.infoText;
    case 'neutral':
      return styles.neutralText;
    default:
      return styles.openText;
  }
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#fda29b',
  },
  dangerText: {
    color: colors.danger,
  },
  done: {
    backgroundColor: colors.successSoft,
    borderColor: '#99f6e4',
  },
  doneText: {
    color: colors.success,
  },
  info: {
    backgroundColor: colors.primarySoft,
    borderColor: '#bfdbfe',
  },
  infoText: {
    color: colors.primaryDark,
  },
  neutral: {
    backgroundColor: colors.steelSoft,
    borderColor: colors.border,
  },
  neutralText: {
    color: colors.steel,
  },
  open: {
    backgroundColor: colors.warningSoft,
    borderColor: '#fde68a',
  },
  openText: {
    color: colors.warning,
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
  },
});
