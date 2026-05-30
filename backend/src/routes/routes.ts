import { Router } from 'express';
import { register, googleAuth, deleteMe, checkAuthToken } from '../controllers/authController';
const router = Router();

router.post('/register', register);
router.post('/auth/google', googleAuth);
router.delete('/me', checkAuthToken, deleteMe);
router.delete('/:id', checkAuthToken, deleteMe);

export default router;