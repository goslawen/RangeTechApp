export const API_BASE_URL = 'http://10.0.2.2:5000/api';

export type ApiHealth = {
  service: string;
  status: string;
  timestampUtc: string;
};

export async function fetchApiHealth(): Promise<ApiHealth> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(await buildApiError(response));
  }

  return response.json();
}

export type ApiValue = string | number | boolean | null | ApiRecord[];
export type ApiRecord = Record<string, ApiValue>;

export async function getRecords(endpoint: string): Promise<ApiRecord[]> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`);

  if (!response.ok) {
    throw new Error(await buildApiError(response));
  }

  return response.json();
}

export async function createRecord(
  endpoint: string,
  payload: ApiRecord,
): Promise<ApiRecord> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await buildApiError(response));
  }

  return response.json();
}

export async function updateRecord(
  endpoint: string,
  id: string,
  payload: ApiRecord,
): Promise<ApiRecord> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await buildApiError(response));
  }

  return response.json();
}

export async function assignServiceReportPart(
  reportId: string,
  payload: ApiRecord,
): Promise<ApiRecord> {
  const response = await fetch(`${API_BASE_URL}/ServiceReports/${reportId}/parts`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await buildApiError(response));
  }

  return response.json();
}

export async function deleteRecord(
  endpoint: string,
  id: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(await buildApiError(response));
  }
}

async function buildApiError(response: Response) {
  const details = (await response.text()).trim();
  const message = details || `API returned ${response.status}`;

  console.warn(
    details ? `API returned ${response.status}: ${details}` : message,
  );
  return message;
}
