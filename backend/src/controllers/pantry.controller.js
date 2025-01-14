const Pantry = require('../models/pantry.models');
const logger = require('../utils/logger');

class PantryController {
    async addStaff(req, res) {
        try {
            console.log('Request:', req.body);
            
            const { name, contact_info, location } = req.body;
            const staff = await Pantry.addStaff({
                name: name,
                contactInfo: contact_info,
                location: location
            });
            
            logger.info(`Pantry staff added with ID: ${staff.id}`);
            res.status(201).json(staff);
        } catch (error) {
            logger.error('Error adding pantry staff:', error);
            if (error.message.includes('required')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes('already exists')) {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getAllStaff(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;
            
            const staff = await Pantry.getStaff({
                limit: parseInt(limit),
                offset: parseInt(offset)
            });
            
            res.status(200).json(staff);
        } catch (error) {
            logger.error('Error fetching pantry staff:', error);
            res.status(500).json({ message: 'Error fetching staff list' });
        }
    }

    async getStaffById(req, res) {
        try {
            const { id } = req.params;
            const staff = await Pantry.findById(id);
            
            if (!staff) {
                return res.status(404).json({ message: 'Staff member not found' });
            }
            
            res.status(200).json(staff);
        } catch (error) {
            logger.error('Error fetching staff member:', error);
            res.status(500).json({ message: 'Error fetching staff details' });
        }
    }

    async updateStaff(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            
            const updatedStaff = await Pantry.update(id, updates);
            
            if (!updatedStaff) {
                return res.status(404).json({ message: 'Staff member not found' });
            }
            
            logger.info(`Staff member ${id} updated successfully`);
            res.status(200).json(updatedStaff);
        } catch (error) {
            logger.error('Error updating staff member:', error);
            if (error.message.includes('already exists')) {
                return res.status(409).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error updating staff member' });
        }
    }

    async deleteStaff(req, res) {
        try {
            const { id } = req.params;
            await Pantry.delete(id);
            
            logger.info(`Staff member ${id} deleted successfully`);
            res.status(204).send();
        } catch (error) {
            logger.error('Error deleting staff member:', error);
            if (error.message.includes('not found')) {
                return res.status(404).json({ message: error.message });
            }
            res.status(500).json({ message: 'Error deleting staff member' });
        }
    }

    async getStaffByLocation(req, res) {
        try {
            const { location } = req.params;
            const staff = await Pantry.findByLocation(location);
            res.status(200).json(staff);
        } catch (error) {
            logger.error('Error fetching staff by location:', error);
            res.status(500).json({ message: 'Error fetching staff list' });
        }
    }
}

module.exports = new PantryController();