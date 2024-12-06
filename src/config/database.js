import { createClient, isAuthApiError } from "@supabase/supabase-js";
import "dotenv/config.js";

const supabaseUrl = process.env.DB_SUPABASE_URL;
const supabaseKey = process.env.DB_SUPABASE_API_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseKey);

export { supabaseClient, isAuthApiError };
