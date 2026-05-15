import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {AppHeader} from '../components/AppHeader';
import {resourceByKey, ResourceKey} from '../features/resources';
import {RootStackParamList} from '../navigation/AppNavigator';
import {colors, sharedStyles} from '../theme/styles';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const moreEntries: ResourceKey[] = [
  'employees',
  'clients',
  'devices',
  'taskTypes',
  'workTasks',
  'serviceTickets',
  'serviceReports',
  'serviceParts',
];

const businessDescriptions: Record<ResourceKey, string> = {
  employees: 'Dodawaj, edytuj i usuwaj pracowników.',
  clients: 'Zarządzaj klientami i ich danymi kontaktowymi.',
  devices: 'Dodawaj urządzenia i przypisuj każde urządzenie do jednego klienta.',
  taskTypes: 'Zarządzaj typami zadań produkcyjnych i serwisowych.',
  workTasks:
    'Twórz i edytuj zadania produkcyjne oraz przypisuj je do pracowników i urządzeń.',
  serviceTickets: 'Przyjmuj i obsługuj zgłoszenia klientów.',
  serviceReports: 'Twórz raporty na podstawie zgłoszeń serwisowych.',
  serviceParts: 'Zarządzaj częściami zapasowymi wykorzystywanymi w serwisie.',
};

const menuIcons: Record<ResourceKey, string> = {
  employees: 'P',
  clients: 'K',
  devices: 'U',
  taskTypes: 'T',
  workTasks: 'Z',
  serviceTickets: 'S',
  serviceReports: 'R',
  serviceParts: 'C',
};

export function MoreScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();

  return (
    <View style={sharedStyles.container}>
      <AppHeader title="Więcej" />
      <ScrollView contentContainerStyle={sharedStyles.screenBody}>
        <Text style={styles.sectionTitle}>Menu zarządzania</Text>
        {moreEntries.map(resourceKey => {
          const resource = resourceByKey[resourceKey];

          return (
            <Pressable
              key={resource.key}
              onPress={() => navigation.navigate('Resource', {resourceKey})}
              style={styles.menuCard}>
              <View style={styles.menuAccent} />
              <View style={styles.menuRow}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>{menuIcons[resource.key]}</Text>
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.title}>{resource.pluralLabel}</Text>
                  <Text style={styles.description}>
                    {businessDescriptions[resource.key]}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    borderColor: colors.primarySoft,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  iconText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  menuAccent: {
    backgroundColor: colors.header,
    borderRadius: 999,
    height: 34,
    left: 0,
    position: 'absolute',
    top: 18,
    width: 4,
  },
  menuCard: {
    ...sharedStyles.card,
    overflow: 'hidden',
    paddingLeft: 20,
  },
  menuRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  menuText: {
    flex: 1,
    gap: 4,
  },
  sectionTitle: {
    color: colors.header,
    fontSize: 19,
    fontWeight: '900',
  },
  title: {
    color: colors.header,
    fontSize: 18,
    fontWeight: '900',
  },
});
