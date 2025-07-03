const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class Posuser {
    static async findByUsername(username) {
        const [rows] = await pool.execute(
            'SELECT * FROM posuser WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    static async validLogin(username, password) {
        const [rows] = await pool.execute(
            'SELECT * FROM posuser WHERE username = ? and password = ?',
            [username, password]
        );
        return rows[0];
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Posuser;