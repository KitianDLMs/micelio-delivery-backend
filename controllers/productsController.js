const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');


module.exports = {

    async findByCategory(req, res) {
        const id_category = req.params.id_category;
    
        try {            
            const data = await Product.find({ id_category: id_category });
            console.log(data);
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
    
    findByNameAndCategory(req, res) {
        const id_category = req.params.id_category;
        const name = req.params.name;

        Product.findByNameAndCategory(name, id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al momento de listar las categorias',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    async create(req, res) {
        try {
            const productData = JSON.parse(req.body.product); // Datos del producto enviados por el cliente
            const files = req.files;
            
            console.log(req.body);
            if (!files || files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al registrar el producto: no se proporcionaron imágenes.',
                });
            }
    
            // Crear el producto inicial en la base de datos
            const product = new Product(productData);
            const savedProduct = await product.save();
            console.log(savedProduct);
            let inserts = 0;
    
            // Subir imágenes y actualizar el producto con las URLs generadas
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
    
            // Guardar el producto actualizado con las imágenes
            await product.save();
    
            // Responder con éxito
            return res.status(201).json({
                success: true,
                message: 'El producto se almacenó correctamente.',
                data: savedProduct,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al registrar el producto.',
                error: err.message,
            });
        }
    }
    

}