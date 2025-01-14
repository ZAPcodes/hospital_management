const Delivery = require('../models/delivery.models');
const logger = require('../utils/Logger');

class DeliveryController {
    async createDelivery(req, res) {
        try {
            
            const { patientId, mealBoxDetails, assignedTo, deliveryStatus = 'Pending' } = req.body;

            // Validate required fields
            if (!patientId || !mealBoxDetails || !assignedTo) {
                return res.status(400).json({ 
                    message: 'Missing required fields: patientId, mealBoxDetails, assignedTo'
                });
            }

            const delivery = await Delivery.create({
                patientId,
                mealBoxDetails,
                assignedTo,
                deliveryStatus
            });

            logger.info(`Delivery created with ID: ${delivery.id}`);
            res.status(201).json(delivery);
        } catch (error) {
            logger.error('Delivery creation error:', error);
            if (error.message.includes('Patient ID not found')) {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllDeliveries(req, res) {
        try {
            const { limit = 10, offset = 0 } = req.query;
            const deliveries = await Delivery.findAll({ limit, offset });
            res.status(200).json(deliveries);
        } catch (error) {
            logger.error('Error fetching deliveries:', error);
            res.status(500).json({ message: 'Error fetching deliveries' });
        }
    }

    async getDeliveryById(req, res) {
        try {
            const { id } = req.params;
            const delivery = await Delivery.findById(id);
            
            if (!delivery) {
                return res.status(404).json({ message: 'Delivery not found' });
            }
            
            res.status(200).json(delivery);
        } catch (error) {
            logger.error('Error fetching delivery:', error);
            res.status(500).json({ message: 'Error fetching delivery details' });
        }
    }

    async getDeliveryByPatientId(req, res) {
        try {
            const { patientId } = req.params;
            const deliveries = await Delivery.findByPatientId(patientId);
            res.status(200).json(deliveries);
        } catch (error) {
            logger.error('Error fetching patient deliveries:', error);
            res.status(500).json({ message: 'Error fetching patient deliveries' });
        }
    }

    async updateDeliveryStatus(req, res) {
        try {
            const { id } = req.params;
            const { deliveryStatus } = req.body;
            
            if (!['Pending', 'InTransit', 'Delivered', 'Failed'].includes(deliveryStatus)) {
                return res.status(400).json({ 
                    message: 'Invalid status. Must be: Pending, InTransit, Delivered, or Failed' 
                });
            }

            const delivery = await Delivery.updateStatus(id, deliveryStatus);
            
            if (!delivery) {
                return res.status(404).json({ message: 'Delivery not found' });
            }

            logger.info(`Delivery ${id} status updated to ${deliveryStatus}`);
            res.status(200).json(delivery);
        } catch (error) {
            logger.error('Error updating delivery status:', error);
            res.status(500).json({ 
                message: 'Error updating delivery status',
                error: error.message 
            });
        }
    }

    async deleteDelivery(req, res) {
        try {
            const { id } = req.params;
            await Delivery.delete(id);
            
            logger.info(`Delivery ${id} deleted successfully`);
            res.status(204).send();
        } catch (error) {
            logger.error('Error deleting delivery:', error);
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error deleting delivery' });
        }
    }

    async getDeliveriesByStatus(req, res) {
        try {
            const { status } = req.params;
            const deliveries = await Delivery.findByStatus(status);
            res.status(200).json(deliveries);
        } catch (error) {
            logger.error('Error fetching deliveries by status:', error);
            res.status(500).json({ message: 'Error fetching deliveries' });
        }
    }
}

module.exports = new DeliveryController();