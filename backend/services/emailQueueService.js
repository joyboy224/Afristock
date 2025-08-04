import EmailService from "./emailService.js";
import { logger } from "../middlewares/logger.js";

/**
 * Service pour gérer la file d'attente d'emails
 */

class EmailQueueService {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.interval = null;
  }

  /**
   * Ajouter un email à la file d'attente
   * @param {Object} mailOptions - Options de l'email
   * @param {number} priority - Priorité de l'email (1: haute, 2: normale, 3: basse)
   */
  enqueueEmail(mailOptions, priority = 2) {
    try {
      const emailJob = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        mailOptions,
        priority,
        createdAt: new Date(),
        attempts: 0,
        maxAttempts: 3
      };

      // Ajouter l'email à la file d'attente selon sa priorité
      if (priority === 1) {
        // Priorité haute: ajouter au début de la file
        this.queue.unshift(emailJob);
      } else if (priority === 3) {
        // Priorité basse: ajouter à la fin de la file
        this.queue.push(emailJob);
      } else {
        // Priorité normale: ajouter après les emails de priorité haute
        const highPriorityIndex = this.queue.findIndex(job => job.priority === 1);
        if (highPriorityIndex === -1) {
          this.queue.unshift(emailJob);
        } else {
          this.queue.splice(highPriorityIndex + 1, 0, emailJob);
        }
      }

      logger.info(`Email ajouté à la file d'attente: ${emailJob.id} (priorité: ${priority})`);
      
      // Démarrer le traitement si ce n'est pas déjà fait
      if (!this.isProcessing) {
        this.startProcessing();
      }
    } catch (error) {
      logger.error(`Erreur lors de l'ajout de l'email à la file d'attente: ${error.message}`);
      throw error;
    }
  }

  /**
   * Traiter la file d'attente d'emails
   */
  async processQueue() {
    if (this.queue.length === 0) {
      this.stopProcessing();
      return;
    }

    this.isProcessing = true;
    const emailJob = this.queue[0];

    try {
      emailJob.attempts++;
      logger.info(`Traitement de l'email: ${emailJob.id} (tentative ${emailJob.attempts})`);
      
      // Envoyer l'email
      await EmailService.sendEmail(emailJob.mailOptions);
      
      // Retirer l'email de la file d'attente
      this.queue.shift();
      logger.info(`Email envoyé avec succès: ${emailJob.id}`);
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de l'email: ${error.message}`);
      
      // Réessayer si le nombre maximal de tentatives n'est pas atteint
      if (emailJob.attempts < emailJob.maxAttempts) {
        logger.info(`Réessai de l'email: ${emailJob.id} (tentative ${emailJob.attempts + 1})`);
        // Remettre l'email à la fin de la file pour réessayer
        this.queue.push(emailJob);
        this.queue.shift(); // Retirer l'email de sa position actuelle
      } else {
        logger.error(`Échec de l'envoi de l'email après ${emailJob.maxAttempts} tentatives: ${emailJob.id}`);
        // Retirer l'email de la file d'attente
        this.queue.shift();
      }
    }
  }

  /**
   * Démarrer le traitement de la file d'attente
   */
  startProcessing() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      this.processQueue();
    }, 1000); // Traiter un email par seconde

    logger.info("Démarrage du traitement de la file d'attente d'emails");
  }

  /**
   * Arrêter le traitement de la file d'attente
   */
  stopProcessing() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    this.isProcessing = false;
    logger.info("Arrêt du traitement de la file d'attente d'emails");
  }

  /**
   * Obtenir l'état de la file d'attente
   * @returns {Object} - État de la file d'attente
   */
  getQueueStatus() {
    return {
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
      emails: this.queue.map(job => ({
        id: job.id,
        priority: job.priority,
        createdAt: job.createdAt,
        attempts: job.attempts
      }))
    };
  }

  /**
   * Vider la file d'attente
   */
  clearQueue() {
    this.queue = [];
    logger.info("File d'attente d'emails vidée");
  }

  /**
   * Envoyer un email de bienvenue via la file d'attente
   * @param {string} email - Adresse email du destinataire
   * @param {string} username - Nom d'utilisateur
   * @param {number} priority - Priorité de l'email
   */
  sendWelcomeEmail(email, username, priority = 2) {
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
      
      this.enqueueEmail(mailOptions, priority);
    } catch (error) {
      logger.error(`Erreur lors de l'ajout de l'email de bienvenue à la file d'attente: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer un email de réinitialisation de mot de passe via la file d'attente
   * @param {string} email - Adresse email du destinataire
   * @param {string} username - Nom d'utilisateur
   * @param {string} resetToken - Token de réinitialisation
   * @param {number} priority - Priorité de l'email
   */
  sendPasswordResetEmail(email, username, resetToken, priority = 1) {
    try {
      const mailOptions = {
        to: email,
        subject: "Réinitialisation de votre mot de passe Afristock",
        html: `
          <h1>Réinitialisation de votre mot de passe</h1>
          <p>Bonjour ${username},</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe:</p>
          <p><a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}">Réinitialiser mon mot de passe</a></p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe Afristock</p>
        `
      };
      
      this.enqueueEmail(mailOptions, priority);
    } catch (error) {
      logger.error(`Erreur lors de l'ajout de l'email de réinitialisation à la file d'attente: ${error.message}`);
      throw error;
    }
  }

  /**
   * Envoyer un email d'alerte via la file d'attente
   * @param {string} email - Adresse email du destinataire
   * @param {string} alertMessage - Message d'alerte
   * @param {string} alertType - Type d'alerte
   * @param {number} priority - Priorité de l'email
   */
  sendAlertEmail(email, alertMessage, alertType, priority = 2) {
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
      
      this.enqueueEmail(mailOptions, priority);
    } catch (error) {
      logger.error(`Erreur lors de l'ajout de l'email d'alerte à la file d'attente: ${error.message}`);
      throw error;
    }
  }
}

// Exporter une instance singleton du service
export default new EmailQueueService();
