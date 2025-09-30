import ratelimit from "../config/upstash.js";

const rateLimiter = async(req,res,next)=>{
    try{
        // Get client IP address
        const clientIP = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
        
        const {success} = await ratelimit.limit(clientIP);

        if(!success){
            return res.status(429).json({
                message: "Too many requests, please try again later.",
                retryAfter: "60 seconds"
            });
        }
        next();

    }catch(error){
        console.log("Rate limit error ", error);
        next(error);

    }
    
};
export default rateLimiter;