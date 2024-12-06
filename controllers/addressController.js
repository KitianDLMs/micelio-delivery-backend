const Address = require('../models/address');

module.exports = {

    async findByUser(req, res) {        
        try {
            const id_user = req.params.id_user;
            const data = await Address.find({id_user});
                        
            return res.status(201).json(data);
            
        } catch (error) {                        
            return res.status(201).json(data);
        }
    },

    async create(req, res) {

        try {
            const address = req.body;

            const newAddress = await Address.create(address);            

            return res.status(201).json({
                success: true,
                message: 'La direccion se creo correctamente',
                data: `${newAddress}`
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro de la direccion',
                error: err
            });
        }
        // Address.create(address, (err, id) => {

        //     if (err) {
        //         console.log(err);
        //         return res.status(501).json({
        //             success: false,
        //             message: 'Hubo un error con el registro de la direccion',
        //             error: err
        //         });
        //     }

        //     return res.status(201).json({
        //         success: true,
        //         message: 'La direccion se creo correctamente',
        //         data: `${id}`
        //     });

        // });

    },

}