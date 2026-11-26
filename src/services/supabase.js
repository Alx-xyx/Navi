import {createClient} from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lmindxfwkmmfwfiazilv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_5z2WqPWgl_ouuzxTxxIS3g_2KAtNKjq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);