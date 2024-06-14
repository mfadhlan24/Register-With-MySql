const bcrypt = require('bcrypt');
const { connection } = require('../database/db');
const swal = require('sweetalert');

const UserController = {

    register: async (req, res) => {
        const fullname = req.body.fullname;
        const username = req.body.username;
        const password = req.body.password;
        console.log('Register password:', password);
        try {
            // Cek apakah username sudah ada
            connection.query(`SELECT username FROM users WHERE username = ?`, [username], async (err, result) => {
                if (err) throw err;
                
                if (result.length > 0) {
                    // Username sudah ada
                    return res.render('register', { success: false, msg: 'Username sudah digunakan. Silakan pilih username lain.' });
                } else {
                    // Username belum ada, lanjutkan proses registrasi
                    const hashPassword = await bcrypt.hash(password, 10);
                    connection.query(
                        `INSERT INTO users (fullName, username, password) VALUES (?, ?, ?)`,
                        [fullname, username, hashPassword],
                        (err, result) => {
                            if (err) throw err;
                            res.render('register', { success: true, msg: 'Registrasi berhasil. Silakan login.' });
                        }
                    );
                }
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
        
    },

    login: async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
    
        console.log('Username from form:', username);
        console.log('Password from form:', password);
    
        try {
            connection.query(
                `SELECT username, password FROM users WHERE username = '${username}'`, async (err, result) => {
                    if (err) throw err;
    
                    console.log('Query result:', result);
    
                    if (result.length > 0) {
                        const storedHash = result[0].password;
    
                        try {
                            const verifyPass = await bcrypt.compare(password, storedHash);
                            console.log('Password verification result:', verifyPass);
                            if (verifyPass) {
                                req.session.login = true;
                                req.session.username = username;
                                console.log('Login successful:', req.session);
                                return res.render('login', { success: true, msg: 'Berhasil masuk!' });
                                
                            } else {
                                req.session.login = false; // Optional: Reset session login status
                                console.log('Password mismatch');
                                return res.render('login', { success: false, msg: 'Password salah' });
                            }
                        } catch (compareError) {
                            console.error('Error during password comparison:', compareError);
                            res.status(500).send('Internal Server Error');
                        }
                    } else {
                        console.log('No user found with that username');
                        return res.render('login', { success: false, msg: 'Username tidak ditemukan' });
                    }
                }
            );
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error('Error destroying session:', err);
            res.redirect('/login');
        });
    }
}

module.exports = { UserController };
