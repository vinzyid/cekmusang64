import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const email = 'admin@cekmusang64.id';
  const password = 'AdminPassword123!';

  console.log('Membuat akun admin...');
  
  // Create user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
        console.log(`Akun ${email} sudah terdaftar. Menghapus akun lama...`);
        const { data: usersData } = await supabase.auth.admin.listUsers();
        const user = usersData.users.find(u => u.email === email);
        if (user) {
            await supabase.auth.admin.deleteUser(user.id);
            console.log('Akun lama dihapus. Membuat ulang...');
            const { data: newData, error: newError } = await supabase.auth.admin.createUser({
              email,
              password,
              email_confirm: true,
            });
            if (newError) {
              console.error('Gagal membuat ulang:', newError);
              return;
            }
            await setAdminRole(newData.user.id, email, password);
        }
        return;
    }
    console.error('Error membuat user:', authError);
    return;
  }

  const userId = authData.user.id;
  await setAdminRole(userId, email, password);
}

async function setAdminRole(userId, email, password) {
  // Update role to admin in public.users
  const { error: updateError } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (updateError) {
    console.error('Error mengupdate role di public.users:', updateError);
    // It's possible the trigger hasn't finished, wait a bit and retry
    console.log('Mencoba lagi dalam 2 detik...');
    await new Promise(r => setTimeout(r, 2000));
    const { error: retryError } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', userId);
      
    if (retryError) {
       console.error('Gagal mengupdate role:', retryError);
       return;
    }
  }

  console.log(`\n================================`);
  console.log(`✅ Sukses! Akun Admin Berhasil Dibuat.`);
  console.log(`📧 Email    : ${email}`);
  console.log(`🔑 Password : ${password}`);
  console.log(`================================\n`);
}

main();
