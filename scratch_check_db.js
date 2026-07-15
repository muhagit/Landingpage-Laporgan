import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const lines = env.split('\r\n').join('\n').split('\n');
const urlLine = lines.find(l => l.startsWith('VITE_SUPABASE_URL'));
const keyLine = lines.find(l => l.startsWith('VITE_SUPABASE_ANON_KEY'));

const supabaseUrl = urlLine.split('=')[1].trim();
const supabaseAnonKey = keyLine.split('=')[1].trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('copywriting').select('*');
  if (error) {
    console.error('Error fetching copywriting:', error);
  } else {
    console.log('--- Copywriting Rows ---');
    data.forEach(row => {
      console.log(`Section: ${row.section}`);
      console.log(`Content (first 100 chars): ${row.content ? row.content.substring(0, 100) : null}`);
      console.log('------------------------');
    });
  }
}

check();
