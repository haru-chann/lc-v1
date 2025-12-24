// Import Supabase client for Edge Functions
/// <reference path="./types.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define types for the request body
interface ContactSubmission {
  name: string;
  age: string;
  profession: string;
  city: string;
}

interface ErrorResponse {
  error: string;
  [key: string]: any;
}

interface SuccessResponse {
  success: boolean;
  message: string;
  [key: string]: any;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple hash function for IP anonymization using Web Crypto API
const hashIP = async (ip: string): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
};

// Sanitize input - remove potential HTML/script tags
function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
}

// Create Supabase client
const createSupabaseClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    throw new Error('Missing Supabase environment variables');
  }
  
  try {
    return createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    throw new Error('Failed to initialize database connection');
  }
};

// Helper function to create error response
const createErrorResponse = (message: string, status = 400): Response => {
  const response: ErrorResponse = { error: message };
  return new Response(
    JSON.stringify(response),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  );
};

// Helper function to create success response
const createSuccessResponse = (message: string, data: any = {}): Response => {
  const response: SuccessResponse = { 
    success: true, 
    message,
    ...data 
  };
  return new Response(
    JSON.stringify(response),
    { 
      status: 200, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  );
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400' // 24 hours
      } 
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  try {
    // Get client IP from headers (behind proxy)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               req.headers.get('x-real-ip') || 
               'unknown';
    const ipHash = await hashIP(ip);

    // Parse and validate request body
    let body: Partial<ContactSubmission>;
    try {
      body = await req.json();
    } catch (e) {
      return createErrorResponse('Invalid JSON payload');
    }

    const { name, age, profession, city } = body;

    // Validate required fields
    if (!name || !age || !profession || !city) {
      return createErrorResponse('All fields are required');
    }

    // Validate input lengths
    if (name.length > 100) {
      return createErrorResponse('Name must be less than 100 characters');
    }

    if (profession.length > 100) {
      return createErrorResponse('Profession must be less than 100 characters');
    }

    if (city.length > 100) {
      return createErrorResponse('City must be less than 100 characters');
    }

    // Validate age
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 150) {
      return createErrorResponse('Please provide a valid age between 1 and 150');
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedProfession = sanitizeInput(profession);
    const sanitizedCity = sanitizeInput(city);

    // Create Supabase client
    const supabase = createSupabaseClient();

    // Rate limiting: Check for recent submissions from this IP (max 5 per hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    try {
      const { count, error: countError } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('ip_hash', ipHash)
        .gte('created_at', oneHourAgo);

      if (countError) {
        console.error('Rate limit check error:', countError);
      }

      if (count && count >= 5) {
        console.log(`Rate limit exceeded for IP hash: ${ipHash}`);
        return createErrorResponse('Too many submissions. Please try again later.', 429);
      }
    } catch (rateLimitError) {
      console.error('Rate limit check failed:', rateLimitError);
      // Continue with submission if rate limiting fails
    }

    // Insert submission
    try {
      const { error: insertError } = await supabase
        .from('contact_submissions')
        .insert({
          name: sanitizedName,
          age: parsedAge,
          profession: sanitizedProfession,
          city: sanitizedCity,
          ip_hash: ipHash,
        });

      if (insertError) {
        console.error('Database insert error:', insertError);
        return createErrorResponse('Failed to submit. Please try again.', 500);
      }

      console.log(`Contact form submitted successfully from IP hash: ${ipHash}`);
      return createSuccessResponse('Your information has been submitted successfully!');
    } catch (insertError) {
      console.error('Database insert failed:', insertError);
      return createErrorResponse('Failed to submit. Please try again.', 500);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return createErrorResponse('An unexpected error occurred. Please try again later.', 500);
  }
});