// Gestion de la file d'attente d'emails
class EmailQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.processingInterval = null;
        this.maxRetries = 3;
    }

    // Initialiser la file d'attente d'emails
    init() {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            console.log('La file d\'attente d\'emails n\'est disponible qu\'en mode centralisé');
            return;
        }

        // Démarrer le traitement de la file d'attente
        this.startProcessing();

        console.log('File d\'attente d\'emails initialisée');
    }

    // Ajouter un email à la file d'attente
    add(emailData, priority = 2) {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            console.log('La file d\'attente d\'emails n\'est disponible qu\'en mode centralisé');
            return;
        }

        const emailJob = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            emailData,
            priority,
            createdAt: new Date(),
            attempts: 0,
            maxAttempts: this.maxRetries
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

        console.log(`Email ajouté à la file d'attente: ${emailJob.id} (priorité: ${priority})`);

        // Démarrer le traitement si ce n'est pas déjà fait
        if (!this.isProcessing) {
            this.startProcessing();
        }
    }

    // Traiter la file d'attente d'emails
    async processQueue() {
        if (this.queue.length === 0) {
            this.stopProcessing();
            return;
        }

        this.isProcessing = true;
        const emailJob = this.queue[0];

        try {
            emailJob.attempts++;
            console.log(`Traitement de l'email: ${emailJob.id} (tentative ${emailJob.attempts})`);

            // Envoyer l'email via le backend
            await this.sendEmail(emailJob.emailData);

            // Retirer l'email de la file d'attente
            this.queue.shift();
            console.log(`Email envoyé avec succès: ${emailJob.id}`);
        } catch (error) {
            console.error(`Erreur lors de l'envoi de l'email: ${error.message}`);

            // Réessayer si le nombre maximal de tentatives n'est pas atteint
            if (emailJob.attempts < emailJob.maxAttempts) {
                console.log(`Réessai de l'email: ${emailJob.id} (tentative ${emailJob.attempts + 1})`);
                // Remettre l'email à la fin de la file pour réessayer
                this.queue.push(emailJob);
                this.queue.shift(); // Retirer l'email de sa position actuelle
            } else {
                console.error(`Échec de l'envoi de l'email après ${emailJob.maxAttempts} tentatives: ${emailJob.id}`);
                // Retirer l'email de la file d'attente
                this.queue.shift();
            }
        }
    }

    // Envoyer un email via le backend
    async sendEmail(emailData) {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            throw new Error('La fonction d\'envoi d\'emails n\'est disponible qu\'en mode centralisé');
        }

        // Obtenir le token JWT
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }

        // Envoyer l'email via le backend
        const response = await fetch('http://localhost:4000/api/emails/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de l\'envoi de l\'email');
        }

        return await response.json();
    }

    // Démarrer le traitement de la file d'attente
    startProcessing() {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
        }

        this.processingInterval = setInterval(() => {
            this.processQueue();
        }, 5000); // Traiter un email toutes les 5 secondes

        console.log("Démarrage du traitement de la file d'attente d'emails");
    }

    // Arrêter le traitement de la file d'attente
    stopProcessing() {
        if (this.processingInterval) {
            clearInterval(this.processingInterval);
            this.processingInterval = null;
        }

        this.isProcessing = false;
        console.log("Arrêt du traitement de la file d'attente d'emails");
    }

    // Obtenir l'état de la file d'attente
    getStatus() {
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

    // Vider la file d'attente
    clearQueue() {
        this.queue = [];
        console.log("File d'attente d'emails vidée");
    }

    // Fermer la file d'attente
    close() {
        this.stopProcessing();
        this.clearQueue();
        console.log("File d'attente d'emails fermée");
    }
}

// Créer une instance globale
window.emailQueue = new EmailQueue();
