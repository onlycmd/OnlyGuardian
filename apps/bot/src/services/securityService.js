import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Güvenlik ve Şifreleme Servisi
 */
export class SecurityService {
    static JWT_SECRET = process.env.JWT_SECRET || 'onlyguardian_secret_key_123';
    static ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '32_char_long_secret_key_for_aes_256'; // 32 byte olmalı

    /**
     * Dashboard için JWT oluşturur.
     * @param {object} payload 
     * @returns {string}
     */
    static generateToken(payload) {
        return jwt.sign(payload, this.JWT_SECRET, { expiresIn: '7d' });
    }

    /**
     * JWT doğrular.
     * @param {string} token 
     * @returns {object|null}
     */
    static verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }

    /**
     * Hassas verileri (örn. webhook URL'leri) şifreler.
     * @param {string} text 
     * @returns {string}
     */
    static encrypt(text) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    /**
     * Şifrelenmiş veriyi çözer.
     * @param {string} text 
     * @returns {string}
     */
    static decrypt(text) {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
