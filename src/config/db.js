import {neon} from "@neondatabase/serverless"

import "dotenv/config";

//Creates a SQL connection using our DB URL

export const sql = neon(process.env.DATABASE_URL);

export async function initDB(){
    try{
        //serial means it will be incremented id as the new users signups
        //DECIMAL(10,2) means a fixed point number with 10 digits in total and 2 digits after the decimal point, so max: 99999999.99 (8 digits before decimal and 2 after)
         
        await sql `CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(22) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`

        console.log("Database initialized successfully");
    }catch(error){
        console.log("Error initializing DB", error);
        process.exit(1); // status code 1 means failure and 0 success

    }
}

