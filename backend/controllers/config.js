const Config = require('../models/config')

module.exports = {
    getConfig: async (req, res) => {
        try {
            const config = await Config.find()
            res.status(200).send({
                status: true,
                data: config
            })
        } catch (error) {
            console.log(error);
        }
    },
    updateConfig: async (req, res) => {
        const { start_working, finish_working, late } = req.body

        try {

            await Config.updateOne({
                start_working,
                finish_working,
                late
            })
            res.status(200).send({
                status: true,
                message: 'success'
            })

        } catch (error) {
            res.status(400).send({
                status: false,
                message: error.message
            })
        }
    }
}