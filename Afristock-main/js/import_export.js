// Gestion de l'importation et de l'exportation de données

// Exporter les données au format JSON
function exportDataToJSON(data, filename) {
    // Convertir les données en JSON
    const json = JSON.stringify(data, null, 2);
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'data.json';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Données exportées: ${filename || 'data.json'}`);
}

// Importer les données depuis un fichier JSON
function importDataFromJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    };
    reader.readAsText(file);
}

// Exporter les produits au format CSV
function exportProductsToCSV(products, filename) {
    // Créer les en-têtes CSV
    let csv = 'ID,Nom,Description,Prix,Quantité,Catégorie\n';
    
    // Ajouter les données des produits
    products.forEach(product => {
        csv += `"${product.id}","${product.name}","${product.description}","${product.price}","${product.quantity}","${product.category}"\n`;
    });
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Produits exportés: ${filename || 'products.csv'}`);
}

// Importer les produits depuis un fichier CSV
function importProductsFromCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
            // Ignorer la première ligne (en-têtes)
            const products = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    // Diviser la ligne en champs
                    const fields = line.split('","');
                    
                    // Nettoyer les guillemets
                    const cleanedFields = fields.map(field => {
                        return field.replace(/^"|"$/g, '');
                    });
                    
                    // Créer un objet produit
                    const product = {
                        id: cleanedFields[0],
                        name: cleanedFields[1],
                        description: cleanedFields[2],
                        price: parseFloat(cleanedFields[3]),
                        quantity: parseInt(cleanedFields[4]),
                        category: cleanedFields[5]
                    };
                    
                    products.push(product);
                }
            }
            
            callback(null, products);
        } catch (error) {
            callback(error, null);
        }
    };
    reader.readAsText(file);
}

// Exporter les ventes au format CSV
function exportSalesToCSV(sales, filename) {
    // Créer les en-têtes CSV
    let csv = 'ID,Client,Total,Date,Statut\n';
    
    // Ajouter les données des ventes
    sales.forEach(sale => {
        csv += `"${sale.id}","${sale.customerName}","${sale.total}","${sale.date}","${sale.status}"\n`;
    });
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'sales.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Ventes exportées: ${filename || 'sales.csv'}`);
}

// Importer les ventes depuis un fichier CSV
function importSalesFromCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
            // Ignorer la première ligne (en-têtes)
            const sales = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    // Diviser la ligne en champs
                    const fields = line.split('","');
                    
                    // Nettoyer les guillemets
                    const cleanedFields = fields.map(field => {
                        return field.replace(/^"|"$/g, '');
                    });
                    
                    // Créer un objet vente
                    const sale = {
                        id: cleanedFields[0],
                        customerName: cleanedFields[1],
                        total: parseFloat(cleanedFields[2]),
                        date: cleanedFields[3],
                        status: cleanedFields[4]
                    };
                    
                    sales.push(sale);
                }
            }
            
            callback(null, sales);
        } catch (error) {
            callback(error, null);
        }
    };
    reader.readAsText(file);
}

// Exporter les utilisateurs au format CSV
function exportUsersToCSV(users, filename) {
    // Créer les en-têtes CSV
    let csv = 'ID,Nom d\'utilisateur,Rôle,Email\n';
    
    // Ajouter les données des utilisateurs
    users.forEach(user => {
        csv += `"${user.id}","${user.username}","${user.role}","${user.email}"\n`;
    });
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'users.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Utilisateurs exportés: ${filename || 'users.csv'}`);
}

// Importer les utilisateurs depuis un fichier CSV
function importUsersFromCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
            // Ignorer la première ligne (en-têtes)
            const users = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    // Diviser la ligne en champs
                    const fields = line.split('","');
                    
                    // Nettoyer les guillemets
                    const cleanedFields = fields.map(field => {
                        return field.replace(/^"|"$/g, '');
                    });
                    
                    // Créer un objet utilisateur
                    const user = {
                        id: cleanedFields[0],
                        username: cleanedFields[1],
                        role: cleanedFields[2],
                        email: cleanedFields[3]
                    };
                    
                    users.push(user);
                }
            }
            
            callback(null, users);
        } catch (error) {
            callback(error, null);
        }
    };
    reader.readAsText(file);
}

// Exporter les factures au format CSV
function exportInvoicesToCSV(invoices, filename) {
    // Créer les en-têtes CSV
    let csv = 'ID,Vente,Client,Total,Date,Statut\n';
    
    // Ajouter les données des factures
    invoices.forEach(invoice => {
        csv += `"${invoice.id}","${invoice.saleId}","${invoice.customerName}","${invoice.total}","${invoice.date}","${invoice.status}"\n`;
    });
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'invoices.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Factures exportées: ${filename || 'invoices.csv'}`);
}

// Importer les factures depuis un fichier CSV
function importInvoicesFromCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
            // Ignorer la première ligne (en-têtes)
            const invoices = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    // Diviser la ligne en champs
                    const fields = line.split('","');
                    
                    // Nettoyer les guillemets
                    const cleanedFields = fields.map(field => {
                        return field.replace(/^"|"$/g, '');
                    });
                    
                    // Créer un objet facture
                    const invoice = {
                        id: cleanedFields[0],
                        saleId: cleanedFields[1],
                        customerName: cleanedFields[2],
                        total: parseFloat(cleanedFields[3]),
                        date: cleanedFields[4],
                        status: cleanedFields[5]
                    };
                    
                    invoices.push(invoice);
                }
            }
            
            callback(null, invoices);
        } catch (error) {
            callback(error, null);
        }
    };
    reader.readAsText(file);
}

// Exporter les mouvements de stock au format CSV
function exportStockMovementsToCSV(movements, filename) {
    // Créer les en-têtes CSV
    let csv = 'ID,Produit,Type,Quantité,Date,Raison\n';
    
    // Ajouter les données des mouvements
    movements.forEach(movement => {
        csv += `"${movement.id}","${movement.productName}","${movement.type}","${movement.quantity}","${movement.date}","${movement.reason}"\n`;
    });
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'stock_movements.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Mouvements de stock exportés: ${filename || 'stock_movements.csv'}`);
}

// Importer les mouvements de stock depuis un fichier CSV
function importStockMovementsFromCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            
            // Ignorer la première ligne (en-têtes)
            const movements = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line) {
                    // Diviser la ligne en champs
                    const fields = line.split('","');
                    
                    // Nettoyer les guillemets
                    const cleanedFields = fields.map(field => {
                        return field.replace(/^"|"$/g, '');
                    });
                    
                    // Créer un objet mouvement
                    const movement = {
                        id: cleanedFields[0],
                        productName: cleanedFields[1],
                        type: cleanedFields[2],
                        quantity: parseInt(cleanedFields[3]),
                        date: cleanedFields[4],
                        reason: cleanedFields[5]
                    };
                    
                    movements.push(movement);
                }
            }
            
            callback(null, movements);
        } catch (error) {
            callback(error, null);
        }
    };
    reader.readAsText(file);
}

// Exporter toutes les données de l'application
function exportAllData(filename) {
    const allData = {
        products: window.produit.getAllProducts(),
        sales: window.vente.getAllSales(),
        users: window.userManagement.getAllUsers(),
        invoices: window.facture.getAllInvoices(),
        stockMovements: window.stockMovements.getAllStockMovements()
    };
    
    exportDataToJSON(allData, filename || 'all_data.json');
}

// Importer toutes les données de l'application
function importAllData(file, callback) {
    importDataFromJSON(file, (error, data) => {
        if (error) {
            callback(error, null);
            return;
        }
        
        try {
            // Importer les produits
            if (data.products) {
                data.products.forEach(product => {
                    window.produit.createProduct(product);
                });
            }
            
            // Importer les ventes
            if (data.sales) {
                data.sales.forEach(sale => {
                    window.vente.createSale(sale);
                });
            }
            
            // Importer les utilisateurs
            if (data.users) {
                data.users.forEach(user => {
                    window.userManagement.createUser(user.username, user.password, user.role);
                });
            }
            
            // Importer les factures
            if (data.invoices) {
                data.invoices.forEach(invoice => {
                    window.facture.createInvoice(invoice);
                });
            }
            
            // Importer les mouvements de stock
            if (data.stockMovements) {
                data.stockMovements.forEach(movement => {
                    window.stockMovements.createStockMovement(movement);
                });
            }
            
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.importExport = {
    exportDataToJSON,
    importDataFromJSON,
    exportProductsToCSV,
    importProductsFromCSV,
    exportSalesToCSV,
    importSalesFromCSV,
    exportUsersToCSV,
    importUsersFromCSV,
    exportInvoicesToCSV,
    importInvoicesFromCSV,
    exportStockMovementsToCSV,
    importStockMovementsFromCSV,
    exportAllData,
    importAllData
};
