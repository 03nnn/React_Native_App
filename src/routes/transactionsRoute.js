import express from "express";

import {sql} from "../config/db.js";

const router = express.Router();

// you can create a controller folder in like transationController.js file 
// and then refer those in these HTTP methods

router.get("/:userId", async (req,res)=>{

    try{
        const {userId}= req.params;

        const transactions= await sql 
        `
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;

        res.status(200).json(transactions);

    }catch(error){
        console.log("Error fetching the details of the user", error);
        res.status(500).json({message: "Internal server Errror"});

    }
});


router.post("/", async (req,res)=>{
    
    //title , amount, category, user_id
    try{

        const {user_id, title,category,amount}= req.body;
        if(!title || !user_id || !category  || amount === undefined ){
            return res.status(400).json({message: "All fields are required"});
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *
        `;
        console.log(transaction);
        res.status(201).json(transaction[0]);


    }catch(error){
        console.log("Error creating the transaction ", error);
        res.status(500).json({message: "Internal server Error"});

    }
});

router.delete("/:id", async(req,res)=>{
    try{
    const {id} = req.params;
    if(isNAN(parseInt(id))){
        return res.status(400).json({message: "Invalid Transaction ID"})
    }

    const result=await sql `
    DELETE FROM transactions WHERE id= ${id} RETURNING *
    `;

    if(result.length ===0){
        return res.status(404).json({message:"transaction not found"});
    }else{

        res.status(200).json({message: "Transaction deleted successfully"})
    }
    

    }catch(error){
        console.log("Error deleteing the transaction", error);
          res.status(500).json({message: "Internal server Error"});

    }


});

router.get("/summary/:userId", async(req,res)=>{
try{
    const {userId} = req.params;
    const balanceResult = await sql `
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${userId}
    `;

    const incomeResult =await sql`
    SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id=${userId} AND amount>0`;

    const expenseResult=await sql`
        SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id=${userId} AND amount<0`;

    res.status(200).json({
        balance: balanceResult[0].balance,
        income: incomeResult[0].income,
        expenses: expenseResult[0].expense
    });

}catch(error){
    console.log("Error getting in the summary", error);
    res.status(500).json({message:"Internal server error"})
}
});

export default router;