import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' })
        }
        
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        
        // ফিক্স: যদি req.body আনডিফাইনড থাকে (যেমন GET রিকোয়েস্টে), তবে আগে অবজেক্ট তৈরি করে নেওয়া হলো
        if (!req.body) {
            req.body = {};
        }

        // এবার নিরাপদে দুই জায়গাতেই আইডি সেট করা যাবে, কোনো ক্র্যাশ হবে না
        req.body.userId = token_decode.id
        req.userId = token_decode.id 

        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser;