import React, {useMemo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors, sharedStyles} from '../theme/styles';
import {formatDate} from '../utils/date';

type Props = {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
};

export function AppDatePicker({
  label,
  value,
  onChange,
}: Props): React.JSX.Element {
  const selectedDate = useMemo(() => parseDate(value), [value]);

  const changeByDays = (days: number) => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + days);
    onChange(nextDate.toISOString());
  };

  const setToday = () => {
    onChange(new Date().toISOString());
  };

  return (
    <View>
      <Text style={sharedStyles.fieldLabel}>{label}</Text>
      <View style={styles.dateBox}>
        <Text style={styles.dateText}>{formatDate(value)}</Text>
        <View style={styles.actions}>
          <Pressable
            accessibilityLabel={`Poprzedni dzień: ${label}`}
            onPress={() => changeByDays(-1)}
            style={styles.dateButton}>
            <Text style={styles.dateButtonText}>- dzień</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={`Dzisiejsza data: ${label}`}
            onPress={setToday}
            style={styles.dateButton}>
            <Text style={styles.dateButtonText}>Dzisiaj</Text>
          </Pressable>
          <Pressable
            accessibilityLabel={`Następny dzień: ${label}`}
            onPress={() => changeByDays(1)}
            style={styles.dateButton}>
            <Text style={styles.dateButtonText}>+ dzień</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function parseDate(value?: string | null) {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  dateBox: {
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  dateButton: {
    backgroundColor: '#eef3f8',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dateButtonText: {
    color: colors.header,
    fontSize: 13,
    fontWeight: '800',
  },
  dateText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
});
