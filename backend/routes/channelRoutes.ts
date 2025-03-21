
import express from 'express';
import * as channelController from '../controllers/channelController';

const router = express.Router();

// Channel routes
router.get('/', channelController.getChannels);
router.post('/', channelController.createChannel);
router.get('/:id', channelController.getChannelById);
router.put('/:id', channelController.updateChannel);
router.delete('/:id', channelController.deleteChannel);

export default router;
