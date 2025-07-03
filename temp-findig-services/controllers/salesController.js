const Sale = require('../models/Sale');
const { successResponse, errorResponse } = require('../utils/response');

class SalesController {
    static async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const sales = await Sale.getAll(page, limit);
            const total = await Sale.getTotalCount();

            const response = {
                sales,
                pagination: {
                    current_page: page,
                    total_pages: Math.ceil(total / limit),
                    total_records: total,
                    per_page: limit
                }
            };

            successResponse(res, 'Sales retrieved successfully', response);
        } catch (error) {
            console.error('Get sales error:', error);
            errorResponse(res, 'Internal server error', 500);
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const sale = await Sale.getById(id);

            if (!sale) {
                return errorResponse(res, 'Sale not found', 404);
            }

            successResponse(res, 'Sale retrieved successfully', sale);
        } catch (error) {
            console.error('Get sale error:', error);
            errorResponse(res, 'Internal server error', 500);
        }
    }

    static async create(req, res) {
        try {
            const saleData = {
                ...req.body,
                user_id: req.user.id
            };

            const saleId = await Sale.create(saleData);
            const newSale = await Sale.getById(saleId);

            successResponse(res, 'Sale created successfully', newSale, 201);
        } catch (error) {
            console.error('Create sale error:', error);
            errorResponse(res, 'Internal server error', 500);
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            
            // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
            const existingSale = await Sale.getById(id);
            if (!existingSale) {
                return errorResponse(res, 'Sale not found', 404);
            }

            await Sale.update(id, req.body);
            const updatedSale = await Sale.getById(id);

            successResponse(res, 'Sale updated successfully', updatedSale);
        } catch (error) {
            console.error('Update sale error:', error);
            errorResponse(res, 'Internal server error', 500);
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            
            // ตรวจสอบว่ามีข้อมูลอยู่หรือไม่
            const existingSale = await Sale.getById(id);
            if (!existingSale) {
                return errorResponse(res, 'Sale not found', 404);
            }

            await Sale.delete(id);

            successResponse(res, 'Sale deleted successfully');
        } catch (error) {
            console.error('Delete sale error:', error);
            errorResponse(res, 'Internal server error', 500);
        }
    }
}

module.exports = SalesController;