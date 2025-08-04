import nodemailer from "nodemailer";
import { logger } from "../middlewares/logger.js";
import config from "../config/config.js";

/**
 * Service pour gérer l'envoi d'emails
 */

class EmailService {
  /**
   * Créer un transporteur d'emails
   * @returns {Object} - Transporteur d'emails
   */
  static createTransporter() {
    try {
      // Pour cette démonstration, nous utilisons un transporteur de test
      // En production, vous utiliseriez un service comme SendGrid ou Mailgun
      const transporter = nodemailer.createTransporter({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "test@example.com",
          pass: "password"
        }
      });
      
      return transporter;
    } catch (error) {
      logger.error(`Erreur lors de la création du transporteur d'emails: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer un email
   * @param {Object} mailOptions - Options de l'email
   * @returns {Promise<Object>} - Résultat de l'envoi
   */
  static async sendEmail(mailOptions) {
    try {
      const transporter = this.createTransporter();
      
      // Ajouter l'expéditeur par défaut si non spécifié
      if (!mailOptions.from) {
        mailOptions.from = config.email.from;
      }
      
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email envoyé: ${info.messageId}`);
      
      return { success: true, messageId: info.messageId };
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer un email de bienvenue
   * @param {string} email - Adresse email du destinataire
   * @param {string} username - Nom d'utilisateur
   * @returns {Promise<Object>} - Résultat de l'envoi
   */
  static async sendWelcomeEmail(email, username) {
    try {
      const mailOptions = {
        to: email,
        subject: "Bienvenue sur Afristock",
        html: `
          <h1>Bienvenue sur Afristock, ${username}!</h1>
          <p>Nous sommes ravis de vous accueillir sur notre plateforme de gestion de stock.</p>
          <p>Vous pouvez maintenant commencer à gérer vos stocks efficacement.</p>
          <p>Cordialement,<br>L'équipe Afristock</p>
        `
      };
      
      return await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email de bienvenue: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe
   * @param {string} email - Adresse email du destinataire
   * @param {string} username - Nom d'utilisateur
   * @param {string} resetToken - Token de réinitialisation
   * @returns {Promise<Object>} - Résultat de l'envoi
   */
  static async sendPasswordResetEmail(email, username, resetToken) {
    try {
      const mailOptions = {
        to: email,
        subject: "Réinitialisation de votre mot de passe Afristock",
        html: `
          <h1>Réinitialisation de votre mot de passe</h1>
          <p>Bonjour ${username},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe:</p>
          <p><a href="${config.clientUrl}/reset-password?token=${resetToken}">Réinitialiser mon mot de passe</a></p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe Afristock</p>
        `
      };
      
      return await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email de réinitialisation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer un email d'alerte
   * @param {string} email - Adresse email du destinataire
   * @param {string} alertMessage - Message d'alerte
   * @param {string} alertType - Type d'alerte
   * @returns {Promise<Object>} - Résultat de l'envoi
   */
  static async sendAlertEmail(email, alertMessage, alertType) {
    try {
      const mailOptions = {
        to: email,
        subject: `Alerte Afristock - ${alertType}`,
        html: `
          <h1>Alerte Afristock</h1>
          <p>${alertMessage}</p>
          <p>Type d'alerte: ${alertType}</p>
          <p>Veuillez vérifier votre application Afristock pour plus de détails.</p>
          <p>Cordialement,<br>L'équipe Afristock</p>
        `
      };
      
      return await this.sendEmail(mailOptions);
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email d'alerte: ${error.message}`);
      throw error;
    }
  }
}

export default EmailService;
