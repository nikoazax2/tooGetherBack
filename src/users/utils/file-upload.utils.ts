import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const date = new Date();
  const dateFormat = `${date.getSeconds()}_${date.getMinutes()}_${date.getHours()}_${date.getDay()}_${date.getMonth()}_${date.getFullYear()}`;
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(15)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${dateFormat}-${randomName}${fileExtName}`);
};
