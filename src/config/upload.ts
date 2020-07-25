import crypto from 'crypto';
import path from 'path';
import multer from 'multer';

export default {
  storage: multer.diskStorage({
    destination: path.join(process.cwd(), 'tmp'),
    filename: (req, file, cb) => {
      const filehash = crypto.randomBytes(10).toString('hex');
      const filename = `${filehash}-${file.originalname}`;
      return cb(null, filename);
    },
  }),
};
