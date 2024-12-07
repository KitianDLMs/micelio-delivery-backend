const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');


module.exports = {

    async findByCategory(req, res) {
        const id_category = req.params.id_category;
    
        try {            
            const data = await Product.find({ id_category: id_category });
            
            return res.status(200).json({
                success: true,
                message: 'Productos listados correctamente',
                data: data
            });
        } catch (err) {            
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al momento de listar los productos',
                error: err.message || err
            });
        }
    },
    
    findByNameAndCategory: async (req, res) => {
        try {
            const id_category = req.params.id_category;
            const name = req.params.name;

            if (!id_category || !name) {
                return res.status(200).json({
                    success: true,
                    data: [],
                });
            }
    
            const data = await Product.find({
                name: { $regex: new RegExp(name, 'i') }, // Búsqueda insensible a mayúsculas/minúsculas
                id_category,
            });

            console.log(data);
    
            if (!data || data.length === 0) {
                console.log(err);
                return res.status(404).json({
                    success: false,
                    message: 'No se encontraron productos para la categoría y el nombre proporcionados',
                });
            }
                
            return res.status(201).json(data);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de listar los productos',
                error: err,
            });
        }
    },

    async create(req, res) {
        try {
            const productData = JSON.parse(req.body.product);
            const files = req.files;
                        
            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al registrar el producto: no se proporcionaron imágenes.',
                });
            }
            
            const product = new Product(productData);
            const savedProduct = await product.save();
            
            let inserts = 0;
                
            await asyncForEach(files, async (file, index) => {
                const path = `image_${Date.now()}_${index}`;
                const url = await storage(file, path);
    
                if (url) {
                    if (inserts === 0) product.image1 = url;
                    else if (inserts === 1) product.image2 = url;
                    else if (inserts === 2) product.image3 = url;
    
                    inserts++;
                }
            });
                
            await product.save();
                
            return res.status(201).json({
                success: true,
                message: 'El producto se almacenó correctamente.',
                data: savedProduct,
            });
        } catch (err) {
            // console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al registrar el producto.',
                error: err.message,
            });
        }
    }
    

}