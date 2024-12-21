const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    async fetchUser(req, res) {
        const userId = req.params.id || req.user?.id;
        
        try {            
            const user = await User.findById(userId);
    
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado',
                });
            }            
            // user.roles = JSON.parse(user.roles);

            return res.status(200).json({
                success: true,
                message: 'Usuario encontrado',
                data: user,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al obtener la información del usuario',
                error: err,
            });
        }
    },
    

    findDeliveryMen(req, res) {
        User.findDeliveryMen((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con al listar los repartidores',
                    error: err
                });
            }

            
            return res.status(201).json(data);
        });
    },

    login: async (req, res) => {
        const { email, password } = req.body;
    
        try {           
            const myUser = await User.findOne({ email });
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'El email no fue encontrado'
                });
            }
                
            const isPasswordValid = await bcrypt.compare(password, myUser.password);
                
            if (isPasswordValid) {
                const token = jwt.sign(
                    { id: myUser._id, email: myUser.email }, 
                    keys.secretOrKey, 
                    { expiresIn: '1h' } // Puedes especificar el tiempo de expiración del token
                );
    
                const data = {
                    id: `${myUser._id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };
    
                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: 'El password es incorrecto'
                });
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con el login',
                error: err
            });
        }
    },
    

    async register(req, res) {
        const user = req.body;
    
        try {        
            user.roles = [
                {
                  "id_user": user.id, 
                  "id_rol": "674e059f871554ef0186a527", 
                  "name": "USER_ROLE",
                  "image": "https://res.cloudinary.com/dbgdqdgds/image/upload/v1732652638/adtlzeaeba6x3fdtmujy.png",
                  "route": "/client/home"
                },
                // {
                //   "id_user": user.id, 
                //   "id_rol": "674e06ed871554ef0186a528", 
                //   "name": "DRIVER_ROLE",
                //   "image": "https://res.cloudinary.com/dbgdqdgds/image/upload/v1732190765/nvslzhb0h9mqo2rgnlgq.png",
                //   "route": "/delivery/home"
                // },
                // {
                //   "id_user": user.id, 
                //   "id_rol": "674e06ff871554ef0186a529", 
                //   "name": "ADMIN_ROLE",
                //   "image": "https://res.cloudinary.com/dbgdqdgds/image/upload/v1732190652/a1mo6mq8gtvgbklu5wh0.png",
                //   "route": "/restaurant/home"
                // }              
            ];     
            const data = await User.create(user);  
            user.id = `${data._id}`;
            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey);
            user.session_token = `JWT ${token}`;
            return res.status(201).json({
                success: true,
                message: 'El registro se realizó correctamente',
                data: user
            });
    
        } catch (err) {
            console.log(err);            
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro del usuario',
                error: err.message || err
            });
        }
    },
    

    async registerWithImage(req, res) {

        const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

        
            user.id = `${data}`;
            const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 3, (err, data) => {
                
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    });
                }
                
                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizo correctamente',
                    data: user
                });

            });

           

        });

    },

    async updateWithImage(req, res) {

        const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.update(user, (err, data) => {

            
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            User.findById(data, (err, myData) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del usuario',
                        error: err
                    });
                }
                
                myData.session_token = user.session_token;
                myData.roles = JSON.parse(myData.roles);

                return res.status(201).json({
                    success: true,
                    message: 'El usuario se actualizo correctamente',
                    data: myData
                });
            })
        });

    },

    // async updateWithoutImage(req, res) {

        // const user = req.body; 

    //     User.updateWithoutImage(user, (err, data) => {

        
    //         if (err) {
    //             return res.status(501).json({
    //                 success: false,
    //                 message: 'Hubo un error con el registro del usuario',
    //                 error: err
    //             });
    //         }

    //         User.findById(data, (err, myData) => {
    //             if (err) {
    //                 return res.status(501).json({
    //                     success: false,
    //                     message: 'Hubo un error con el registro del usuario',
    //                     error: err
    //                 });
    //             }
                
    //             myData.session_token = user.session_token;
    //             myData.roles = JSON.parse(myData.roles);

    //             return res.status(201).json({
    //                 success: true,
    //                 message: 'El usuario se actualizo correctamente',
    //                 data: myData
    //             });
    //         })

            
    //     });

    // },
    
    async updateWithoutImage(req, res) {
        const user = req.body;
    
        try {            
            const updatedUser = await User.findByIdAndUpdate(
                user.id, 
                {
                    name: user.name, 
                    lastname: user.lastname, 
                    phone: user.phone
                },
                { new: true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }    
            // updatedUser.roles = JSON.parse(updatedUser.roles);
            return res.status(200).json({
                success: true,
                message: 'El usuario se actualizó correctamente',
                data: updatedUser
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error con la actualización del usuario',
                error: err
            });
        }
    },
    
    
    
    async updateNotificationToken(req, res) {
        console.log('updateNotificationToken');
        try {
            const id = req.body.id; 
            const token = req.body.token; 
                
            const updatedUser = await User.findByIdAndUpdate(
                id, 
                { session_token: token },
                { new: true }
            );
            console.log(updatedUser);
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado, -notification token-'
                });
            }
    
            return res.status(200).json({
                success: true,
                message: 'El token se actualizó correctamente',
                data: updatedUser
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Hubo un error actualizando el token de notificaciones del usuario',
                error: err.message
            });
        }
    },    

}