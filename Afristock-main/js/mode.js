// Gestion du choix du mode de fonctionnement

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si un mode est déjà sélectionné
    const selectedMode = localStorage.getItem('selectedMode');
    if (selectedMode) {
        // Rediriger vers le tableau de bord si le mode est déjà choisi
        window.location.href = 'dashboard.html';
    }
    
    // Boutons de choix de mode
    const btnLocal = document.querySelector('.btn-local');
    const btnCentral = document.querySelector('.btn-central');
    
    if (btnLocal) {
        btnLocal.addEventListener('click', function() {
            selectMode('local');
        });
    }
    
    if (btnCentral) {
        btnCentral.addEventListener('click', function() {
            selectMode('central');
        });
    }
});

// Fonction pour sélectionner un mode
function selectMode(mode) {
    // Stocker le mode sélectionné
    localStorage.setItem('selectedMode', mode);
    
    // Initialiser les données selon le mode choisi
    if (mode === 'local') {
        initializeLocalData();
    }
    
    // Rediriger vers le tableau de bord
    window.location.href = 'dashboard.html';
}

// Initialiser les données locales
function initializeLocalData() {
    const boutiqueId = localStorage.getItem('boutiqueId');
    if (!boutiqueId) return;
    
    // Créer un fichier de stock pour la boutique si nécessaire
    const stockKey = `stock_${boutiqueId}`;
    if (!localStorage.getItem(stockKey)) {
        localStorage.setItem(stockKey, JSON.stringify([]));
    }
    
    // Créer un fichier de factures pour la boutique si nécessaire
    const invoicesKey = `invoices_${boutiqueId}`;
    if (!localStorage.getItem(invoicesKey)) {
        localStorage.setItem(invoicesKey, JSON.stringify([]));
    }
}

// Fonction pour obtenir le mode actuel
function getCurrentMode() {
    return localStorage.getItem('selectedMode') || 'local';
}

// Fonction pour obtenir les données selon le mode
function getDataForMode(dataType) {
    const mode = getCurrentMode();
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `${dataType}_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `${dataType}_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}

// Fonction pour sauvegarder les données selon le mode
function saveDataForMode(dataType, data) {
    const mode = getCurrentMode();
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `${dataType}_${boutiqueId}`;
        localStorage.setItem(key, JSON.stringify(data));
    } else {
        // Pour le mode centralisé, cela serait envoyé à un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `${dataType}_central`;
        localStorage.setItem(key, JSON.stringify(data));
    }
}

// Afficher le mode dans le tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    const modeInfoElement = document.getElementById('modeInfo');
    if (modeInfoElement) {
        const mode = getCurrentMode();
        const modeText = mode === 'local' ? 'Stock individuel (local)' : 'Stock partagé (centralisé)';
        modeInfoElement.textContent = `Mode: ${modeText}`;
    }
});
