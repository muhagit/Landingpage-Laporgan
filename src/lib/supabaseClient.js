import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidUrl = (url) => {
  if (!url) return false
  if (url.includes('YOUR_SUPABASE') || url.includes('placeholder')) return false
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

export const supabase = isValidUrl(supabaseUrl) && supabaseAnonKey && !supabaseAnonKey.includes('YOUR_SUPABASE')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => {
          const token = localStorage.getItem('laporgan_admin_token');
          if (token === 'mock-session-token-123456') {
            return {
              data: {
                session: {
                  access_token: token,
                  user: { email: 'admin@laporgan.com', role: 'admin' }
                }
              },
              error: null
            };
          }
          return { data: { session: null }, error: null };
        },
        signInWithPassword: async ({ email, password }) => {
          if (email === 'admin@laporgan.com' && password === 'admin123') {
            return {
              data: {
                session: {
                  access_token: 'mock-session-token-123456',
                  user: { email: 'admin@laporgan.com', role: 'admin' }
                }
              },
              error: null
            };
          }
          return {
            data: {},
            error: new Error('Gagal Login. Untuk mode demo offline, gunakan email: admin@laporgan.com dan password: admin123')
          };
        },
        signOut: async () => {
          localStorage.removeItem('laporgan_admin_token');
          return { error: null };
        },
        onAuthStateChange: (callback) => {
          // Trigger initial event
          const token = localStorage.getItem('laporgan_admin_token');
          const session = token === 'mock-session-token-123456' ? {
            access_token: token,
            user: { email: 'admin@laporgan.com', role: 'admin' }
          } : null;
          
          if (typeof callback === 'function') {
            callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
          }
          
          return { data: { subscription: { unsubscribe: () => {} } } };
        }
      },
      from: (tableName) => ({
        select: () => {
          if (tableName === 'copywriting') {
            let data = [];
            try {
              data = JSON.parse(localStorage.getItem('laporgan_copywriting') || '[]');
            } catch (e) {}
            if (!Array.isArray(data) || data.length === 0) {
              data = [
                { section: 'hero_welcome', content: 'Aspirasi & Laporan Digital Warga' },
                { section: 'hero_title', content: 'Suarakan Keluhan Anda di LaporGan' },
                { section: 'hero_subtitle', content: 'Sering menemui jalan berlubang, lampu jalan padam, penumpukan sampah, atau pelayanan publik yang lambat? Anda tidak sendiri, dan kini Anda bisa bertindak.' },
                { section: 'hero_text2', content: 'LaporGan hadir sebagai wadah pengaduan online yang cepat, aman, dan 100% transparan. Suarakan keluhan Anda hari ini dan kawal penyelesaiannya secara langsung!' },
                { section: 'about_title', content: 'TENTANG LAPORGAN' },
                { section: 'about_subtitle', content: 'Solusi Pelaporan Modern' },
                { section: 'about_description', content: 'Kami percaya bahwa lingkungan yang nyaman bermula dari kepedulian warganya. LaporGan memotong rantai birokrasi yang lambat dan berbelit-belit. Mengintegrasikan teknologi web dan bot Telegram, kami menghubungkan keluhan Anda langsung ke instansi daerah penanggung jawab secara transparan dan akuntabel.' },
                { section: 'about_services', content: JSON.stringify([
                  { judul: 'Identitas Rahasia & Aman', deskripsi: 'Data pribadi dan identitas Anda dilindungi dengan enkripsi terbaik. Melapor dengan aman tanpa perlu merasa khawatir.', logo: 'fa-solid fa-shield-halved' },
                  { judul: 'Pelacakan Real-time', deskripsi: 'Pantau kemajuan laporan Anda secara transparan langsung dari dashboard mulai dari Diterima, Diproses, hingga Selesai.', logo: 'fa-solid fa-eye' },
                  { judul: 'Bebas Jalur Birokrasi', deskripsi: 'Laporan Anda diverifikasi oleh tim admin dan diteruskan langsung ke instansi teknik yang berwenang menangani.', logo: 'fa-solid fa-people-arrows' }
                ])},
                { section: 'jenis_title', content: 'Kategori Pengaduan Utama' },
                { section: 'jenis_description', content: 'Kami menampung berbagai aspirasi dan keluhan fasilitas publik. Pilih kategori yang tepat agar laporan Anda segera ditugaskan ke dinas terkait.' },
                { section: 'jenis_list', content: JSON.stringify([
                  { judul: 'Infrastruktur Jalan & Jembatan', deskripsi: 'Jalan berlubang, jembatan rusak, pembatas jalan yang hancur, atau trotoar yang tidak layak pakai.' },
                  { judul: 'Fasilitas Penerangan & PJU', deskripsi: 'Lampu jalan mati (PJU), lampu lalu lintas error, tiang listrik miring, atau kabel melintang yang membahayakan.' },
                  { judul: 'Kebersihan & Saluran Air', deskripsi: 'Penumpukan sampah liar, pembuangan limbah sembarangan, selokan tersumbat banjir, atau pohon tumbang.' },
                  { judul: 'Keamanan & Ketertiban Umum', deskripsi: 'Pungutan liar (pungli), gangguan kebisingan malam hari, juru parkir liar intimidatif, atau pelanggaran ketertiban.' }
                ])},
                { section: 'langkah_title', content: '5 Langkah Mudah Melapor' },
                { section: 'langkah_description', content: 'Jangan biarkan masalah publik mengganggu kenyamanan. Ikuti alur pengiriman pengaduan berikut ini:' },
                { section: 'langkah_list', content: JSON.stringify([
                  { nomor: '1', judul: 'Dapatkan Token Telegram', deskripsi: 'Mulai dengan menyapa bot Telegram resmi kami @LayananAduan_Bot untuk memverifikasi akun Anda.' },
                  { nomor: '2', judul: 'Isi Formulir Laporan', deskripsi: 'Buka form pengaduan di website ini, tulis judul laporan yang jelas serta jelaskan kronologinya.' },
                  { nomor: '3', judul: 'Tentukan Lokasi & Foto', deskripsi: 'Tandai lokasi spesifik kejadian dan lampirkan bukti foto yang jelas agar tim dinas mudah melakukan survei.' },
                  { nomor: '4', judul: 'Verifikasi Tim Admin', deskripsi: 'Admin LaporGan memvalidasi kelayakan laporan sebelum menugaskannya langsung ke dinas berwenang.' },
                  { nomor: '5', judul: 'Pantau Hasil Perbaikan', deskripsi: 'Lacak tiket aduan Anda. Anda akan menerima notifikasi penyelesaian lengkap dengan foto hasil kerja dinas.' }
                ])}
              ];
            }
            return Promise.resolve({ data, error: null });
          }
          return Promise.resolve({ data: [], error: null });
        },
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        upsert: async (items) => {
          if (tableName === 'copywriting') {
            let current = [];
            try {
              current = JSON.parse(localStorage.getItem('laporgan_copywriting') || '[]');
            } catch (e) {}
            if (!Array.isArray(current)) current = [];
            
            items.forEach(item => {
              const idx = current.findIndex(c => c.section === item.section);
              if (idx !== -1) {
                current[idx].content = item.content;
              } else {
                current.push(item);
              }
            });
            localStorage.setItem('laporgan_copywriting', JSON.stringify(current));
            return Promise.resolve({ data: current, error: null });
          }
          return Promise.resolve({ data: [], error: null });
        }
      })
    }
