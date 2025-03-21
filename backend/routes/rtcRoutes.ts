import express from 'express';
import * as rtcController from '../controllers/rtcController';

const router = express.Router();

router.get('/ice-servers', rtcController.getIceServers);
router.get('/call-status/:channelId', rtcController.checkCallStatus);

export default router;
