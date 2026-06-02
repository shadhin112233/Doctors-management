import multer from 'multer';

// মেমোরি স্টোরেজের বদলে ডিস্ক স্টোরেজ ব্যবহার করা হলো যেন .path পাওয়া যায়
const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;