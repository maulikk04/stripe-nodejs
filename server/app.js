require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors');
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5500'
}))
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
    [1,{price:10000,name:'mobile'}],
    [2,{price:50000,name:'laptop'}],
])

app.post('/create-payment',async (req,res)=>{
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items.map(item =>{
                const storeItem = storeItems.get(item.id)
                return {
                    price_data : {
                        currency: 'usd',
                        product_data:{
                            name: storeItem.name
                        },
                        unit_amount: storeItem.price
                    },
                    quantity: item.quantity
                }
            }),
            mode: 'payment', //one time payment , for subscription write subscription
            success_url : `${process.env.CLIENT_URL}/success.html`,
            cancel_url: `${process.env.CLIENT_URL}/cancel.html`
        })
        res.json({'url': session.url})
    } catch (error) {
        console.log(error)
        res.status(500).json({"message":error.message})
    }
    
})

app.listen(5000,()=>{
    console.log('listening on port 5000');
})