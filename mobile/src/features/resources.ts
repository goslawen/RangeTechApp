import {ApiRecord} from '../api/client';

export type FieldType = 'text' | 'number' | 'date' | 'select';

export type ResourceField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  hidden?: boolean;
  defaultValue?: string;
  includeInPayload?: boolean;
  options?: string[];
  optionLabelFields?: string[];
  payloadKey?: string;
  relationResource?: ResourceKey;
};

export type ResourceConfig = {
  key: ResourceKey;
  label: string;
  pluralLabel: string;
  endpoint: string;
  fields: ResourceField[];
  titleField: string;
  subtitleFields: string[];
  statusField?: string;
  priorityField?: string;
};

export type ResourceKey =
  | 'employees'
  | 'clients'
  | 'devices'
  | 'taskTypes'
  | 'workTasks'
  | 'serviceTickets'
  | 'serviceReports'
  | 'serviceParts';

const nowIso = () => new Date().toISOString();

export const resources: ResourceConfig[] = [
  {
    key: 'employees',
    label: 'Pracownik',
    pluralLabel: 'Pracownicy',
    endpoint: 'Employees',
    titleField: 'lastName',
    subtitleFields: ['firstName', 'email', 'role'],
    fields: [
      {key: 'firstName', label: 'Imię', type: 'text', required: true},
      {key: 'lastName', label: 'Nazwisko', type: 'text', required: true},
      {key: 'email', label: 'Email', type: 'text', required: true},
      {key: 'role', label: 'Rola', type: 'text', required: true},
    ],
  },
  {
    key: 'clients',
    label: 'Klient',
    pluralLabel: 'Klienci',
    endpoint: 'Clients',
    titleField: 'name',
    subtitleFields: ['email', 'phone', 'address'],
    fields: [
      {key: 'name', label: 'Nazwa', type: 'text', required: true},
      {key: 'email', label: 'Email', type: 'text'},
      {key: 'phone', label: 'Telefon', type: 'text'},
      {key: 'address', label: 'Adres', type: 'text'},
    ],
  },
  {
    key: 'devices',
    label: 'Urządzenie',
    pluralLabel: 'Urządzenia',
    endpoint: 'Devices',
    titleField: 'model',
    subtitleFields: ['clientId', 'serialNumber', 'deviceType'],
    statusField: 'status',
    fields: [
      {
        key: 'clientId',
        label: 'Klient',
        type: 'select',
        relationResource: 'clients',
        optionLabelFields: ['name', 'email'],
        required: true,
      },
      {
        key: 'name',
        label: 'Nazwa urządzenia',
        type: 'text',
        payloadKey: 'model',
        required: true,
      },
      {key: 'serialNumber', label: 'Numer seryjny', type: 'text', required: true},
      {
        key: 'deviceType',
        label: 'Typ urządzenia',
        type: 'text',
        defaultValue: 'Moduł RangeTech',
        includeInPayload: false,
      },
      {
        key: 'manufacturer',
        label: 'Producent',
        type: 'text',
        hidden: true,
        defaultValue: 'RangeTech',
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['Active', 'InService', 'Inactive'],
        required: true,
      },
    ],
  },
  {
    key: 'taskTypes',
    label: 'Typ zadania',
    pluralLabel: 'Typy zadań',
    endpoint: 'TaskTypes',
    titleField: 'name',
    subtitleFields: ['description'],
    fields: [
      {key: 'name', label: 'Nazwa', type: 'text', required: true},
      {key: 'description', label: 'Opis', type: 'text'},
    ],
  },
  {
    key: 'workTasks',
    label: 'Zadanie',
    pluralLabel: 'Zadania',
    endpoint: 'WorkTasks',
    titleField: 'title',
    subtitleFields: [
      'employeeId',
      'deviceId',
      'taskTypeId',
      'priority',
      'scheduledAtUtc',
    ],
    statusField: 'status',
    priorityField: 'priority',
    fields: [
      {key: 'title', label: 'Tytuł', type: 'text', required: true},
      {key: 'description', label: 'Opis', type: 'text'},
      {
        key: 'employeeId',
        label: 'Pracownik',
        type: 'select',
        relationResource: 'employees',
        optionLabelFields: ['firstName', 'lastName', 'email'],
        required: true,
      },
      {
        key: 'deviceId',
        label: 'Urządzenie',
        type: 'select',
        relationResource: 'devices',
        optionLabelFields: ['model', 'serialNumber'],
        required: true,
      },
      {
        key: 'taskTypeId',
        label: 'Typ zadania',
        type: 'select',
        relationResource: 'taskTypes',
        optionLabelFields: ['name'],
        required: true,
      },
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: ['New', 'InProgress', 'Done'],
        required: true,
      },
      {
        key: 'priority',
        label: 'Priorytet',
        type: 'select',
        options: ['Low', 'Normal', 'High', 'Critical'],
        defaultValue: 'Normal',
        includeInPayload: false,
      },
      {
        key: 'plannedDate',
        label: 'Termin',
        type: 'date',
        payloadKey: 'scheduledAtUtc',
      },
    ],
  },
  {
    key: 'serviceTickets',
    label: 'Zgłoszenie',
    pluralLabel: 'Zgłoszenia',
    endpoint: 'ServiceTickets',
    titleField: 'title',
    subtitleFields: ['clientId', 'deviceId', 'priority', 'reportedDate'],
    statusField: 'status',
    priorityField: 'priority',
    fields: [
      {
        key: 'clientId',
        label: 'Klient',
        type: 'select',
        relationResource: 'clients',
        optionLabelFields: ['name'],
        required: true,
      },
      {
        key: 'deviceId',
        label: 'Urządzenie',
        type: 'select',
        relationResource: 'devices',
        optionLabelFields: ['model', 'serialNumber'],
        required: true,
      },
      {key: 'title', label: 'Tytuł', type: 'text', required: true},
      {key: 'description', label: 'Opis', type: 'text'},
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
          'Nowe',
          'Przyjęte',
          'W realizacji',
          'Oczekuje na części',
          'Zakończone',
          'Odrzucone',
        ],
        required: true,
      },
      {
        key: 'priority',
        label: 'Priorytet',
        type: 'select',
        options: ['Low', 'Normal', 'High', 'Critical'],
        defaultValue: 'Normal',
        includeInPayload: false,
      },
      {
        key: 'reportedDate',
        label: 'Data zgłoszenia',
        type: 'date',
        payloadKey: 'createdAtUtc',
      },
      {key: 'closedAtUtc', label: 'Zamknięto UTC', type: 'date'},
    ],
  },
  {
    key: 'serviceReports',
    label: 'Raport',
    pluralLabel: 'Raporty',
    endpoint: 'ServiceReports',
    titleField: 'summary',
    subtitleFields: ['serviceTicketId', 'employeeId', 'diagnosis', 'solution'],
    statusField: 'status',
    fields: [
      {
        key: 'serviceTicketId',
        label: 'Zgłoszenie',
        type: 'select',
        relationResource: 'serviceTickets',
        optionLabelFields: ['title', 'status'],
        required: true,
      },
      {
        key: 'employeeId',
        label: 'Pracownik',
        type: 'select',
        relationResource: 'employees',
        optionLabelFields: ['firstName', 'lastName'],
        required: true,
      },
      {
        key: 'description',
        label: 'Opis wykonanych czynności',
        type: 'text',
        includeInPayload: false,
        required: true,
      },
      {
        key: 'diagnosis',
        label: 'Diagnoza',
        type: 'text',
        includeInPayload: false,
      },
      {
        key: 'solution',
        label: 'Rozwiązanie',
        type: 'text',
        includeInPayload: false,
      },
      {
        key: 'warrantyDecision',
        label: 'Decyzja gwarancyjna',
        type: 'select',
        options: [
          'Naprawa gwarancyjna zaakceptowana',
          'Odrzucenie gwarancji',
          'Naprawa odpłatna',
          'Wymaga dalszej diagnostyki',
        ],
        includeInPayload: false,
      },
      {
        key: 'status',
        label: 'Status raportu',
        type: 'select',
        options: ['Roboczy', 'Gotowy', 'Zamknięty'],
        includeInPayload: false,
      },
      {
        key: 'createdDate',
        label: 'Data utworzenia',
        type: 'date',
        payloadKey: 'performedAtUtc',
      },
    ],
  },
  {
    key: 'serviceParts',
    label: 'Część',
    pluralLabel: 'Części',
    endpoint: 'ServiceParts',
    titleField: 'name',
    subtitleFields: ['sku', 'unitPrice', 'stockQuantity'],
    fields: [
      {key: 'name', label: 'Nazwa', type: 'text', required: true},
      {key: 'sku', label: 'SKU', type: 'text', required: true},
      {key: 'unitPrice', label: 'Cena jednostkowa', type: 'number'},
      {key: 'stockQuantity', label: 'Stan magazynowy', type: 'number'},
    ],
  },
];

export const resourceByKey = Object.fromEntries(
  resources.map(resource => [resource.key, resource]),
) as Record<ResourceKey, ResourceConfig>;

export function createEmptyForm(resource: ResourceConfig): Record<string, string> {
  return Object.fromEntries(
    resource.fields.map(field => {
      if (field.defaultValue !== undefined) {
        return [field.key, field.defaultValue];
      }

      if (field.type === 'date' && !field.key.startsWith('closed') && !field.key.startsWith('completed')) {
        return [field.key, nowIso()];
      }

      if (field.type === 'number') {
        return [field.key, '0'];
      }

      if (field.options?.length) {
        return [field.key, field.options[0]];
      }

      return [field.key, ''];
    }),
  );
}

export function toPayload(
  resource: ResourceConfig,
  form: Record<string, string>,
): ApiRecord {
  if (resource.key === 'serviceTickets') {
    const priority = form.priority?.trim();
    const description = form.description?.trim() ?? '';

    return {
      clientId: form.clientId?.trim() ?? '',
      deviceId: form.deviceId?.trim() ?? '',
      title: form.title?.trim() ?? '',
      description: priority
        ? `${description}\nPriorytet: ${priority}`.trim()
        : description,
      status: form.status?.trim() ?? 'Nowe',
      createdAtUtc: form.reportedDate?.trim() || new Date().toISOString(),
      closedAtUtc: form.closedAtUtc?.trim() || null,
    };
  }

  if (resource.key === 'serviceReports') {
    const summary = [
      `Opis: ${form.description?.trim() ?? ''}`,
      `Diagnoza: ${form.diagnosis?.trim() ?? ''}`,
      `Wykonane czynności: ${form.solution?.trim() ?? ''}`,
      `Decyzja gwarancyjna: ${form.warrantyDecision?.trim() ?? ''}`,
      `Status raportu: ${form.status?.trim() ?? ''}`,
    ].join('\n');

    return {
      serviceTicketId: form.serviceTicketId?.trim() ?? null,
      employeeId: form.employeeId?.trim() ?? null,
      summary,
      performedAtUtc: form.createdDate?.trim() || new Date().toISOString(),
    };
  }

  return Object.fromEntries(
    resource.fields
      .filter(field => field.includeInPayload !== false)
      .map(field => {
      const value = form[field.key]?.trim() ?? '';
      const payloadKey = field.payloadKey ?? field.key;

      if (!value) {
        return [payloadKey, null];
      }

      if (field.type === 'number') {
        return [payloadKey, Number(value)];
      }

      return [payloadKey, value];
    }),
  );
}

export function formFromRecord(
  resource: ResourceConfig,
  record: ApiRecord,
): Record<string, string> {
  if (resource.key === 'serviceReports') {
    const summary = String(record.summary ?? '');

    return {
      ...createEmptyForm(resource),
      serviceTicketId: String(record.serviceTicketId ?? ''),
      employeeId: String(record.employeeId ?? ''),
      description: extractSummaryPart(summary, 'Opis'),
      diagnosis: extractSummaryPart(summary, 'Diagnoza'),
      solution: extractSummaryPart(summary, 'Wykonane czynności'),
      warrantyDecision:
        extractSummaryPart(summary, 'Decyzja gwarancyjna') ||
        'Wymaga dalszej diagnostyki',
      status: extractSummaryPart(summary, 'Status raportu') || 'Roboczy',
      createdDate: String(record.performedAtUtc ?? new Date().toISOString()),
    };
  }

  return Object.fromEntries(
    resource.fields.map(field => {
      const value = record[field.key] ?? record[field.payloadKey ?? field.key] ?? field.defaultValue;
      return [field.key, value === null || value === undefined ? '' : String(value)];
    }),
  );
}

function extractSummaryPart(summary: string, label: string) {
  const line = summary
    .split('\n')
    .find(item => item.toLowerCase().startsWith(`${label.toLowerCase()}:`));

  return line?.slice(label.length + 1).trim() ?? '';
}
