const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// static folder
app.use(express.static(path.join(__dirname, 'public')));

let orders = [];

// হোম পেজ রাউট (যা Not Found সমস্যা সমাধান করবে)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// অর্ডার নেওয়ার API
app.post('/api/orders', (req, res) => {
    try {
        const { customerName, phone, address, paymentMethod, bkashTxnId, items, totalPrice } = req.body;

        if (!customerName || !phone || !address || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'অনুগ্রহ করে সব তথ্য দিন।' });
        }

        const newOrder = {
            orderId: 'PO-' + Math.floor(100000 + Math.random() * 900000),
            customerName, phone, address, paymentMethod,
            bkashTxnId: bkashTxnId || 'N/A',
            items, totalPrice,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        orders.unshift(newOrder);

        res.status(201).json({
            success: true,
            message: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!',
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'সার্ভার সমস্যা হয়েছে।' });
    }
});

// অ্যাডমিনের জন্য সব অর্ডার দেখার API
app.get('/api/orders', (req, res) => {
    res.json({ success: true, count: orders.length, orders });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`PureOrganic BD Server running on port ${PORT}`);
});
