const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');
const User = require('../models/user');
const PushNotificationsController = require('../controllers/pushNotificationsController');

module.exports = {

    
async findByStatus(req, res) {
    try {
        const status = req.params.status;        
        const orders = await Order.find({ status });
        
        console.log(orders);
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
            const orders = await Order.find({ status: status, deliveryId: id_delivery });
            // const parsedOrders = orders.map(order => ({
            //     ...order.toObject(),
            //     address: JSON.parse(order.address || '{}'),
            //     client: JSON.parse(order.client || '{}'),
            //     delivery: JSON.parse(order.delivery || '{}'),
            //     products: JSON.parse(order.products || '[]')
            // }));
                
            return res.status(200).json({
                success: true,
                message: 'Órdenes obtenidas correctamente',
                data: orders,
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
            const { id_client, status } = req.params;            
            const orders = await Order.find({ status: status, clientId: id_client });            
            // const parsedOrders = orders.map(order => ({
            //     ...order.toObject(),
            //     address: JSON.parse(order.address || '{}'),
            //     client: JSON.parse(order.client || '{}'),
            //     delivery: JSON.parse(order.delivery || '{}'),
            //     products: JSON.parse(order.products || '[]')
            // }));
                
            return res.status(200).json({
                success: true,
                message: 'Órdenes obtenidas correctamente',
                data: orders,
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
                
            return res.status(201).json({
                success: true,
                message: 'La orden se ha creado correctamente',
                data: savedOrder
            });
        } catch (err) {
            // Manejo de errores
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