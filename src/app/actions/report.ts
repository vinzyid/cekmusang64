'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitAnonymousReport(formData: FormData) {
  try {
    const supabase = await createClient();

    // 1. Extract report data
    const reporter_name = formData.get('reporterName') as string;
    const reporter_email = formData.get('reporterEmail') as string;
    const reported_name = formData.get('reportedName') as string;
    const facebook_url = formData.get('facebookUrl') as string;
    const whatsapp_number = formData.get('whatsappNumber') as string;
    const bank_account = formData.get('bankAccount') as string;
    const marketplace = formData.get('marketplace') as string;
    const category = formData.get('categoryId') as string;
    const transaction_amount = parseFloat(formData.get('transactionValue') as string);
    const description = formData.get('description') as string;

    // Insert into reports table
    const { data: reportData, error: reportError } = await supabase
      .from('reports')
      .insert([
        {
          reporter_name,
          reporter_email,
          reported_name,
          facebook_url: facebook_url || null,
          whatsapp_number: whatsapp_number || null,
          bank_account: bank_account || null,
          marketplace,
          category,
          transaction_amount,
          description,
          status: 'pending'
        }
      ])
      .select('id')
      .single();

    if (reportError) {
      console.error('Error inserting report:', reportError);
      return { success: false, error: 'Gagal menyimpan laporan. Silakan coba lagi.' };
    }

    const reportId = reportData.id;

    // 2. Extract and Upload Files
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('evidence_') && value instanceof File) {
        files.push(value);
      }
    }

    const evidenceInserts = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${reportId}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('evidence')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        continue; // Skip failed uploads but continue with others
      }

      const { data: publicUrlData } = supabase.storage
        .from('evidence')
        .getPublicUrl(filePath);

      evidenceInserts.push({
        report_id: reportId,
        file_url: publicUrlData.publicUrl,
        file_type: file.type || 'image/jpeg'
      });
    }

    // Insert evidence records if any
    if (evidenceInserts.length > 0) {
      const { error: evidenceError } = await supabase
        .from('evidence')
        .insert(evidenceInserts);

      if (evidenceError) {
        console.error('Error inserting evidence records:', evidenceError);
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Unexpected error in submitAnonymousReport:', err);
    return { success: false, error: 'Terjadi kesalahan sistem.' };
  }
}
