const { pool } = require('../config/database');

class Sale {
    static async getAll(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.execute(
            `SELECT s.*, u.username, u.full_name 
             FROM sales s 
             LEFT JOIN users u ON s.user_id = u.id 
             ORDER BY s.created_at DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.execute(
            `SELECT s.*, u.username, u.full_name 
             FROM sales s 
             LEFT JOIN users u ON s.user_id = u.id 
             WHERE s.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async create(saleData) {
        const { 
            product_name, quantity, unit_price, 
            customer_name, customer_phone, sale_date, user_id 
        } = saleData;
        
        const total_price = quantity * unit_price;
        
        const [result] = await pool.execute(
            `INSERT INTO sales 
             (product_name, quantity, unit_price, total_price, customer_name, customer_phone, sale_date, user_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [product_name, quantity, unit_price, total_price, customer_name, customer_phone, sale_date, user_id]
        );
        
        return result.insertId;
    }

    static async update(id, saleData) {
        const { 
            product_name, quantity, unit_price, 
            customer_name, customer_phone, sale_date 
        } = saleData;
        
        const total_price = quantity * unit_price;
        
        await pool.execute(
            `UPDATE sales 
             SET product_name = ?, quantity = ?, unit_price = ?, total_price = ?, 
                 customer_name = ?, customer_phone = ?, sale_date = ?
             WHERE id = ?`,
            [product_name, quantity, unit_price, total_price, customer_name, customer_phone, sale_date, id]
        );
        
        return true;
    }

    static async delete(id) {
        await pool.execute('DELETE FROM sales WHERE id = ?', [id]);
        return true;
    }

    static async getTotalCount() {
        const [rows] = await pool.execute('SELECT COUNT(*) as total FROM sales');
        return rows[0].total;
    }
}

module.exports = Sale;