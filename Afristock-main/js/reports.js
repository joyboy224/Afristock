// Gestion des rapports

// Générer un rapport de ventes
function generateSalesReport(startDate, endDate) {
    // Filtrer les ventes par date
    const sales = window.vente.filterSalesByDate(startDate, endDate);
    
    // Calculer les statistiques
    const totalSales = window.vente.getTotalSalesForPeriod(startDate, endDate);
    const totalTransactions = sales.length;
    const averageTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0;
    
    // Obtenir les produits les plus vendus
    const productSales = {};
    sales.forEach(sale => {
        sale.items.forEach(item => {
            if (productSales[item.productId]) {
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].total += item.price * item.quantity;
            } else {
                productSales[item.productId] = {
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                };
            }
        });
    });
    
    // Trier les produits par quantité vendue
    const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10);
    
    // Créer le rapport
    const report = {
        title: 'Rapport de ventes',
        period: {
            start: startDate,
            end: endDate
        },
        summary: {
            totalSales: totalSales,
            totalTransactions: totalTransactions,
            averageTransactionValue: averageTransactionValue
        },
        topProducts: topProducts,
        sales: sales
    };
    
    return report;
}

// Générer un rapport de stock
function generateStockReport() {
    // Obtenir tous les produits
    const products = window.produit.getAllProducts();
    
    // Calculer les statistiques
    const totalProducts = products.length;
    const totalValue = products.reduce((total, product) => total + (product.price * product.quantity), 0);
    
    // Obtenir les produits en rupture de stock
    const outOfStockProducts = window.produit.getOutOfStockProducts();
    
    // Obtenir les produits à faible stock
    const lowStockProducts = window.produit.getLowStockProducts();
    
    // Créer le rapport
    const report = {
        title: 'Rapport de stock',
        summary: {
            totalProducts: totalProducts,
            totalValue: totalValue,
            outOfStockCount: outOfStockProducts.length,
            lowStockCount: lowStockProducts.length
        },
        outOfStockProducts: outOfStockProducts,
        lowStockProducts: lowStockProducts,
        products: products
    };
    
    return report;
}

// Générer un rapport de factures
function generateInvoicesReport(startDate, endDate) {
    // Filtrer les factures par date
    const invoices = window.facture.filterInvoicesByDate(startDate, endDate);
    
    // Calculer les statistiques
    const totalInvoices = window.facture.getTotalInvoicesForPeriod(startDate, endDate);
    const paidInvoices = window.facture.filterInvoicesByStatus('paid');
    const pendingInvoices = window.facture.filterInvoicesByStatus('pending');
    const cancelledInvoices = window.facture.filterInvoicesByStatus('cancelled');
    
    const paidTotal = window.facture.getTotalInvoicesByStatus('paid');
    const pendingTotal = window.facture.getTotalInvoicesByStatus('pending');
    const cancelledTotal = window.facture.getTotalInvoicesByStatus('cancelled');
    
    // Créer le rapport
    const report = {
        title: 'Rapport de factures',
        period: {
            start: startDate,
            end: endDate
        },
        summary: {
            totalInvoices: invoices.length,
            totalValue: totalInvoices,
            paidInvoices: paidInvoices.length,
            pendingInvoices: pendingInvoices.length,
            cancelledInvoices: cancelledInvoices.length,
            paidTotal: paidTotal,
            pendingTotal: pendingTotal,
            cancelledTotal: cancelledTotal
        },
        invoices: invoices
    };
    
    return report;
}

// Générer un rapport financier
function generateFinancialReport(startDate, endDate) {
    // Générer les rapports de ventes et de factures
    const salesReport = generateSalesReport(startDate, endDate);
    const invoicesReport = generateInvoicesReport(startDate, endDate);
    
    // Calculer les statistiques financières
    const totalRevenue = salesReport.summary.totalSales;
    const totalInvoiced = invoicesReport.summary.totalValue;
    const totalPaid = invoicesReport.summary.paidTotal;
    const totalPending = invoicesReport.summary.pendingTotal;
    const totalCancelled = invoicesReport.summary.cancelledTotal;
    
    // Créer le rapport
    const report = {
        title: 'Rapport financier',
        period: {
            start: startDate,
            end: endDate
        },
        summary: {
            totalRevenue: totalRevenue,
            totalInvoiced: totalInvoiced,
            totalPaid: totalPaid,
            totalPending: totalPending,
            totalCancelled: totalCancelled
        },
        salesReport: salesReport,
        invoicesReport: invoicesReport
    };
    
    return report;
}

// Exporter un rapport au format CSV
function exportReportToCSV(report, filename) {
    // Convertir le rapport en CSV
    let csv = '';
    
    // Ajouter le titre
    csv += `Rapport: ${report.title}\n`;
    csv += `Période: ${report.period ? report.period.start + ' - ' + report.period.end : 'Toute la période'}\n\n`;
    
    // Ajouter le résumé
    csv += 'Résumé:\n';
    for (const [key, value] of Object.entries(report.summary)) {
        csv += `${key}: ${value}\n`;
    }
    
    // Ajouter les données détaillées si elles existent
    if (report.sales) {
        csv += '\nVentes:\n';
        csv += 'ID,Client,Total,Date,Statut\n';
        report.sales.forEach(sale => {
            csv += `${sale.id},${sale.customerName},${sale.total},${sale.date},${sale.status}\n`;
        });
    }
    
    if (report.products) {
        csv += '\nProduits:\n';
        csv += 'ID,Nom,Quantité,Prix,Valeur totale\n';
        report.products.forEach(product => {
            csv += `${product.id},${product.name},${product.quantity},${product.price},${product.price * product.quantity}\n`;
        });
    }
    
    if (report.invoices) {
        csv += '\nFactures:\n';
        csv += 'ID,Client,Total,Date,Statut\n';
        report.invoices.forEach(invoice => {
            csv += `${invoice.id},${invoice.customerName},${invoice.total},${invoice.date},${invoice.status}\n`;
        });
    }
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'rapport.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    console.log(`Rapport exporté: ${filename || 'rapport.csv'}`);
}

// Exporter un rapport au format PDF
function exportReportToPDF(report, filename) {
    // Pour cette simulation, nous allons simplement ouvrir une fenêtre avec le contenu du rapport
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme jsPDF
    
    // Créer le contenu HTML du rapport
    let html = `
        <html>
        <head>
            <title>${report.title}</title>
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { text-align: center; }
                .report-header { text-align: center; margin-bottom: 20px; }
                .report-summary { margin-bottom: 20px; }
                .report-summary table { width: 100%; border-collapse: collapse; }
                .report-summary table th, .report-summary table td { border: 1px solid #000; padding: 8px; text-align: left; }
                .report-details { margin-top: 20px; }
                .report-details table { width: 100%; border-collapse: collapse; }
                .report-details table th, .report-details table td { border: 1px solid #000; padding: 8px; text-align: left; }
            </style>
        </head>
        <body>
            <div class="report-header">
                <h1>${report.title}</h1>
                ${report.period ? `<p>Période: ${report.period.start} - ${report.period.end}</p>` : ''}
            </div>
            
            <div class="report-summary">
                <h2>Résumé</h2>
                <table>
                    <tbody>
    `;
    
    for (const [key, value] of Object.entries(report.summary)) {
        html += `<tr><td>${key}</td><td>${value}</td></tr>`;
    }
    
    html += `
                    </tbody>
                </table>
            </div>
    `;
    
    // Ajouter les détails des ventes si elles existent
    if (report.sales) {
        html += `
            <div class="report-details">
                <h2>Ventes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        report.sales.forEach(sale => {
            html += `
                <tr>
                    <td>${sale.id}</td>
                    <td>${sale.customerName}</td>
                    <td>${sale.total}</td>
                    <td>${sale.date}</td>
                    <td>${sale.status}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Ajouter les détails des produits si ils existent
    if (report.products) {
        html += `
            <div class="report-details">
                <h2>Produits</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                            <th>Valeur totale</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        report.products.forEach(product => {
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                    <td>${product.price * product.quantity}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Ajouter les détails des factures si elles existent
    if (report.invoices) {
        html += `
            <div class="report-details">
                <h2>Factures</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        report.invoices.forEach(invoice => {
            html += `
                <tr>
                    <td>${invoice.id}</td>
                    <td>${invoice.customerName}</td>
                    <td>${invoice.total}</td>
                    <td>${invoice.date}</td>
                    <td>${invoice.status}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    html += `
        </body>
        </html>
    `;
    
    // Ouvrir une nouvelle fenêtre avec le contenu du rapport
    const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(html);
    pdfWindow.document.close();
    
    console.log(`Rapport exporté: ${filename || 'rapport.pdf'}`);
}

// Afficher un rapport dans l'interface utilisateur
function displayReport(report, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        throw new Error('Conteneur non trouvé');
    }
    
    // Créer le contenu HTML du rapport
    let html = `
        <div class="report">
            <h2>${report.title}</h2>
            ${report.period ? `<p>Période: ${report.period.start} - ${report.period.end}</p>` : ''}
            
            <div class="report-summary">
                <h3>Résumé</h3>
                <ul>
    `;
    
    for (const [key, value] of Object.entries(report.summary)) {
        html += `<li><strong>${key}:</strong> ${value}</li>`;
    }
    
    html += `
                </ul>
            </div>
    `;
    
    // Ajouter les détails des ventes si elles existent
    if (report.sales) {
        html += `
            <div class="report-details">
                <h3>Ventes</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        report.sales.forEach(sale => {
            html += `
                <tr>
                    <td>${sale.id}</td>
                    <td>${sale.customerName}</td>
                    <td>${sale.total}</td>
                    <td>${sale.date}</td>
                    <td>${sale.status}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Ajouter les détails des produits si ils existent
    if (report.products) {
        html += `
            <div class="report-details">
                <h3>Produits</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Quantité</th>
                            <th>Prix</th>
                            <th>Valeur totale</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        report.products.forEach(product => {
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>${product.price}</td>
                    <td>${product.price * product.quantity}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    // Ajouter les détails des factures si elles existent
    if (report.invoices) {
        html += `
            <div class="report-details">
                <h3>Factures</h3>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Client</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        report.invoices.forEach(invoice => {
            html += `
                <tr>
                    <td>${invoice.id}</td>
                    <td>${invoice.customerName}</td>
                    <td>${invoice.total}</td>
                    <td>${invoice.date}</td>
                    <td>${invoice.status}</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }
    
    html += `
        </div>
    `;
    
    // Ajouter le contenu au conteneur
    container.innerHTML = html;
    
    console.log('Rapport affiché');
}

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.reports = {
    generateSalesReport,
    generateStockReport,
    generateInvoicesReport,
    generateFinancialReport,
    exportReportToCSV,
    exportReportToPDF,
    displayReport
};
