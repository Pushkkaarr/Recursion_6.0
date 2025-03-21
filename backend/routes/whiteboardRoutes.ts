
import express from 'express';
import * as whiteboardController from '../controllers/whiteboardController';

const router = express.Router();

router.get('/:channelId', whiteboardController.getWhiteboardData);
router.post('/:channelId', whiteboardController.saveWhiteboardData);
router.delete('/:channelId', whiteboardController.clearWhiteboardData);

export default router;
