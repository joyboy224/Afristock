// Gestion du mode de l'application (local ou centralisé)

// Sélectionner le mode
function selectMode(mode) {
    // Vérifier que le mode est valide
    if (mode !== 'local' && mode !== 'central') {
        throw new Error('Mode invalide. Les modes valides sont "local" et "central".');
    }
    
    // Sauvegarder le mode sélectionné dans le localStorage
    localStorage.setItem('selectedMode', mode);
    
    console.log(`Mode sélectionné: ${mode}`);
    
    // Rediriger vers le tableau de bord
    window.location.href = 'dashboard.html';
}

// Obtenir le mode sélectionné
function getSelectedMode() {
    return localStorage.getItem('selectedMode') || 'local';
}

// Vérifier si le mode centralisé est sélectionné
function isCentralMode() {
    return getSelectedMode() === 'central';
}

// Vérifier si le mode local est sélectionné
function isLocalMode() {
    return getSelectedMode() === 'local';
}

// Initialiser le mode
function initMode() {
    // Obtenir le mode sélectionné
    const mode = getSelectedMode();
    
    // Mettre à jour l'interface utilisateur selon le mode
    updateUIForMode(mode);
    
    console.log(`Mode initialisé: ${mode}`);
}

// Mettre à jour l'interface utilisateur selon le mode
function updateUIForMode(mode) {
    // Mettre à jour les éléments de l'interface utilisateur selon le mode
    const modeIndicator = document.getElementById('modeIndicator');
    if (modeIndicator) {
        modeIndicator.textContent = mode === 'central' ? 'Mode Centralisé' : 'Mode Local';
        modeIndicator.className = mode === 'central' ? 'mode-indicator central' : 'mode-indicator local';
    }
    
    // Afficher ou masquer les éléments spécifiques au mode centralisé
    const centralElements = document.querySelectorAll('.central-only');
    centralElements.forEach(element => {
        element.style.display = mode === 'central' ? 'block' : 'none';
    });
    
    // Afficher ou masquer les éléments spécifiques au mode local
    const localElements = document.querySelectorAll('.local-only');
    localElements.forEach(element => {
        element.style.display = mode === 'local' ? 'block' : 'none';
    });
}

// Synchroniser les données avec le backend (mode centralisé)
async function syncWithBackend() {
    // Vérifier si nous sommes en mode centralisé
    if (!isCentralMode()) {
        console.log('La synchronisation avec le backend n\'est disponible qu\'en mode centralisé');
        return;
    }
    
    // Obtenir le token JWT
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error('Token d\'authentification manquant');
    }
    
    try {
        // Synchroniser les utilisateurs
        if (window.users && typeof window.users.syncWithBackend === 'function') {
            await window.users.syncWithBackend();
        }
        
        // Synchroniser les produits
        if (window.produit && typeof window.produit.syncWithBackend === 'function') {
            await window.produit.syncWithBackend();
        }
        
        // Synchroniser les ventes
        if (window.vente && typeof window.vente.syncWithBackend === 'function') {
            await window.vente.syncWithBackend();
        }
        
        // Synchroniser les factures
        if (window.facture && typeof window.facture.syncWithBackend === 'function') {
            await window.facture.syncWithBackend();
        }
        
        console.log('Synchronisation avec le backend terminée');
    } catch (error) {
        console.error('Erreur lors de la synchronisation avec le backend:', error);
        throw error;
    }
}

// Gérer le changement de mode
async function changeMode(newMode) {
    // Vérifier que le mode est valide
    if (newMode !== 'local' && newMode !== 'central') {
        throw new Error('Mode invalide. Les modes valides sont "local" et "central".');
    }
    
    // Obtenir le mode actuel
    const currentMode = getSelectedMode();
    
    // Si le mode est le même, ne rien faire
    if (currentMode === newMode) {
        console.log(`Déjà en mode ${newMode}`);
        return;
    }
    
    // Si on passe en mode centralisé, vérifier que l'utilisateur est authentifié
    if (newMode === 'central') {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Vous devez vous authentifier pour passer en mode centralisé');
        }
        
        // Vérifier le token
        const response = await fetch('http://localhost:4000/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Token d\'authentification invalide');
        }
    }
    
    // Sauvegarder le nouveau mode
    localStorage.setItem('selectedMode', newMode);
    
    // Mettre à jour l'interface utilisateur
    updateUIForMode(newMode);
    
    // Si on passe en mode centralisé, synchroniser les données
    if (newMode === 'central') {
        try {
            await syncWithBackend();
        } catch (error) {
            console.error('Erreur lors de la synchronisation avec le backend:', error);
            // Revenir au mode local en cas d'erreur
            localStorage.setItem('selectedMode', 'local');
            updateUIForMode('local');
            throw error;
        }
    }
    
    console.log(`Mode changé: ${currentMode} -> ${newMode}`);
}

// Gérer la sélection du mode dans l'interface utilisateur
function handleModeSelection() {
    // Gérer le clic sur le bouton de mode local
    const localModeBtn = document.getElementById('localModeBtn');
    if (localModeBtn) {
        localModeBtn.addEventListener('click', () => {
            selectMode('local');
        });
    }
    
    // Gérer le clic sur le bouton de mode centralisé
    const centralModeBtn = document.getElementById('centralModeBtn');
    if (centralModeBtn) {
        centralModeBtn.addEventListener('click', () => {
            selectMode('central');
        });
    }
}

// Initialiser la gestion du mode
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le mode
    initMode();
    
    // Gérer la sélection du mode
    handleModeSelection();
});

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.mode = {
    selectMode,
    getSelectedMode,
    isCentralMode,
    isLocalMode,
    initMode,
    updateUIForMode,
    syncWithBackend,
    changeMode
};
