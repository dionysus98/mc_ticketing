import express, { Request, Response } from 'express';
import { currentUser, requireAuth } from '@mctickects/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  // requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
