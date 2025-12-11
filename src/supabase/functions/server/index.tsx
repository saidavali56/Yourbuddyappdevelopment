import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// User registration
app.post('/make-server-c520032d/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, ageGroup, parentEmail, language } = body;

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, ageGroup, parentEmail, language },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Registration error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      ageGroup,
      parentEmail,
      language,
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Save avatar preferences
app.post('/make-server-c520032d/avatar', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { avatarData, avatarName } = body;

    await kv.set(`avatar:${user.id}`, {
      userId: user.id,
      avatarData,
      avatarName,
      createdAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Avatar save error:', error);
    return c.json({ error: 'Failed to save avatar' }, 500);
  }
});

// Get user avatar
app.get('/make-server-c520032d/avatar', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const avatar = await kv.get(`avatar:${user.id}`);
    return c.json({ avatar });
  } catch (error) {
    console.error('Avatar fetch error:', error);
    return c.json({ error: 'Failed to fetch avatar' }, 500);
  }
});

// Save IoT connection
app.post('/make-server-c520032d/iot-connect', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { deviceId, deviceType } = body;

    await kv.set(`iot:${user.id}`, {
      userId: user.id,
      deviceId,
      deviceType,
      connectedAt: new Date().toISOString()
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('IoT connection error:', error);
    return c.json({ error: 'Failed to connect device' }, 500);
  }
});

// Save health data
app.post('/make-server-c520032d/health-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const healthData = body;

    const timestamp = new Date().toISOString();
    await kv.set(`health:${user.id}:${timestamp}`, {
      userId: user.id,
      ...healthData,
      timestamp
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Health data save error:', error);
    return c.json({ error: 'Failed to save health data' }, 500);
  }
});

// Get health data
app.get('/make-server-c520032d/health-data', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const healthData = await kv.getByPrefix(`health:${user.id}:`);
    return c.json({ healthData });
  } catch (error) {
    console.error('Health data fetch error:', error);
    return c.json({ error: 'Failed to fetch health data' }, 500);
  }
});

// Send report to parent
app.post('/make-server-c520032d/parent-report', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { report } = body;

    const timestamp = new Date().toISOString();
    await kv.set(`report:${user.id}:${timestamp}`, {
      userId: user.id,
      report,
      timestamp
    });

    return c.json({ success: true });
  } catch (error) {
    console.error('Report save error:', error);
    return c.json({ error: 'Failed to save report' }, 500);
  }
});

// SOS Alert
app.post('/make-server-c520032d/sos', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { message, location } = body;

    const timestamp = new Date().toISOString();
    await kv.set(`sos:${user.id}:${timestamp}`, {
      userId: user.id,
      message,
      location,
      timestamp,
      status: 'active'
    });

    return c.json({ success: true, message: 'SOS alert sent' });
  } catch (error) {
    console.error('SOS alert error:', error);
    return c.json({ error: 'Failed to send SOS alert' }, 500);
  }
});

// Get user profile
app.get('/make-server-c520032d/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile (including habits)
app.post('/make-server-c520032d/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const updates = body;

    // Get existing profile to merge
    const existingProfile = await kv.get(`user:${user.id}`) || {};

    const updatedProfile = {
      ...existingProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

Deno.serve(app.fetch);
