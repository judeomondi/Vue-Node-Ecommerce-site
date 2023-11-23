import express from 'express';
import {MongoClient} from 'mongodb';
import path, { dirname } from 'path';

async function start(){

    const url = `mongodb+srv://judeomondi:Motionpics01@cluster32623.yvgcc6q.mongodb.net/`;
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db('myFirstDb');

    const app = express();
    app.use(express.json());

    app.use('/images', express.static(path.join(__dirname, '../assets')));

    app.use(express.static(
        path.resolve(__dirname, '../dist'),
        {maxAge: '1y', etag: false}
    ));

    app.get("/api/products", async (req, res) => {
        const products = await db.collection('products').find({}).toArray();
        res.json(products);
    });


    app.get("/api/product/:productId", async (req, res) => {
        const productId = req.params.productId;
        const product = await db.collection('products').findOne({id: productId});
        res.json(product);
    });

    async function populateCartIds (ids){
        return Promise.all(ids.map(id => db.collection('products').findOne({id})));
    }

    app.get("/api/users/:userId/cart", async (req, res) => {
        const users = await db.collection('users').findOne({id: req.params.userId});
        const populatedCart = await populateCartIds(users?.cartItems);
        res.json(populatedCart);
    });

    app.post("/api/users/:userId/cart", async (req, res) => {
        const userId = req.params.userId;
        const productId = req.body.id;

        const users = await db.collection('users').findOne({id: userId});

        if(!users){
            await db.collection('users').insertOne({id: userId}, {cartItems: []});
        }
        
        await db.collection('users').updateOne({id: userId}, {
            $addToSet: {cartItems: productId}
        })
 
        const populatedCart = await populateCartIds(users?.cartItems);
        res.json(populatedCart);
    });

    app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
        const userId = req.params.userId;
        const productId = req.params.productId;

        await db.collection('users').updateOne({id : userId}, {
            $pull: {cartItems: productId}
        })

        const users = await db.collection('users').findOne({id: userId});
        const populatedCart = await populateCartIds(users?.cartItems);
        res.json(populatedCart);
    });

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });

    const port = process.env.PORT || 8000;

    app.listen(port, () => {
        console.log("Server started listening to port " + port);
    });

}

start();
