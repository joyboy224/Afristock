// Gestion des factures

// Données des factures (simulation de base de données locale)
let localInvoices = [
    { 
        id: '1', 
        saleId: '1',
        customerName: 'Client 1',
        items: [
            { productId: '1', productName: 'Produit 1', quantity: 2, price: 1000, total: 2000 },
            { productId: '2', productName: 'Produit 2', quantity: 1, price: 2000, total: 2000 }
        ],
        subtotal: 4000,
        tax: 400,
        total: 4400,
        date: '2023-01-15',
        status: 'paid'
    },
    { 
        id: '2', 
        saleId: '2',
        customerName: 'Client 2',
        items: [
            { productId: '1', productName: 'Produit 1', quantity: 1, price: 1000, total: 1000 }
        ],
        subtotal: 1000,
        tax: 100,
        total: 1100,
        date: '2023-01-16',
        status: 'pending'
    }
];

// Initialiser la gestion des factures
function initInvoices() {
    // Charger les factures depuis le localStorage
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
        localInvoices = JSON.parse(savedInvoices);
    }
    
    console.log('Gestion des factures initialisée');
}

// Obtenir toutes les factures
function getAllInvoices() {
    return localInvoices;
}

// Obtenir une facture par ID
function getInvoiceById(id) {
    return localInvoices.find(i => i.id === id);
}

// Créer une nouvelle facture
function createInvoice(invoiceData) {
    // Générer un ID unique
    const newId = (localInvoices.length + 1).toString();
    
    // Créer la nouvelle facture
    const newInvoice = {
        id: newId,
        ...invoiceData,
        date: new Date().toISOString().split('T')[0] // Date actuelle au format YYYY-MM-DD
    };
    
    // Ajouter à la liste des factures
    localInvoices.push(newInvoice);
    
    // Sauvegarder dans le localStorage
    saveInvoices();
    
    console.log(`Facture créée: ${newId}`);
    return newInvoice;
}

// Mettre à jour une facture
function updateInvoice(invoiceId, updates) {
    const invoiceIndex = localInvoices.findIndex(i => i.id === invoiceId);
    if (invoiceIndex !== -1) {
        // Mettre à jour la facture
        localInvoices[invoiceIndex] = { ...localInvoices[invoiceIndex], ...updates };
        
        // Sauvegarder dans le localStorage
        saveInvoices();
        
        console.log(`Facture mise à jour: ${invoiceId}`);
        return localInvoices[invoiceIndex];
    }
    throw new Error('Facture non trouvée');
}

// Supprimer une facture
function deleteInvoice(invoiceId) {
    const invoiceIndex = localInvoices.findIndex(i => i.id === invoiceId);
    if (invoiceIndex !== -1) {
        // Supprimer la facture
        const deletedInvoice = localInvoices.splice(invoiceIndex, 1)[0];
        
        // Sauvegarder dans le localStorage
        saveInvoices();
        
        console.log(`Facture supprimée: ${deletedInvoice.id}`);
        return deletedInvoice;
    }
    throw new Error('Facture non trouvée');
}

// Générer une facture à partir d'une vente
function generateInvoiceFromSale(sale) {
    // Calculer le sous-total
    const subtotal = sale.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculer la taxe (10%)
    const tax = subtotal * 0.1;
    
    // Calculer le total
    const total = subtotal + tax;
    
    // Créer la facture
    const invoice = createInvoice({
        saleId: sale.id,
        customerName: sale.customerName,
        items: sale.items.map(item => ({
            ...item,
            total: item.price * item.quantity
        })),
        subtotal: subtotal,
        tax: tax,
        total: total,
        status: 'pending'
    });
    
    return invoice;
}

// Marquer une facture comme payée
function markInvoiceAsPaid(invoiceId) {
    const invoice = getInvoiceById(invoiceId);
    if (invoice) {
        invoice.status = 'paid';
        
        // Sauvegarder dans le localStorage
        saveInvoices();
        
        console.log(`Facture ${invoiceId} marquée comme payée`);
        return invoice;
    }
    throw new Error('Facture non trouvée');
}

// Marquer une facture comme annulée
function markInvoiceAsCancelled(invoiceId) {
    const invoice = getInvoiceById(invoiceId);
    if (invoice) {
        invoice.status = 'cancelled';
        
        // Sauvegarder dans le localStorage
        saveInvoices();
        
        console.log(`Facture ${invoiceId} marquée comme annulée`);
        return invoice;
    }
    throw new Error('Facture non trouvée');
}

// Rechercher des factures
function searchInvoices(query) {
    const lowerQuery = query.toLowerCase();
    return localInvoices.filter(i => 
        i.customerName.toLowerCase().includes(lowerQuery) ||
        i.items.some(item => item.productName.toLowerCase().includes(lowerQuery)) ||
        i.id.includes(query)
    );
}

// Filtrer les factures par date
function filterInvoicesByDate(startDate, endDate) {
    return localInvoices.filter(i => {
        const invoiceDate = new Date(i.date);
        return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
    });
}

// Filtrer les factures par statut
function filterInvoicesByStatus(status) {
    return localInvoices.filter(i => i.status === status);
}

// Obtenir le total des factures sur une période
function getTotalInvoicesForPeriod(startDate, endDate) {
    const invoices = filterInvoicesByDate(startDate, endDate);
    return invoices.reduce((total, invoice) => total + invoice.total, 0);
}

// Obtenir le total des factures par statut
function getTotalInvoicesByStatus(status) {
    const invoices = filterInvoicesByStatus(status);
    return invoices.reduce((total, invoice) => total + invoice.total, 0);
}

// Sauvegarder les factures dans le localStorage
function saveInvoices() {
    localStorage.setItem('invoices', JSON.stringify(localInvoices));
}

// Synchroniser les factures avec le backend (mode centralisé)
async function syncWithBackend() {
    // Vérifier si nous sommes en mode centralisé
    const mode = localStorage.getItem('selectedMode');
    if (mode !== 'central') {
        console.log('La synchronisation avec le backend n\'est disponible qu\'en mode centralisé');
        return;
    }
    
    // Obtenir le token JWT
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error('Token d\'authentification manquant');
    }
    
    try {
        // Récupérer les factures depuis le backend
        const response = await fetch('http://localhost:4000/api/invoices', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la récupération des factures');
        }
        
        const backendInvoices = await response.json();
        
        // Mettre à jour les factures locales
        localInvoices = backendInvoices;
        
        // Sauvegarder dans le localStorage
        saveInvoices();
        
        console.log('Factures synchronisées avec le backend');
    } catch (error) {
        console.error('Erreur lors de la synchronisation avec le backend:', error);
        throw error;
    }
}

// Imprimer une facture
function printInvoice(invoiceId) {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) {
        throw new Error('Facture non trouvée');
    }
    
    // Créer une fenêtre d'impression
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Facture ${invoice.id}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .invoice-header { text-align: center; margin-bottom: 20px; }
                .invoice-details { margin-bottom: 20px; }
                .invoice-items { width: 100%; border-collapse: collapse; }
                .invoice-items th, .invoice-items td { border: 1px solid #000; padding: 8px; text-align: left; }
                .invoice-total { text-align: right; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1>Facture</h1>
                <p>ID: ${invoice.id}</p>
                <p>Date: ${invoice.date}</p>
            </div>
            
            <div class="invoice-details">
                <p>Client: ${invoice.customerName}</p>
            </div>
            
            <table class="invoice-items">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price} FCFA</td>
                            <td>${item.total} FCFA</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="invoice-total">
                <p>Sous-total: ${invoice.subtotal} FCFA</p>
                <p>Taxe (10%): ${invoice.tax} FCFA</p>
                <p>Total: ${invoice.total} FCFA</p>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    console.log(`Facture ${invoiceId} envoyée à l'impression`);
}

// Exporter une facture au format PDF
function exportInvoiceToPDF(invoiceId) {
    const invoice = getInvoiceById(invoiceId);
    if (!invoice) {
        throw new Error('Facture non trouvée');
    }
    
    // Pour cette simulation, nous allons simplement ouvrir une fenêtre avec le contenu de la facture
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme jsPDF
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(`
        <html>
        <head>
            <title>Facture ${invoice.id} - PDF</title>
            <style>
                body { font-family: Arial, sans-serif; }
                .invoice-header { text-align: center; margin-bottom: 20px; }
                .invoice-details { margin-bottom: 20px; }
                .invoice-items { width: 100%; border-collapse: collapse; }
                .invoice-items th, .invoice-items td { border: 1px solid #000; padding: 8px; text-align: left; }
                .invoice-total { text-align: right; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1>Facture</h1>
                <p>ID: ${invoice.id}</p>
                <p>Date: ${invoice.date}</p>
            </div>
            
            <div class="invoice-details">
                <p>Client: ${invoice.customerName}</p>
            </div>
            
            <table class="invoice-items">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price} FCFA</td>
                            <td>${item.total} FCFA</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="invoice-total">
                <p>Sous-total: ${invoice.subtotal} FCFA</p>
                <p>Taxe (10%): ${invoice.tax} FCFA</p>
                <p>Total: ${invoice.total} FCFA</p>
            </div>
        </body>
        </html>
    `);
    
    pdfWindow.document.close();
    
    console.log(`Facture ${invoiceId} exportée au format PDF`);
}

// Initialiser la gestion des factures
initInvoices();

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.facture = {
    getAllInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generateInvoiceFromSale,
    markInvoiceAsPaid,
    markInvoiceAsCancelled,
    searchInvoices,
    filterInvoicesByDate,
    filterInvoicesByStatus,
    getTotalInvoicesForPeriod,
    getTotalInvoicesByStatus,
    syncWithBackend,
    printInvoice,
    exportInvoiceToPDF
};
