import { Redis } from '@upstash/redis';
import {Ratelimit} from '@upstash/ratelimit';
import "dotenv/config";

const ratelimit = new Ratelimit({
    redis:Redis.fromEnv(),
    limiter:Ratelimit.slidingWindow(100,"60 s"), 
});
export default ratelimit;
// 100 requests per 60 seconds
//sliding window is more efficient than fixed window as it divides the time into smaller intervals and calculates the limit based on that
