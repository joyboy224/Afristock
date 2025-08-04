// Gestion des notifications en temps réel
class Notifications {
    constructor() {
        this.socket = null;
        this.notificationCount = 0;
        this.maxNotifications = 10;
    }

    // Initialiser la connexion aux notifications
    init() {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            console.log('Les notifications en temps réel ne sont disponibles qu\'en mode centralisé');
            return;
        }

        // Créer une connexion WebSocket (simulation)
        // Dans une implémentation réelle, vous utiliseriez une vraie connexion WebSocket
        this.socket = {
            connected: true,
            on: (event, callback) => {
                // Simulation d'événements
                if (event === 'notification') {
                    this.notificationCallback = callback;
                }
            },
            emit: (event, data) => {
                console.log(`Émission d'événement: ${event}`, data);
            }
        };

        // Simuler la réception de notifications
        this.simulateNotifications();

        console.log('Connexion aux notifications initialisée');
    }

    // Simuler la réception de notifications
    simulateNotifications() {
        if (!this.socket) return;

        // Simuler la réception de notifications toutes les 30 secondes
        setInterval(() => {
            if (this.notificationCallback && Math.random() > 0.7) {
                const notifications = [
                    { type: 'alert', message: 'Stock faible pour le produit X', severity: 'high' },
                    { type: 'info', message: 'Nouvelle commande reçue', severity: 'medium' },
                    { type: 'warning', message: 'Maintenance prévue ce soir', severity: 'medium' },
                    { type: 'success', message: 'Commande expédiée avec succès', severity: 'low' }
                ];

                const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
                this.notificationCallback(randomNotification);
            }
        }, 30000);
    }

    // Gérer une notification reçue
    handleNotification(notification) {
        this.notificationCount++;
        
        // Limiter le nombre de notifications affichées
        if (this.notificationCount > this.maxNotifications) {
            this.clearOldNotifications();
        }

        // Afficher la notification
        this.displayNotification(notification);

        // Enregistrer la notification
        this.logNotification(notification);

        // Envoyer un email si nécessaire
        this.sendEmailNotification(notification);
    }

    // Afficher une notification
    displayNotification(notification) {
        // Créer un élément de notification
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification notification-${notification.severity}`;
        notificationElement.innerHTML = `
            <div class="notification-content">
                <span class="notification-type">${notification.type}</span>
                <span class="notification-message">${notification.message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Ajouter la notification au conteneur
        const container = document.getElementById('notifications-container');
        if (container) {
            container.appendChild(notificationElement);
            
            // Supprimer automatiquement la notification après 10 secondes
            setTimeout(() => {
                if (notificationElement.parentElement) {
                    notificationElement.remove();
                }
            }, 10000);
        }
    }

    // Enregistrer une notification
    logNotification(notification) {
        // Dans une implémentation réelle, vous enverriez cette notification au backend
        console.log('Notification reçue:', notification);
        
        // Enregistrer dans le localStorage pour persistance
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.push({
            ...notification,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // Envoyer une notification par email
    sendEmailNotification(notification) {
        // Vérifier si l'email est activé pour ce type de notification
        const emailSettings = JSON.parse(localStorage.getItem('emailSettings') || '{}');
        const shouldSendEmail = emailSettings[notification.type];
        
        if (shouldSendEmail) {
            // Dans une implémentation réelle, vous enverriez une requête au backend
            // pour envoyer l'email via la file d'attente
            console.log(`Envoi d'un email pour la notification: ${notification.message}`);
            
            // Simuler l'envoi via la file d'attente d'emails
            if (window.emailQueue && typeof window.emailQueue.add === 'function') {
                const emailData = {
                    to: 'user@example.com',
                    subject: `Notification Afristock - ${notification.type}`,
                    html: `
                        <h1>Notification Afristock</h1>
                        <p>Type: ${notification.type}</p>
                        <p>Message: ${notification.message}</p>
                        <p>Gravité: ${notification.severity}</p>
                        <p>Date: ${new Date().toLocaleString()}</p>
                    `
                };
                
                window.emailQueue.add(emailData);
            }
        }
    }

    // Effacer les anciennes notifications
    clearOldNotifications() {
        const container = document.getElementById('notifications-container');
        if (container && container.children.length > this.maxNotifications) {
            // Supprimer les notifications les plus anciennes
            while (container.children.length > this.maxNotifications) {
                container.removeChild(container.firstChild);
            }
        }
        
        this.notificationCount = this.maxNotifications;
    }

    // Fermer la connexion aux notifications
    close() {
        if (this.socket) {
            this.socket.connected = false;
            this.socket = null;
            console.log('Connexion aux notifications fermée');
        }
    }

    // Obtenir les notifications récentes
    getRecentNotifications() {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        // Retourner les 10 notifications les plus récentes
        return notifications.slice(-10).reverse();
    }

    // Effacer toutes les notifications
    clearAllNotifications() {
        const container = document.getElementById('notifications-container');
        if (container) {
            container.innerHTML = '';
        }
        localStorage.removeItem('notifications');
        this.notificationCount = 0;
    }
}

// Créer une instance globale
window.notifications = new Notifications();
