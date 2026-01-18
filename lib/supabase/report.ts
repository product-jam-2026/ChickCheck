import { createClient } from '@/lib/supabase/client'; // Adjust this import based on your client initialization file

const supabase = createClient();

/**
 * Fills a new row in the report table.
 */
export const createIncidentReport = async (reportData: {
  user_id: string;
  type_of_incident: string;
  description_of_incident: string;
}) => {
  const { error } = await supabase
    .from('report')
    .insert([
      {
        user_id: reportData.user_id,
        type_of_incident: reportData.type_of_incident,
        description_of_incident: reportData.description_of_incident,
      },
    ]);

  if (error) {
    console.error('Error inserting report in supabase:', error.message);
    throw error;
  }
};