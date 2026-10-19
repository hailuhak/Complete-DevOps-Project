import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
   res.json({
      message: 'User route is working',
   });
});

export default router;