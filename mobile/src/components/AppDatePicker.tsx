import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useMemo, useState} from 'react';
import {Platform, Pressable, StyleSheet, Text, View} from 'react-native';
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
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = useMemo(() => parseDate(value), [value]);

  const handleChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setIsOpen(false);
    }

    if (event.type === 'set' && date) {
      onChange(date.toISOString());
    }
  };

  return (
    <View>
      <Text style={sharedStyles.fieldLabel}>{label}</Text>
      <Pressable style={styles.dateButton} onPress={() => setIsOpen(true)}>
        <Text style={styles.dateText}>{formatDate(value)}</Text>
      </Pressable>
      {isOpen ? (
        <DateTimePicker
          display="default"
          mode="date"
          onChange={handleChange}
          value={selectedDate}
        />
      ) : null}
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
  dateButton: {
    backgroundColor: '#ffffff',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  dateText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
