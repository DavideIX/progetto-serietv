$(document).ready(function() {
    $(document).on('submit', '#search-form', function(e) { // Al click del pulsante 'search-form' esegue la funzione; usato per cercare le serie TV
        e.preventDefault(); // Previene il comportamento predefinito del form

        // Crea una costante 'keywords' che contiene i termini di ricerca inseriti dall'utente nel campo di input del modulo di ricerca
        const keywords = $(this).find("input[name='keywords']").val(); // Atraverso il metodo 'find' trova l'elemento input con attributo 'name' uguale a 'keywords' e ne prende il valore
         
        // Effettua una richiesta al server per cercare le serie TV che corrispondono ai termini di ricerca; encodeURIcomponent è una funzione JavaScript che codifica un componente di URI
        sendRequest(`search.php?keywords=${encodeURIComponent(keywords)}`, data => { 
            // Effettua una seconda richiesta per ottenere informazioni sull'utente e verificare se è un amministratore
            sendRequest("sessionInfo.php", sessionData => { 
                // Determina se l'utente è un amministratore per mostrare opzioni aggiuntive e memorizza il risultato in una variabile booleana
                const isAdmin = sessionData.userType === "amministratore"; 

                // Genera il contenitore che si trova sopra i risultati della ricerca che contiene la casella di ricerca 
                let search_series_html = `
                    <!-- Contenitore principale per la barra delle azioni -->
                    <!-- justify-content-between distribuisce gli elementi ai lati opposti -->
                    <!-- align-items-center allinea verticalmente al centro -->
                    <!-- mb-3 aggiunge un margine inferiore -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <!-- Contenitore per il form di ricerca -->
                        <div>
                            <!-- Inserisce il form di ricerca usando la funzione searchForm() -->
                            <!-- Il form viene pre-popolato con la ricerca precedente -->
                            ${searchForm()} 
                        </div>
                        <!-- Contenitore per i bottoni delle azioni -->
                        <!-- gap-2 aggiunge spazio tra gli elementi -->
                        <div class="d-flex gap-2">`;
                
                // Se l'utente è un amministratore, aggiunge il pulsante per creare una nuova serie TV al contenitore sopra i risultati della ricerca
                if (isAdmin) {
                    search_series_html += createButton(); 
                }

                // Aggiunge il pulsante "Torna all'elenco" al contenitore sopra i risultati della ricerca sia per gli utenti amministratori che per gli utenti normali
                search_series_html += backButton(); 
                // Chiude il contenitore sopra i risultati della ricerca
                search_series_html += `
                        </div>
                    </div>`;

                if (data.seriesList && data.seriesList.length > 0) { // Controlla se sono state trovate serie TV corrispondenti ai termini di ricerca
                    // Se ci sono serie TV trovate, genera la tabella con i risultati della ricerca
                    search_series_html += seriesTable(data.seriesList, isAdmin); // Usa la funzione seriesTable per generare la tabella con i risultati della ricerca a cui passa come parametri la lista delle serie TV e un booleano che indica se l'utente è amministratore
                } else { // Se non sono state trovate serie TV corrispondenti ai termini di ricerca
                    // Genera l'HTML per mostrare un messaggio informativo
                    search_series_html += `
                        <!-- Messaggio di nessun risultato -->
                        <!-- alert crea un box di avviso -->
                        <!-- alert-info usa il colore info di Bootstrap -->
                        <div class="alert alert-info">
                            <!-- Mostra i termini di ricerca in grassetto -->
                            Nessuna serie TV trovata per: <b>` + keywords + `</b>
                        </div>`;
                }

                $("#page-content").html(search_series_html); // Inserisce il codice generato salvo in 'search_series_html' all'interno del contenitore con ID 'page-content'

                changePageTitle("Risultati Ricerca: " + keywords); // Funzione per cambiare il titolo della pagina
            });
        });
    });
});
