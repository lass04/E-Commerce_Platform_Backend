import multer from "multer";

const storage = multer.diskStorage({
    destination:'./uploads',
    filename: (req,file,cb) => {
            cb(null,file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if(!file.mimetype.startsWith("image/"))
         cb(new Error("Only Image Files are allowed "),false)
    else
        cb(null,true)
}

export const upload = multer({ storage, fileFilter });
