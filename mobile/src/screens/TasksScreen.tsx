import React, {useCallback, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {ApiRecord, getRecords, updateRecord} from '../api/client';
import {AppHeader} from '../components/AppHeader';
import {StatusBadge} from '../components/StatusBadge';
import {colors, sharedStyles} from '../theme/styles';
import {formatDate} from '../utils/date';

type WorkTask = ApiRecord;

export function TasksScreen(): React.JSX.Element {
  const [employees, setEmployees] = useState<ApiRecord[]>([]);
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [devices, setDevices] = useState<ApiRecord[]>([]);
  const [taskTypes, setTaskTypes] = useState<ApiRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentEmployee = employees[0] ?? null;

  const currentEmployeeTasks = useMemo(() => {
    if (!currentEmployee?.id) {
      return [];
    }

    return tasks.filter(
      task => String(task.employeeId ?? '') === String(currentEmployee.id),
    );
  }, [currentEmployee, tasks]);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [employeeRecords, taskRecords, deviceRecords, taskTypeRecords] =
        await Promise.all([
          getRecords('Employees'),
          getRecords('WorkTasks'),
          getRecords('Devices'),
          getRecords('TaskTypes'),
        ]);

      setEmployees(employeeRecords);
      setTasks(taskRecords);
      setDevices(deviceRecords);
      setTaskTypes(taskTypeRecords);
    } catch {
      setError('Nie udało się odświeżyć listy zadań.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const updateStatus = async (task: WorkTask, status: string) => {
    const taskId = String(task.id ?? '');

    if (!taskId) {
      return;
    }

    setUpdatingTaskId(taskId);
    setError(null);

    try {
      await updateRecord('WorkTasks', taskId, {
        employeeId: String(task.employeeId ?? ''),
        deviceId: String(task.deviceId ?? ''),
        taskTypeId: String(task.taskTypeId ?? ''),
        title: String(task.title ?? ''),
        description: String(task.description ?? ''),
        status,
        scheduledAtUtc:
          String(task.scheduledAtUtc ?? task.plannedDate ?? '') ||
          new Date().toISOString(),
        completedAtUtc:
          status === 'Zakończone'
            ? new Date().toISOString()
            : task.completedAtUtc ?? null,
      });

      await loadTasks();
    } catch {
      setError('Nie udało się zaktualizować statusu zadania.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  return (
    <View style={sharedStyles.container}>
      <AppHeader title="Twoja lista zadań" />
      <ScrollView contentContainerStyle={sharedStyles.screenBody}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <View style={styles.infoText}>
              <Text style={styles.description}>
                Zadania przypisane do aktualnie zalogowanego pracownika.
              </Text>
              {currentEmployee ? (
                <Text style={styles.employeeText}>
                  Pracownik: {formatEmployeeName(currentEmployee)}
                </Text>
              ) : null}
            </View>
            <Pressable
              disabled={isLoading}
              onPress={loadTasks}
              style={[sharedStyles.button, styles.refreshButton]}>
              <Text style={sharedStyles.buttonText}>
                {isLoading ? 'Odświeżanie...' : 'Odśwież'}
              </Text>
            </Pressable>
          </View>
        </View>

        {error ? (
          <View style={sharedStyles.errorBox}>
            <Text style={sharedStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={sharedStyles.muted}>Odświeżanie...</Text>
          </View>
        ) : null}

        {!isLoading && employees.length === 0 ? (
          <EmptyState message="Brak pracowników. Dodaj pracownika w menu Więcej → Pracownicy." />
        ) : null}

        {!isLoading &&
        currentEmployee &&
        currentEmployeeTasks.length === 0 ? (
          <EmptyState
            message="Brak zadań przypisanych do tego pracownika."
            tip="Utwórz zadanie w menu Więcej → Zadania i wybierz tego pracownika."
          />
        ) : null}

        {currentEmployeeTasks.map(task => (
          <TaskCard
            key={String(task.id)}
            devices={devices}
            isUpdating={updatingTaskId === String(task.id)}
            task={task}
            taskTypes={taskTypes}
            onUpdateStatus={updateStatus}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function EmptyState({message, tip}: {message: string; tip?: string}) {
  return (
    <View style={sharedStyles.card}>
      <Text style={styles.emptyTitle}>{message}</Text>
      {tip ? <Text style={sharedStyles.muted}>{tip}</Text> : null}
    </View>
  );
}

function TaskCard({
  devices,
  isUpdating,
  task,
  taskTypes,
  onUpdateStatus,
}: {
  devices: ApiRecord[];
  isUpdating: boolean;
  task: WorkTask;
  taskTypes: ApiRecord[];
  onUpdateStatus: (task: WorkTask, status: string) => void;
}) {
  const status = String(task.status ?? 'Nowe');
  const isInProgress = status === 'W realizacji' || status === 'InProgress';
  const isDone = status === 'Zakończone' || status === 'Done';
  const device = devices.find(item => String(item.id) === String(task.deviceId));
  const taskType = taskTypes.find(
    item => String(item.id) === String(task.taskTypeId),
  );
  const actionLabel = isDone
    ? 'Zakończone'
    : isInProgress
      ? 'Zakończ'
      : 'Rozpocznij';
  const nextStatus = isInProgress ? 'Zakończone' : 'W realizacji';

  return (
    <View style={sharedStyles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardMain}>
          <Text style={styles.title}>{String(task.title ?? 'Zadanie')}</Text>
          {task.description ? (
            <Text style={sharedStyles.muted}>{String(task.description)}</Text>
          ) : null}
          <Text style={sharedStyles.muted}>
            Urządzenie: {device ? formatDeviceName(device) : fallbackId(task.deviceId)}
          </Text>
        </View>
        <View style={styles.badges}>
          <StatusBadge value={status} />
          <StatusBadge value={getTaskPriority(task)} />
        </View>
      </View>

      <View style={styles.metaGrid}>
        <Meta
          label="Typ"
          value={taskType ? String(taskType.name ?? 'Typ zadania') : fallbackId(task.taskTypeId)}
        />
        <Meta
          label="Termin"
          value={formatDate(task.scheduledAtUtc ?? task.plannedDate)}
        />
      </View>

      <View style={styles.actions}>
        <Pressable style={[sharedStyles.button, sharedStyles.buttonGhost]}>
          <Text style={sharedStyles.buttonTextDark}>Szczegóły</Text>
        </Pressable>
        <Pressable
          disabled={isDone || isUpdating}
          onPress={() => onUpdateStatus(task, nextStatus)}
          style={[
            sharedStyles.button,
            isDone || isUpdating ? styles.disabledButton : styles.primaryButton,
          ]}>
          <Text style={sharedStyles.buttonText}>
            {isUpdating ? 'Zapisywanie...' : actionLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Meta({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function formatEmployeeName(employee: ApiRecord) {
  return (
    [employee.firstName, employee.lastName].filter(Boolean).join(' ') ||
    fallbackId(employee.id)
  );
}

function formatDeviceName(device: ApiRecord) {
  return (
    [device.model ?? device.name, device.serialNumber]
      .filter(Boolean)
      .join(' / ') || fallbackId(device.id)
  );
}

function getTaskPriority(task: WorkTask) {
  if (task.priority) {
    return String(task.priority);
  }

  const description = String(task.description ?? '');
  const priorityLine = description
    .split('\n')
    .find(line => line.toLowerCase().startsWith('priorytet:'));

  return priorityLine?.slice('priorytet:'.length).trim() || 'Normalny';
}

function fallbackId(value: unknown) {
  return value ? String(value).slice(0, 8) : 'Brak danych';
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  badges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  cardMain: {
    flex: 1,
    gap: 6,
  },
  description: {
    color: colors.header,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  disabledButton: {
    backgroundColor: colors.muted,
  },
  employeeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  infoCard: {
    ...sharedStyles.card,
    backgroundColor: colors.steelSoft,
  },
  infoHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  infoText: {
    flex: 1,
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  metaItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 10,
  },
  metaLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
});
