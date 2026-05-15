import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {ApiHealth, ApiRecord, getRecords} from '../api/client';
import {AppHeader} from '../components/AppHeader';
import {resources} from '../features/resources';
import {RootStackParamList} from '../navigation/AppNavigator';
import {colors, sharedStyles} from '../theme/styles';
import {useServiceApp} from '../context/ServiceAppContext';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const dashboardLabels: Partial<Record<string, string>> = {
  serviceParts: 'Części zapasowe',
};

export function DashboardScreen(): React.JSX.Element {
  const navigation = useNavigation<Navigation>();
  const {health, isLoading, error, refreshHealth} = useServiceApp();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);

    try {
      const entries = await Promise.all(
        resources.map(async resource => {
          const records: ApiRecord[] = await getRecords(resource.endpoint);
          return [resource.key, records.length] as const;
        }),
      );
      setCounts(Object.fromEntries(entries));
    } catch {
      setStatsError('Nie udało się odświeżyć dashboardu.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshHealth();
      loadStats();
    }, [loadStats, refreshHealth]),
  );

  return (
    <View style={sharedStyles.container}>
      <AppHeader title="Panel operacyjny" />
      <ScrollView
        contentContainerStyle={sharedStyles.screenBody}
        refreshControl={
          <RefreshControl refreshing={statsLoading} onRefresh={loadStats} />
        }>
        <ApiStatusBar
          error={error}
          health={health}
          isLoading={isLoading}
          onRefresh={refreshHealth}
        />

        {statsError ? (
          <View style={sharedStyles.errorBox}>
            <Text style={sharedStyles.errorText}>{statsError}</Text>
          </View>
        ) : null}

        <View style={styles.statsHeader}>
          <Text style={styles.sectionTitle}>Statystyki</Text>
          <View style={styles.statsActions}>
            {statsLoading ? (
              <View style={styles.loadingInline}>
                <ActivityIndicator color={colors.primary} size="small" />
                <Text style={sharedStyles.muted}>Odświeżanie...</Text>
              </View>
            ) : null}
            <Pressable
              disabled={statsLoading}
              onPress={loadStats}
              style={[sharedStyles.button, styles.refreshStatsButton]}>
              <Text style={sharedStyles.buttonText}>Odśwież</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.grid}>
          {resources.map(resource => (
            <StatTile
              key={resource.key}
              count={counts[resource.key] ?? 0}
              label={dashboardLabels[resource.key] ?? resource.pluralLabel}
              onPress={() =>
                navigation.navigate('Resource', {resourceKey: resource.key})
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ApiStatusBar({
  error,
  health,
  isLoading,
  onRefresh,
}: {
  error: string | null;
  health: ApiHealth | null;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}) {
  const statusColor = isLoading
    ? colors.muted
    : error || !health
      ? colors.danger
      : '#16a34a';

  return (
    <View style={styles.apiStatusBar}>
      <Text style={styles.apiStatusText}>RangeTech Service API</Text>
      <View style={styles.apiStatusRight}>
        <View style={[styles.apiStatusDot, {backgroundColor: statusColor}]} />
        <Pressable
          accessibilityLabel="Odśwież status API"
          hitSlop={8}
          onPress={onRefresh}
          style={styles.apiRefreshButton}>
          {isLoading ? (
            <ActivityIndicator color={colors.header} size="small" />
          ) : (
            <Text style={styles.apiRefreshIcon}>↻</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function StatTile({
  count,
  label,
  onPress,
}: {
  count: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tile}>
      <View style={styles.tileAccent} />
      <Text style={styles.tileCount}>{count}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  apiRefreshButton: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  apiRefreshIcon: {
    color: colors.header,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  apiStatusBar: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 2,
    minHeight: 42,
    paddingHorizontal: 13,
    paddingVertical: 8,
    shadowColor: colors.header,
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  apiStatusDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  apiStatusRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  apiStatusText: {
    color: colors.header,
    fontSize: 13,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  loadingInline: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  refreshStatsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    color: colors.header,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 8,
  },
  statsActions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-end',
  },
  statsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  tile: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 3,
    minHeight: 110,
    overflow: 'hidden',
    padding: 14,
    shadowColor: colors.header,
    shadowOffset: {height: 3, width: 0},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: '48%',
  },
  tileAccent: {
    backgroundColor: colors.primaryDark,
    height: 5,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  tileCount: {
    color: colors.header,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 6,
  },
  tileLabel: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
});
