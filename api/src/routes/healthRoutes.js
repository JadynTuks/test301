import express from 'express';
import { sendToDaemon, checkDaemonConnection } from '../services/tcpClient.js';

const router = express.Router();

// Basic health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Daemon health check endpoint
router.get('/daemon', async (req, res) => {
  try {
    const status = await checkDaemonConnection();
    
    if (status.connected) {
      res.json({
        status: 'connected',
        timestamp: new Date().toISOString(),
        daemon: {
          status: 'online',
          databases: status.response.databases || []
        }
      });
    } else {
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        daemon: {
          status: 'offline',
          error: status.error
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: error.message
    });
  }
});

// Full system status endpoint
router.get('/system', async (req, res) => {
  try {
    const daemonStatus = await checkDaemonConnection();
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        api: {
          status: 'online',
          uptime: process.uptime()
        },
        daemon: {
          status: daemonStatus.connected ? 'online' : 'offline',
          error: daemonStatus.connected ? null : daemonStatus.error
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: error.message
    });
  }
});

export default router;