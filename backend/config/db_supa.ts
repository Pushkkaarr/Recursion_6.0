import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('demo').select('*');

    if (error) {
      throw error;
    }

    console.log('Connected to Supabase successfully! Data received:', data);
  } catch (err) {
    console.error('Error fetching Supabase connection:', err);
  }
}

export default checkSupabaseConnection;
