import multer from "multer"
import path from 'path';

//for uplaoding Profile image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Uploads/profileImage/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${req.id}${ext}`)
  }
})

export const uploadProfileImg = multer({ storage })


const FileMsg = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Uploads/MsgFiles/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const date = Date.now(); 
    cb(null, `${req.id}_${date}${ext}`);
  }
});

// Correct multer usage
export const uploadMsgFile = multer({ storage: FileMsg });

