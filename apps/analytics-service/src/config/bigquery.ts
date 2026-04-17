import { BigQuery } from '@google-cloud/bigquery';
import dotenv from 'dotenv';

dotenv.config();

const projectId = process.env.GCP_PROJECT_ID || 'crowza-project';
const keyFilename = process.env.GCP_KEY_FILE || undefined;

export const bigquery = new BigQuery({
  projectId,
  keyFilename,
});

export const dataset = bigquery.dataset(process.env.BIGQUERY_DATASET || 'venue_analytics');
export const tablesFor = {
  occupancy: dataset.table('occupancy_events'),
  incidents: dataset.table('incident_events'),
  analytics: dataset.table('analytics_data'),
};

export async function queryBigQuery(query: string, params: any[] = []): Promise<any[]> {
  const [rows] = await bigquery.query({ query, params });
  return rows;
}

export async function insertAnalyticsEvent(
  eventType: string,
  data: Record<string, any>
): Promise<void> {
  const table = dataset.table('events');
  const rows = [
    {
      eventType,
      timestamp: new Date().toISOString(),
      ...data,
    },
  ];

  try {
    await table.insert(rows);
  } catch (error) {
    console.error('Error inserting analytics event:', error);
    throw error;
  }
}
