import React from 'react';
import {Text, View} from 'react-native';
import {sharedStyles} from '../theme/styles';

type Props = {
  title: string;
  eyebrow?: string;
};

export function AppHeader({title, eyebrow = 'RangeTech Service'}: Props) {
  return (
    <View style={sharedStyles.header}>
      <Text style={sharedStyles.headerEyebrow}>{eyebrow}</Text>
      <Text style={sharedStyles.headerTitle}>{title}</Text>
    </View>
  );
}
