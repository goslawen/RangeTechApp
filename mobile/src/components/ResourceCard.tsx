import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {ApiRecord} from '../api/client';
import {ResourceConfig, ResourceKey, resourceByKey} from '../features/resources';
import {colors, sharedStyles} from '../theme/styles';
import {formatDate, isDateField} from '../utils/date';
import {StatusBadge} from './StatusBadge';

type Props = {
  lookups?: Partial<Record<ResourceKey, ApiRecord[]>>;
  resource: ResourceConfig;
  record: ApiRecord;
  onPress: () => void;
};

export function ResourceCard({lookups = {}, resource, record, onPress}: Props) {
  const title = String(record[resource.titleField] ?? resource.label);
  const subtitle = resource.subtitleFields
    .map(field => formatFieldValue(resource, record, field, lookups))
    .filter(value => value !== null && value !== undefined && value !== '')
    .map(String)
    .join('  |  ');
  const status = resource.statusField
    ? String(record[resource.statusField] ?? '')
    : '';

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={styles.title}>{title}</Text>
          <Text numberOfLines={2} style={sharedStyles.muted}>
            {subtitle || String(record.id ?? '')}
          </Text>
        </View>
        <View style={styles.badges}>
          {status ? <StatusBadge value={status} /> : null}
          {resource.priorityField ? (
            <StatusBadge
              value={String(record[resource.priorityField] ?? 'Normal')}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function formatFieldValue(
  resource: ResourceConfig,
  record: ApiRecord,
  fieldKey: string,
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>,
) {
  const field = resource.fields.find(item => item.key === fieldKey);
  const value =
    record[fieldKey] ??
    record[field?.payloadKey ?? fieldKey] ??
    field?.defaultValue ??
    '';

  if (resource.key === 'serviceReports') {
    const summary = String(record.summary ?? '');

    if (fieldKey === 'diagnosis') {
      return extractSummaryPart(summary, 'Diagnoza');
    }

    if (fieldKey === 'solution') {
      return extractSummaryPart(summary, 'Wykonane czynności');
    }

    if (fieldKey === 'status') {
      return extractSummaryPart(summary, 'Status raportu') || 'Roboczy';
    }
  }

  if (field?.relationResource && typeof value === 'string') {
    const related = lookups[field.relationResource]?.find(
      item => String(item.id) === value,
    );

    if (related) {
      return formatRelatedLabel(field.relationResource, related);
    }

    return value.slice(0, 8);
  }

  if (fieldKey === 'deviceType' && !value) {
    return 'RangeTech';
  }

  if (field?.type === 'date' || isDateField(fieldKey)) {
    return formatDate(value);
  }

  return value;
}

function extractSummaryPart(summary: string, label: string) {
  const line = summary
    .split('\n')
    .find(item => item.toLowerCase().startsWith(`${label.toLowerCase()}:`));

  return line?.slice(label.length + 1).trim() ?? '';
}

function formatRelatedLabel(resourceKey: ResourceKey, record: ApiRecord) {
  if (resourceKey === 'employees') {
    return [record.firstName, record.lastName]
      .filter(Boolean)
      .join(' ') || String(record.id ?? '').slice(0, 8);
  }

  if (resourceKey === 'devices') {
    return [record.model, record.serialNumber]
      .filter(Boolean)
      .join(' / ') || String(record.id ?? '').slice(0, 8);
  }

  if (resourceKey === 'taskTypes') {
    return String(record.name ?? record.id ?? '').slice(0, 80);
  }

  if (resourceKey === 'clients') {
    return String(record.name ?? record.id ?? '').slice(0, 80);
  }

  const resource = resourceByKey[resourceKey];
  const values = resource.fields
    .filter(field => !field.hidden)
    .slice(0, 2)
    .map(field => record[field.key] ?? record[field.payloadKey ?? field.key])
    .filter(value => value !== null && value !== undefined && value !== '')
    .map(String);

  return values.join(' ') || String(record.id ?? '').slice(0, 8);
}

const styles = StyleSheet.create({
  accent: {
    backgroundColor: colors.primaryDark,
    borderRadius: 999,
    height: 38,
    left: 0,
    position: 'absolute',
    top: 18,
    width: 4,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  card: {
    ...sharedStyles.card,
    overflow: 'hidden',
    paddingLeft: 20,
  },
  main: {
    flex: 1,
    gap: 6,
    paddingRight: 10,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  title: {
    color: colors.header,
    fontSize: 18,
    fontWeight: '900',
  },
});
