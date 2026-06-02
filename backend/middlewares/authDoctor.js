import jwt from 'jsonwebtoken'

const authDoctor = async (req, res, next) => {
    try {
        // হেডার থেকে টোকেন নেওয়া (সাধারণত ছোট হাতের অক্ষরেই আসে)
        const { dtoken } = req.headers
        
        if (!dtoken) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' })
        }

        // টোকেন ভেরিফাই করা
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET)
        
        /* ফিক্স এবং স্ট্যান্ডার্ড নিয়ম: 
          রিকোয়েস্ট অবজেক্টে সরাসরি doctor বা docId প্রোপার্টি যোগ করুন। 
          এতে GET, POST সব রিকোয়েস্টেই এক্সপ্রেসের পরবর্তী রাউট বা কন্ট্রোলার থেকে 
          সহজেই `req.docId` দিয়ে আইডিটি পেয়ে যাবেন। req.body পরিবর্তন করার দরকার নেই।
        */
        req.docId = token_decode.id 

        next()
    } catch (error) {
        console.log("Auth Error:", error.message)
        // টোকেন এক্সপায়ারড বা ইনভ্যালিড হলে ৪০১ স্ট্যাটাস দেওয়া ভালো
        res.status(401).json({ success: false, message: 'Invalid or Expired Token' })
    }
}

export default authDoctor;