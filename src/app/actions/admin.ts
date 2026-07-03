'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateReportStatus(reportId: string, status: string, adminNote?: string) {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', authData.user.id)
      .single();

    if (userData?.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    // Update status
    const updateData: any = { status };
    if (adminNote) {
      updateData.admin_note = adminNote;
    }

    const { error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', reportId);

    if (error) {
      console.error('Error updating report status:', error);
      return { success: false, error: 'Gagal mengubah status laporan' };
    }

    // Log the action
    await supabase
      .from('report_logs')
      .insert({
        report_id: reportId,
        action: `Status changed to ${status}`,
        performed_by: authData.user.id
      });

    revalidatePath('/admin/reports');
    revalidatePath(`/admin/reports/${reportId}`);
    revalidatePath('/'); // Home page showing latest reports
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in updateReportStatus:', err);
    return { success: false, error: 'Terjadi kesalahan sistem' };
  }
}
