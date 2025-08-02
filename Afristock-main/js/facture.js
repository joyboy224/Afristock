// Gestion des factures

document.addEventListener('DOMContentLoaded', function() {
    // Afficher la facture
    displayInvoice();
    
    // Bouton d'impression
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Bouton "Voir les factures"
    const viewInvoicesBtn = document.getElementById('viewInvoicesBtn');
    if (viewInvoicesBtn) {
        viewInvoicesBtn.addEventListener('click', function() {
            // Pour l'instant, on redirige vers la page de facture avec la dernière facture
            // Dans une vraie application, il y aurait une page listant toutes les factures
            const invoice = getCurrentInvoice();
            if (invoice) {
                sessionStorage.setItem('currentInvoice', JSON.stringify(invoice));
                window.location.href = 'facture.html';
            } else {
                alert('Aucune facture disponible');
            }
        });
    }
});

// Fonction pour afficher la facture
function displayInvoice() {
    const invoice = getCurrentInvoice();
    
    if (!invoice) {
        document.querySelector('.invoice-content').innerHTML = '<p>Aucune facture disponible</p>';
        return;
    }
    
    // Remplir les informations de la facture
    document.getElementById('invoiceNumber').textContent = invoice.id;
    document.getElementById('invoiceDate').textContent = invoice.date;
    document.getElementById('invoiceCustomerName').textContent = invoice.customerName;
    document.getElementById('invoiceCustomerPhone').textContent = invoice.customerPhone || '-';
    document.getElementById('invoiceCustomerAddress').textContent = invoice.customerAddress || '-';
    document.getElementById('invoiceTotalAmount').textContent = `${invoice.totalAmount} FCFA`;
    
    // Remplir les articles de la facture
    const tableBody = document.querySelector('#invoiceItemsTable tbody');
    tableBody.innerHTML = '';
    
    invoice.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice} FCFA</td>
            <td>${item.totalPrice} FCFA</td>
        `;
        tableBody.appendChild(row);
    });
    
    // Afficher le nom de la boutique
    const boutiqueId = localStorage.getItem('boutiqueId');
    if (boutiqueId) {
        document.getElementById('invoiceBoutique').textContent = boutiqueId;
    }
}

// Fonction pour obtenir la facture actuelle
function getCurrentInvoice() {
    // D'abord, vérifier dans la session
    const sessionInvoice = sessionStorage.getItem('currentInvoice');
    if (sessionInvoice) {
        return JSON.parse(sessionInvoice);
    }
    
    // Sinon, obtenir la dernière facture
    const invoices = getInvoices();
    return invoices.length > 0 ? invoices[invoices.length - 1] : null;
}

// Fonction pour obtenir les factures
function getInvoices() {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `invoices_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `invoices_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}

// Fonction pour obtenir les produits (copiée de produit.js)
function getProducts() {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `products_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `products_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}
