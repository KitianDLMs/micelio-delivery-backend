const Category = require('../models/category');

module.exports = {

    async create(req, res) {
        try {
            const category = new Category(req.body);
    
            const savedCategory = await category.save();
    
            return res.status(201).json({
                success: true,
                message: 'La categoría se creó correctamente',
                data: savedCategory._id
            });
        } catch (err) {            
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al registrar la categoría',
                error: err.message
            });
        }
    },
    

    async getAll(req, res) {
        try {
            const categories = await Category.find();
            // console.log('getAll', categories);
            return res.status(200).json({
                success: true,
                message: 'Categorías listadas correctamente',
                data: [categories]
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de listar las categorías',
                error: err
            });
        }
    }
    

}