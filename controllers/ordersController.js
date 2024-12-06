const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const User = require('../models/user');
const PushNotificationsController = require('../controllers/pushNotificationsController');

module.exports = {

    
async findByStatus(req, res) {
    try {
        const status = req.params.status;

        const orders = await Order.find({ status })
            .populate('id_client', 'name lastname image phone') 
            .populate('id_address', 'address neighborhood lat lng') 
            .populate('id_delivery', 'name lastname image phone') 
            .populate('products.id', 'name description image1 image2 image3 price'); 
        
        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron órdenes con el estado especificado',
            });
        }
        
        return res.status(200).json({
            success: true,
            data: orders,
        });
        } catch (err) {            
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de listar las órdenes',
                error: err.message,
            });
        }
    },

    async findByDeliveryAndStatus(req, res) {
        try {
            const { id_delivery, status } = req.params;
    
            const orders = await Order.find({ id_delivery, status });
                
            const parsedOrders = orders.map(order => ({
                ...order.toObject(),
                address: JSON.parse(order.address || '{}'),
                client: JSON.parse(order.client || '{}'),
                delivery: JSON.parse(order.delivery || '{}'),
                products: JSON.parse(order.products || '[]')
            }));
                
            return res.status(200).json({
                success: true,
                message: 'Órdenes obtenidas correctamente',
                data: parsedOrders,
            });
        } catch (err) {            
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al listar las órdenes',
                error: err.message,
            });
        }
    },
    
    async findByClientAndStatus(req, res) {
        try {
            const { id_client, status } = req.body;
                
            const orders = await Order.find({ id_client, status });
    
            const parsedOrders = orders.map(order => ({
                ...order.toObject(),
                address: JSON.parse(order.address || '{}'),
                client: JSON.parse(order.client || '{}'),
                delivery: JSON.parse(order.delivery || '{}'),
                products: JSON.parse(order.products || '[]')
            }));
                
            return res.status(200).json({
                success: true,
                message: 'Órdenes obtenidas correctamente',
                data: parsedOrders,
            });
        } catch (err) {            
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al listar las órdenes',
                error: err.message,
            });
        }
    },
    
    async create(req, res) {
        try {
            const orderData = req.body;
                
            const order = new Order(orderData);
            const savedOrder = await order.save();
                
            const productPromises = orderData.products.map(async product => {
                const orderProduct = new OrderHasProducts({
                    order_id: savedOrder._id,
                    product_id: product.id,
                    quantity: product.quantity
                });
                return await orderProduct.save();
            });
                
            await Promise.all(productPromises);
                
            return res.status(201).json({
                success: true,
                message: 'La orden se ha creado correctamente',
                data: `${savedOrder._id}`
            });
        } catch (err) {            
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de crear la orden',
                error: err.message
            });
        }
    },

    updateToDispatched(req, res) {
        const order = req.body;

        Order.updateToDispatched(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            User.findById(order.id_delivery, (err, user) => {
                
                if (user !== undefined && user !== null) {

                    // console.log('NOTIFICATION TOKEN', user.notification_token);
                    PushNotificationsController.sendNotification(user.notification_token, {
                        title: 'PEDIDO ASIGNADO',
                        body: 'Te han asignado un pedido para entregar',
                        id_notification: '1'
                    });
                }

            });
            
            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    
    updateToOnTheWay(req, res) {
        const order = req.body;

        Order.updateToOnTheWay(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
    
    updateToDelivered(req, res) {
        const order = req.body;

        Order.updateToDelivered(order.id, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    },
   
    updateLatLng(req, res) {
        const order = req.body;

        Order.updateLatLng(order, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de actualizar la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se ha actualizado correctamente',
                data: `${id_order}` // EL ID 
            });

        });
    }

}