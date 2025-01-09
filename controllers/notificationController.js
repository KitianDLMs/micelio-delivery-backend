const admin = require('firebase-admin');
const serviceAccount = require('./../firebase-admin.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = {

    async create(req, res) {
        try {
            const token = req.body.token;
            const data = req.body.data;

            if (token != '' || token != null) {
                await admin.messaging().sendEachForMulticast({
                    tokens: token,
                    data: {
                        title: data.title,
                        body: data.body,
                    }
                });
            }

            return res.json('send');
        } catch (err) {            
            return res.status(500).json({
                success: false,
                message: 'Hubo un error al momento de postear',
                error: err.message,
            });
        }
    },

}