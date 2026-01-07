import { createClient } from '@/lib/supabase/client'; // Adjust this import based on your client initialization file

import { useState } from 'react';
import { updateUserProfile, submitIncidentReport } from '@/lib/supabase/report';

const supabase = createClient();

/**
 * Updates the user's profile with gender and phone number from the UI.
 */
export const updatePublicUser = async (userId: string, gender: string, phone: string) => {
  const { error } = await supabase
    .from('users')
    .update({ 
      gender: gender, 
      phone_number: phone 
    })
    .eq('id', userId);

  if (error) throw error;
};

/**
 * Fills a new row in the report table.
 */
export const createIncidentReport = async (reportData: {
  userId: string;
  type: string;
  platforms: string[]; // This will be stored as jsonb
  description: string;
  reported: boolean;
  links: string[]; // This will be stored as jsonb
  details: string;
  terms: boolean;
}) => {
  const { data, error } = await supabase
    .from('report')
    .insert([
      {
        user_id: reportData.userId,
        type_of_incident: reportData.type,
        where_incident_occur: reportData.platforms,
        description_of_incident: reportData.description,
        reported_to_application: reportData.reported,
        links_to_incident: reportData.links,
        further_details: reportData.details,
        terms_accepted: reportData.terms,
      },
    ])
    .select();

  if (error) {
    console.error('Error inserting report in supabase:', error.message);
    throw error;
  }
};