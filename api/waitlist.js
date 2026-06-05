import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return res.status(500).json({
        error: 'Server configuration error: Missing Supabase credentials. Add SUPABASE_URL and SUPABASE_ANON_KEY to Vercel environment variables.'
      });
    }

    const { first_name, email, phone_number } = req.body;

    // Validate input
    if (!first_name || typeof first_name !== 'string' || first_name.trim().length === 0) {
      return res.status(400).json({ error: 'First name is required' });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }


    // Insert into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert({
        first_name: first_name.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phone_number.trim()
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      // Handle duplicate email error
      if (error.code === '23505' || error.message.includes('duplicate')) {
        return res.status(409).json({ error: 'This email is already registered' });
      }
      return res.status(500).json({ error: `Failed to join waitlist: ${error.message}` });
    }

    return res.status(201).json({
      success: true,
      message: 'Successfully joined the waitlist',
      data: data[0]
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
}
