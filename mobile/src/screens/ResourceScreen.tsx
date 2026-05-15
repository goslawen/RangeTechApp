import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ApiRecord,
  assignServiceReportPart,
  createRecord,
  deleteRecord,
  getRecords,
  updateRecord,
} from '../api/client';
import {AppHeader} from '../components/AppHeader';
import {AppDatePicker} from '../components/AppDatePicker';
import {ResourceCard} from '../components/ResourceCard';
import {
  createEmptyForm,
  formFromRecord,
  ResourceField,
  ResourceKey,
  resourceByKey,
  toPayload,
} from '../features/resources';
import {RootStackParamList} from '../navigation/AppNavigator';
import {colors, sharedStyles} from '../theme/styles';
import {formatDate, isDateField} from '../utils/date';

type Props = NativeStackScreenProps<RootStackParamList, 'Resource'>;
type Mode = 'list' | 'details' | 'create' | 'edit' | 'assignPart';

export function ResourceScreen({route, navigation}: Props): React.JSX.Element {
  return (
    <ResourceView
      onBack={() => navigation.goBack()}
      resourceKey={route.params.resourceKey}
    />
  );
}

export function ResourceView({
  resourceKey,
  onBack,
  notice,
}: {
  resourceKey: keyof typeof resourceByKey;
  onBack?: () => void;
  notice?: string;
}): React.JSX.Element {
  const resource = resourceByKey[resourceKey];
  const [records, setRecords] = useState<ApiRecord[]>([]);
  const [selected, setSelected] = useState<ApiRecord | null>(null);
  const [form, setForm] = useState(() => createEmptyForm(resource));
  const [reportPartForm, setReportPartForm] = useState({
    servicePartId: '',
    quantityUsed: '1',
    note: '',
  });
  const [mode, setMode] = useState<Mode>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookups, setLookups] = useState<Partial<Record<ResourceKey, ApiRecord[]>>>(
    {},
  );
  const [message, setMessage] = useState<string | null>(null);
  const relationKeys = useMemo(() => {
    const keys = resource.fields
      .map(field => field.relationResource)
      .filter((key): key is ResourceKey => Boolean(key));

    if (resource.key === 'workTasks') {
      keys.push('employees', 'devices', 'taskTypes');
    }

    if (resource.key === 'devices') {
      keys.push('clients');
    }

    if (resource.key === 'serviceReports') {
      keys.push('serviceParts');
    }

    return Array.from(new Set(keys));
  }, [resource]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setRecords(await getRecords(resource.endpoint));
    } catch (caughtError) {
      const apiError =
        caughtError instanceof Error ? caughtError.message : 'Błąd API';
      setError(`Nie udało się pobrać danych: ${apiError}`);
    } finally {
      setIsLoading(false);
    }
  }, [resource.endpoint]);

  const loadLookups = useCallback(async () => {
    if (relationKeys.length === 0) {
      setLookups({});
      return;
    }

    try {
      const entries = await Promise.all(
        relationKeys.map(async key => {
          const relatedResource = resourceByKey[key];
          const relatedRecords = await getRecords(relatedResource.endpoint);
          return [key, relatedRecords] as const;
        }),
      );
      setLookups(Object.fromEntries(entries));
    } catch (caughtError) {
      const apiError =
        caughtError instanceof Error ? caughtError.message : 'Błąd API';
      setError(`Nie udało się pobrać list wyboru: ${apiError}`);
    }
  }, [relationKeys]);

  useEffect(() => {
    load();
    loadLookups();
  }, [load, loadLookups]);

  const selectedTitle = useMemo(() => {
    if (!selected) {
      return '';
    }

    return String(selected[resource.titleField] ?? selected.id ?? '');
  }, [resource.titleField, selected]);

  const openCreate = () => {
    setForm(withLookupDefaults(createEmptyForm(resource), resource, lookups));
    setSelected(null);
    setMode('create');
    setMessage(null);
  };

  const openDetails = (record: ApiRecord) => {
    setSelected(record);
    setMode('details');
    setMessage(null);
  };

  const openEdit = () => {
    if (!selected) {
      return;
    }

    setForm(withLookupDefaults(formFromRecord(resource, selected), resource, lookups));
    setMode('edit');
    setMessage(null);
  };

  const submit = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const validationError = validateForm(
        resource,
        form,
        records,
        selected,
        lookups,
      );

      if (validationError) {
        setError(validationError);
        return;
      }

      const payload = toPayload(resource, form);
      console.log(`Saving ${resource.endpoint}`, payload);

      if (mode === 'create') {
        await createRecord(resource.endpoint, payload);
        setMessage('Rekord został dodany.');
      } else if (mode === 'edit' && selected?.id) {
        await updateRecord(
          resource.endpoint,
          String(selected.id),
          payload,
        );
        setMessage('Rekord został zaktualizowany.');
      }

      setMode('list');
      setSelected(null);
      await load();
    } catch (caughtError) {
      const apiError =
        caughtError instanceof Error ? caughtError.message : 'Błąd API';
      setError(`Nie udało się zapisać danych: ${apiError}`);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSelected = async () => {
    if (!selected?.id) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      await deleteRecord(resource.endpoint, String(selected.id));
      setMessage('Rekord został usunięty.');
      setSelected(null);
      setMode('list');
      await load();
    } catch (caughtError) {
      const apiError =
        caughtError instanceof Error ? caughtError.message : 'Błąd API';
      console.log('Delete failed', {
        error: apiError,
        resource: resource.key,
      });
      setError(getDeleteErrorMessage(resource.key));
    } finally {
      setIsLoading(false);
    }
  };

  const acceptServiceTicket = async () => {
    if (!selected?.id || resource.key !== 'serviceTickets') {
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const updateForm = {
        ...withLookupDefaults(
          formFromRecord(resource, selected),
          resource,
          lookups,
        ),
        status: 'Przyjęte',
      };

      await updateRecord(
        resource.endpoint,
        String(selected.id),
        toPayload(resource, updateForm),
      );
      setMessage('Zgłoszenie zostało przyjęte.');
      setMode('list');
      setSelected(null);
      await load();
    } catch (caughtError) {
      const apiError =
        caughtError instanceof Error ? caughtError.message : 'Błąd API';
      setError(`Nie udało się przyjąć zgłoszenia: ${apiError}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openAssignPart = () => {
    const firstPartId = lookups.serviceParts?.[0]?.id;

    setReportPartForm({
      servicePartId: firstPartId ? String(firstPartId) : '',
      quantityUsed: '1',
      note: '',
    });
    setError(null);
    setMessage(null);
    setMode('assignPart');
  };

  const submitReportPart = async () => {
    if (!selected?.id || resource.key !== 'serviceReports') {
      return;
    }

    const quantityUsed = Number(reportPartForm.quantityUsed);

    if (!reportPartForm.servicePartId || !quantityUsed || quantityUsed <= 0) {
      setError('Wybierz część zapasową i podaj poprawną ilość.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const assigned = await assignServiceReportPart(String(selected.id), {
        servicePartId: reportPartForm.servicePartId,
        quantityUsed,
        note: reportPartForm.note.trim(),
      });
      const currentParts = Array.isArray(selected.parts) ? selected.parts : [];

      setSelected({
        ...selected,
        parts: [...currentParts, assigned],
      });
      setMessage('Część została dodana do raportu.');
      setMode('details');
      await load();
    } catch (caughtError) {
      const apiError =
        caughtError instanceof Error ? caughtError.message : 'Błąd API';
      setError(`Nie udało się dodać części do raportu: ${apiError}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={sharedStyles.container}>
      <AppHeader title={resource.pluralLabel} />
      <ScrollView contentContainerStyle={sharedStyles.screenBody}>
        <View style={styles.toolbar}>
          <Pressable
            style={[sharedStyles.button, sharedStyles.buttonGhost]}
            onPress={onBack ?? load}>
            <Text style={sharedStyles.buttonTextDark}>
              {onBack ? 'Wstecz' : 'Odśwież'}
            </Text>
          </Pressable>
          <Pressable style={sharedStyles.button} onPress={openCreate}>
            <Text style={sharedStyles.buttonText}>Dodaj</Text>
          </Pressable>
        </View>

        {notice ? (
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>{notice}</Text>
          </View>
        ) : null}

        {error ? (
          <View style={sharedStyles.errorBox}>
            <Text style={sharedStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {isLoading && mode === 'list' ? (
          <ActivityIndicator color={colors.primary} />
        ) : null}

        {mode === 'list' ? (
          <ListContent
            records={records}
            lookups={lookups}
            resource={resource}
            onAdd={openCreate}
            onPress={openDetails}
          />
        ) : null}

        {mode === 'details' && selected ? (
          <DetailsContent
            lookups={lookups}
            record={selected}
            resource={resource}
            selectedTitle={selectedTitle}
            onBack={() => setMode('list')}
            onDelete={removeSelected}
            onEdit={openEdit}
            onAddPart={
              resource.key === 'serviceReports' ? openAssignPart : undefined
            }
            onPrimaryAction={
              resource.key === 'serviceTickets'
                ? acceptServiceTicket
                : undefined
            }
            primaryActionLabel="Przyjmij zgłoszenie"
          />
        ) : null}

        {mode === 'create' || mode === 'edit' ? (
          <FormContent
            form={form}
            isLoading={isLoading}
            lookups={lookups}
            mode={mode}
            onCancel={() => setMode(selected ? 'details' : 'list')}
            onChange={(key, value) =>
              setForm(previous =>
                updateFormValue(resource.key, previous, key, value, lookups),
              )
            }
            onSubmit={submit}
            resource={resource}
          />
        ) : null}

        {mode === 'assignPart' && selected ? (
          <ReportPartFormContent
            form={reportPartForm}
            isLoading={isLoading}
            lookups={lookups}
            onCancel={() => setMode('details')}
            onChange={(key, value) =>
              setReportPartForm(previous => ({...previous, [key]: value}))
            }
            onSubmit={submitReportPart}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

function withLookupDefaults(
  form: Record<string, string>,
  resource: typeof resourceByKey[keyof typeof resourceByKey],
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>,
) {
  const next = {...form};

  if (resource.key === 'serviceTickets') {
    return next;
  }

  resource.fields.forEach(field => {
    if (
      field.relationResource &&
      !next[field.key] &&
      lookups[field.relationResource]?.[0]?.id
    ) {
      next[field.key] = String(lookups[field.relationResource]?.[0].id);
    }
  });

  return next;
}

function updateFormValue(
  resourceKey: ResourceKey,
  previous: Record<string, string>,
  key: string,
  value: string,
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>,
) {
  if (resourceKey !== 'serviceTickets' || key !== 'clientId') {
    return {...previous, [key]: value};
  }

  const selectedDevice = lookups.devices?.find(
    device => String(device.id) === previous.deviceId,
  );
  const selectedDeviceBelongsToClient =
    selectedDevice && String(selectedDevice.clientId ?? '') === value;

  return {
    ...previous,
    clientId: value,
    deviceId: selectedDeviceBelongsToClient ? previous.deviceId : '',
  };
}

function getDeleteErrorMessage(resourceKey: ResourceKey) {
  switch (resourceKey) {
    case 'clients':
      return 'Nie można usunąć klienta, ponieważ ma przypisane urządzenia lub zgłoszenia serwisowe.';
    case 'devices':
      return 'Nie można usunąć urządzenia, ponieważ ma przypisane zadania lub zgłoszenia serwisowe.';
    case 'employees':
      return 'Nie można usunąć pracownika, ponieważ ma przypisane zadania lub raporty serwisowe.';
    case 'serviceTickets':
      return 'Nie można usunąć zgłoszenia, ponieważ ma przypisane raporty serwisowe.';
    default:
      return 'Nie można usunąć rekordu, ponieważ jest powiązany z innymi danymi w systemie.';
  }
}

function validateForm(
  resource: typeof resourceByKey[keyof typeof resourceByKey],
  form: Record<string, string>,
  records: ApiRecord[],
  selected: ApiRecord | null,
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>,
) {
  if (resource.key === 'serviceTickets') {
    const clientId = form.clientId?.trim() ?? '';
    const deviceId = form.deviceId?.trim() ?? '';
    const title = form.title?.trim() ?? '';

    if (!clientId) {
      return 'Wybierz klienta dla zgłoszenia.';
    }

    const clientDevices = getDevicesForClient(lookups.devices ?? [], clientId);

    if (clientDevices.length === 0) {
      return 'Ten klient nie ma jeszcze przypisanych urządzeń.';
    }

    if (!deviceId) {
      return 'Wybierz urządzenie dla zgłoszenia.';
    }

    const deviceBelongsToClient = clientDevices.some(
      device => String(device.id) === deviceId,
    );

    if (!deviceBelongsToClient) {
      return 'Wybrane urządzenie nie należy do wybranego klienta.';
    }

    if (!title) {
      return 'Wpisz tytuł zgłoszenia.';
    }
  }

  const missingField = resource.fields
    .filter(field => field.required && !field.hidden)
    .find(field => !form[field.key]?.trim());

  if (missingField) {
    return `Uzupełnij pole: ${missingField.label}.`;
  }

  if (resource.key === 'serviceTickets') {
    if (!form.clientId?.trim()) {
      return 'Wybierz klienta dla zgłoszenia.';
    }

    if (!form.deviceId?.trim()) {
      return 'Wybierz urządzenie dla zgłoszenia.';
    }

    if (!form.title?.trim()) {
      return 'Wpisz tytuł zgłoszenia.';
    }
  }

  if (resource.key === 'serviceTickets') {
    const clientId = form.clientId?.trim() ?? '';
    const deviceId = form.deviceId?.trim() ?? '';
    const clientDevices = getDevicesForClient(lookups.devices ?? [], clientId);

    if (clientDevices.length === 0) {
      return 'Ten klient nie ma jeszcze przypisanych urządzeń.';
    }

    const deviceBelongsToClient = clientDevices.some(
      device => String(device.id) === deviceId,
    );

    if (!deviceBelongsToClient) {
      return 'Wybrane urządzenie nie należy do wybranego klienta.';
    }
  }

  if (resource.key === 'devices') {
    const serialNumber = form.serialNumber?.trim().toLowerCase();

    if (!serialNumber) {
      return 'Wpisz numer seryjny urządzenia.';
    }

    const duplicate = records.some(record => {
      const recordSerialNumber = String(record.serialNumber ?? '')
        .trim()
        .toLowerCase();
      const isCurrentRecord =
        selected?.id !== undefined && String(record.id) === String(selected.id);

      return recordSerialNumber === serialNumber && !isCurrentRecord;
    });

    if (duplicate) {
      return 'Urządzenie z takim numerem seryjnym już istnieje.';
    }
  }

  return null;
}

function getDevicesForClient(devices: ApiRecord[], clientId: string) {
  return devices.filter(device => String(device.clientId ?? '') === clientId);
}

function ListContent({
  records,
  lookups,
  resource,
  onAdd,
  onPress,
}: {
  records: ApiRecord[];
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>;
  resource: typeof resourceByKey[keyof typeof resourceByKey];
  onAdd: () => void;
  onPress: (record: ApiRecord) => void;
}) {
  if (records.length === 0) {
    return (
      <View style={sharedStyles.card}>
        <Text style={styles.emptyTitle}>Brak danych</Text>
        <Text style={sharedStyles.muted}>
          Dodaj pierwszy rekord dla sekcji {resource.pluralLabel}.
        </Text>
        <Pressable style={styles.emptyButton} onPress={onAdd}>
          <Text style={sharedStyles.buttonText}>Dodaj</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {records.map(record => (
        <ResourceCard
          key={String(record.id)}
          lookups={lookups}
          record={record}
          resource={resource}
          onPress={() => onPress(record)}
        />
      ))}
    </View>
  );
}

function DetailsContent({
  lookups,
  record,
  resource,
  selectedTitle,
  onAddPart,
  onBack,
  onDelete,
  onEdit,
  onPrimaryAction,
  primaryActionLabel,
}: {
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>;
  record: ApiRecord;
  resource: typeof resourceByKey[keyof typeof resourceByKey];
  selectedTitle: string;
  onAddPart?: () => void;
  onBack: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}) {
  return (
    <View style={sharedStyles.card}>
      <Text style={styles.detailsTitle}>{selectedTitle}</Text>
      <View style={styles.detailsRows}>
        {getDetailsRows(resource, record, lookups).map(row => (
          <View key={row.label} style={styles.detailsRow}>
            <Text style={styles.detailsKey}>{row.label}</Text>
            <Text selectable style={styles.detailsValue}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
      {resource.key === 'serviceReports' ? (
        <ReportPartsSection
          lookups={lookups}
          onAddPart={onAddPart}
          report={record}
        />
      ) : null}
      <View style={styles.actions}>
        <Pressable style={[sharedStyles.button, sharedStyles.buttonGhost]} onPress={onBack}>
          <Text style={sharedStyles.buttonTextDark}>Lista</Text>
        </Pressable>
        <Pressable style={sharedStyles.button} onPress={onEdit}>
          <Text style={sharedStyles.buttonText}>Edytuj</Text>
        </Pressable>
        {onPrimaryAction ? (
          <Pressable style={styles.actionPrimary} onPress={onPrimaryAction}>
            <Text style={sharedStyles.buttonText}>
              {primaryActionLabel ?? 'Wykonaj'}
            </Text>
          </Pressable>
        ) : null}
        <Pressable
          style={[sharedStyles.button, sharedStyles.buttonDanger]}
          onPress={onDelete}>
          <Text style={sharedStyles.buttonText}>Usuń</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReportPartsSection({
  lookups,
  onAddPart,
  report,
}: {
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>;
  onAddPart?: () => void;
  report: ApiRecord;
}) {
  const parts = Array.isArray(report.parts) ? report.parts : [];

  return (
    <View style={styles.reportPartsSection}>
      <Text style={styles.sectionTitle}>Użyte części zapasowe</Text>
      {parts.length > 0 ? (
        <View style={styles.reportPartsList}>
          {parts.map((part, index) => {
            const servicePart = lookups.serviceParts?.find(
              item => String(item.id) === String(part.servicePartId ?? ''),
            );
            const partName = servicePart
              ? formatOptionLabel(servicePart, ['name', 'sku'])
              : String(part.servicePartId ?? '').slice(0, 8);

            return (
              <View key={String(part.id ?? index)} style={styles.reportPartCard}>
                <Text style={styles.reportPartTitle}>{partName}</Text>
                <Text style={sharedStyles.muted}>
                  Ilość: {String(part.quantityUsed ?? '-')}
                </Text>
                {part.note ? (
                  <Text style={sharedStyles.muted}>
                    Notatka: {String(part.note)}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={sharedStyles.muted}>
          Brak przypisanych części zapasowych. Części są przypisywane do
          raportu przez relację ServiceReportPart.
        </Text>
      )}
      {onAddPart ? (
        <Pressable style={styles.partButton} onPress={onAddPart}>
          <Text style={sharedStyles.buttonText}>Dodaj część do raportu</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function getDetailsRows(
  resource: typeof resourceByKey[keyof typeof resourceByKey],
  record: ApiRecord,
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>,
) {
  return resource.fields
    .filter(field => !field.hidden)
    .map(field => {
      const rawValue =
        record[field.key] ??
        record[field.payloadKey ?? field.key] ??
        field.defaultValue ??
        '';

      if (resource.key === 'serviceReports') {
        const summary = String(record.summary ?? '');

        if (field.key === 'description') {
          return {label: field.label, value: extractSummaryPart(summary, 'Opis')};
        }

        if (field.key === 'diagnosis') {
          return {
            label: field.label,
            value: extractSummaryPart(summary, 'Diagnoza'),
          };
        }

        if (field.key === 'solution') {
          return {
            label: field.label,
            value: extractSummaryPart(summary, 'Wykonane czynności'),
          };
        }

        if (field.key === 'warrantyDecision') {
          return {
            label: field.label,
            value: extractSummaryPart(summary, 'Decyzja gwarancyjna'),
          };
        }

        if (field.key === 'status') {
          return {
            label: field.label,
            value: extractSummaryPart(summary, 'Status raportu') || 'Roboczy',
          };
        }
      }

      if (field.relationResource && typeof rawValue === 'string') {
        const related = lookups[field.relationResource]?.find(
          item => String(item.id) === rawValue,
        );

        return {
          label: field.label,
          value: related
            ? formatOptionLabel(related, field.optionLabelFields)
            : rawValue.slice(0, 8),
        };
      }

      if (field.type === 'date' || isDateField(field.key)) {
        return {
          label: field.label,
          value: formatDate(rawValue),
        };
      }

      return {
        label: field.label,
        value:
          rawValue === null || rawValue === undefined || rawValue === ''
            ? '-'
            : String(rawValue),
      };
    });
}

function extractSummaryPart(summary: string, label: string) {
  const line = summary
    .split('\n')
    .find(item => item.toLowerCase().startsWith(`${label.toLowerCase()}:`));

  return line?.slice(label.length + 1).trim() || '-';
}

function FormContent({
  form,
  isLoading,
  lookups,
  mode,
  onCancel,
  onChange,
  onSubmit,
  resource,
}: {
  form: Record<string, string>;
  isLoading: boolean;
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>;
  mode: Mode;
  onCancel: () => void;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
  resource: typeof resourceByKey[keyof typeof resourceByKey];
}) {
  return (
    <View style={sharedStyles.card}>
      <Text style={styles.detailsTitle}>
        {mode === 'create' ? `Dodaj: ${resource.label}` : `Edytuj: ${resource.label}`}
      </Text>
      <View style={styles.formFields}>
        {resource.fields.filter(field => !field.hidden).map(field => (
          <View key={field.key}>
            {field.type === 'date' || isDateField(field.key) ? (
              <AppDatePicker
                label={`${field.label}${field.required ? ' *' : ''}`}
                onChange={value => onChange(field.key, value)}
                value={form[field.key]}
              />
            ) : (
              <>
                <Text style={sharedStyles.fieldLabel}>
                  {field.label}
                  {field.required ? ' *' : ''}
                </Text>
                {field.type === 'select' ? (
                  <SelectField
                    form={form}
                    field={field}
                    lookups={lookups}
                    onChange={value => onChange(field.key, value)}
                    resource={resource}
                    value={form[field.key]}
                  />
                ) : (
                  <TextInput
                    keyboardType={
                      field.type === 'number' ? 'numeric' : 'default'
                    }
                    multiline={field.key.toLowerCase().includes('description')}
                    onChangeText={value => onChange(field.key, value)}
                    placeholder={field.label}
                    placeholderTextColor={colors.muted}
                    style={sharedStyles.input}
                    value={form[field.key]}
                  />
                )}
              </>
            )}
          </View>
        ))}
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[sharedStyles.button, sharedStyles.buttonGhost]}
          onPress={onCancel}>
          <Text style={sharedStyles.buttonTextDark}>Anuluj</Text>
        </Pressable>
        <Pressable style={sharedStyles.button} onPress={onSubmit}>
          <Text style={sharedStyles.buttonText}>
            {isLoading ? 'Zapisywanie...' : 'Zapisz'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ReportPartFormContent({
  form,
  isLoading,
  lookups,
  onCancel,
  onChange,
  onSubmit,
}: {
  form: Record<string, string>;
  isLoading: boolean;
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>;
  onCancel: () => void;
  onChange: (key: string, value: string) => void;
  onSubmit: () => void;
}) {
  const serviceParts = lookups.serviceParts ?? [];

  return (
    <View style={sharedStyles.card}>
      <Text style={styles.detailsTitle}>Dodaj część do raportu</Text>
      <View style={styles.formFields}>
        <View>
          <Text style={sharedStyles.fieldLabel}>Część zapasowa *</Text>
          {serviceParts.length > 0 ? (
            <View style={styles.selectWrap}>
              {serviceParts.map(part => {
                const optionValue = String(part.id ?? '');
                const selected = optionValue === form.servicePartId;

                return (
                  <Pressable
                    key={optionValue}
                    onPress={() => onChange('servicePartId', optionValue)}
                    style={[
                      styles.selectOption,
                      selected ? styles.selectOptionActive : null,
                    ]}>
                    <Text
                      style={[
                        styles.selectOptionText,
                        selected ? styles.selectOptionTextActive : null,
                      ]}>
                      {formatOptionLabel(part, ['name', 'sku'])}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <View style={styles.selectEmpty}>
              <Text style={sharedStyles.muted}>
                Brak części zapasowych do wyboru. Najpierw dodaj część w
                sekcji Części.
              </Text>
            </View>
          )}
        </View>
        <View>
          <Text style={sharedStyles.fieldLabel}>Ilość *</Text>
          <TextInput
            keyboardType="numeric"
            onChangeText={value => onChange('quantityUsed', value)}
            placeholder="Ilość"
            placeholderTextColor={colors.muted}
            style={sharedStyles.input}
            value={form.quantityUsed}
          />
        </View>
        <View>
          <Text style={sharedStyles.fieldLabel}>Notatka</Text>
          <TextInput
            multiline
            onChangeText={value => onChange('note', value)}
            placeholder="Notatka"
            placeholderTextColor={colors.muted}
            style={sharedStyles.input}
            value={form.note}
          />
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={[sharedStyles.button, sharedStyles.buttonGhost]}
          onPress={onCancel}>
          <Text style={sharedStyles.buttonTextDark}>Anuluj</Text>
        </Pressable>
        <Pressable style={sharedStyles.button} onPress={onSubmit}>
          <Text style={sharedStyles.buttonText}>
            {isLoading ? 'Zapisywanie...' : 'Zapisz'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function SelectField({
  form,
  field,
  lookups,
  onChange,
  resource,
  value,
}: {
  form: Record<string, string>;
  field: ResourceField;
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>;
  onChange: (value: string) => void;
  resource: typeof resourceByKey[keyof typeof resourceByKey];
  value: string;
}) {
  const options = getSelectOptions(resource, field, form, lookups);

  if (options.length === 0) {
    return (
      <View style={styles.selectEmpty}>
        <Text style={sharedStyles.muted}>
          {getSelectEmptyMessage(resource, field, form)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.selectWrap}>
      {options.map(option => {
        const optionValue =
          typeof option === 'string' ? option : String(option.id ?? '');
        const selected = optionValue === value;
        const optionLabel =
          typeof option === 'string'
            ? option
            : formatOptionLabel(option, field.optionLabelFields);

        return (
          <Pressable
            key={optionValue}
            onPress={() => onChange(optionValue)}
            style={[styles.selectOption, selected ? styles.selectOptionActive : null]}>
            <Text
              style={[
                styles.selectOptionText,
                selected ? styles.selectOptionTextActive : null,
              ]}>
              {optionLabel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function getSelectOptions(
  resource: typeof resourceByKey[keyof typeof resourceByKey],
  field: ResourceField,
  form: Record<string, string>,
  lookups: Partial<Record<ResourceKey, ApiRecord[]>>,
) {
  if (
    resource.key === 'serviceTickets' &&
    field.key === 'deviceId' &&
    field.relationResource === 'devices'
  ) {
    const clientId = form.clientId?.trim();
    return clientId ? getDevicesForClient(lookups.devices ?? [], clientId) : [];
  }

  return field.relationResource
    ? lookups[field.relationResource] ?? []
    : field.options ?? [];
}

function getSelectEmptyMessage(
  resource: typeof resourceByKey[keyof typeof resourceByKey],
  field: ResourceField,
  form: Record<string, string>,
) {
  if (resource.key === 'devices' && field.key === 'clientId') {
    return 'Najpierw dodaj klienta w menu Więcej → Klienci.';
  }

  if (resource.key === 'serviceTickets' && field.key === 'deviceId') {
    return form.clientId?.trim()
      ? 'Ten klient nie ma jeszcze przypisanych urządzeń.'
      : 'Najpierw wybierz klienta.';
  }

  return 'Brak danych do wyboru. Najpierw dodaj wymagane rekordy.';
}

function formatOptionLabel(record: ApiRecord, fields?: string[]) {
  const label = (fields ?? ['name', 'title', 'model', 'lastName'])
    .map(field => record[field])
    .filter(value => value !== null && value !== undefined && value !== '')
    .map(String)
    .join(' ');

  return label || String(record.id ?? '').slice(0, 8);
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 18,
  },
  detailsKey: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    width: 130,
  },
  detailsRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 11,
  },
  detailsRows: {
    marginTop: 10,
  },
  detailsTitle: {
    color: colors.header,
    fontSize: 21,
    fontWeight: '900',
  },
  detailsValue: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyButton: {
    ...sharedStyles.button,
    marginTop: 16,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  formFields: {
    gap: 12,
    marginTop: 16,
  },
  list: {
    gap: 12,
  },
  messageBox: {
    backgroundColor: colors.primarySoft,
    borderColor: '#93C5FD',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  messageText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  actionPrimary: {
    ...sharedStyles.button,
    backgroundColor: colors.primary,
  },
  noticeBox: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  noticeText: {
    color: colors.header,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  partButton: {
    ...sharedStyles.button,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  reportPartCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
    padding: 13,
  },
  reportPartTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  reportPartsList: {
    gap: 8,
    marginTop: 8,
  },
  reportPartsSection: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 16,
  },
  sectionTitle: {
    color: colors.header,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },
  selectEmpty: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  selectOption: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  selectOptionActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryDark,
  },
  selectOptionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  selectOptionTextActive: {
    color: colors.primaryDark,
  },
  selectWrap: {
    gap: 8,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
});
