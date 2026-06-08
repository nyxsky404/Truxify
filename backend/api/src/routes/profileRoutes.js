import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { supabase } from '../config/db.js';

const router = express.Router();

// GET PROFILE
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    // 1. base profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileErr) throw profileErr;
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    let extra = null;

    // 2. role-based fetch
    if (role === 'customer') {
      const { data } = await supabase
        .from('customer_stats')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      extra = data;
    }

    if (role === 'driver') {
      const { data } = await supabase
        .from('driver_details')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      extra = data;
    }

    return res.json({
      profile,
      extra
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Failed to fetch profile',
      details: err.message
    });
  }
});

// UPDATE PROFILE (basic version)
router.put('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, language, dark_mode } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        language,
        dark_mode
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      message: 'Profile updated',
      profile: data
    });

  } catch (err) {
    res.status(500).json({
      error: 'Failed to update profile',
      details: err.message
    });
  }
});

export default router;