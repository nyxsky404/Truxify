import express from 'express';
import { supabase, mongoDb, redisClient, firebaseAdmin } from '../config/db.js';

const router = express.Router();

async function checkSupabase() {
  if (!supabase) return 'not_configured';
  try {
    const { error } = await supabase.rpc('pg_sleep', { seconds: 0 }).throwOnError();
    // fallback: simple select if rpc not available
    if (error) {
      const { error: e2 } = await supabase.from('profiles').select('id').limit(1);
      if (e2) return 'failed';
    }
    return 'connected';
  } catch {
    try {
      const { error } = await supabase.from('profiles').select('id').limit(1);
      return error ? 'failed' : 'connected';
    } catch {
      return 'failed';
    }
  }
}

async function checkMongo() {
  if (!mongoDb) return 'not_configured';
  try {
    await mongoDb.admin().ping();
    return 'connected';
  } catch {
    return 'failed';
  }
}

async function checkRedis() {
  if (!redisClient) return 'not_configured';
  try {
    const reply = await redisClient.ping();
    return reply === 'PONG' ? 'connected' : 'failed';
  } catch {
    return 'failed';
  }
}

function checkFirebase() {
  return firebaseAdmin ? 'configured' : 'not_configured';
}

function checkPolygon() {
  return process.env.POLYGON_RPC_URL ? 'configured' : 'not_configured';
}

router.get('/', async (req, res) => {
  const [supabaseStatus, mongoStatus, redisStatus] = await Promise.all([
    checkSupabase(),
    checkMongo(),
    checkRedis(),
  ]);

  const services = {
    supabase: supabaseStatus,
    mongodb: mongoStatus,
    redis: redisStatus,
    firebase: checkFirebase(),
    polygon: checkPolygon(),
  };

  const criticalFailed =
    supabaseStatus === 'failed' || mongoStatus === 'failed';

  const status = criticalFailed ? 'degraded' : 'ok';
  const httpStatus = criticalFailed ? 503 : 200;

  return res.status(httpStatus).json({
    status,
    services,
    uptime: process.uptime(),
  });
});

export default router;
