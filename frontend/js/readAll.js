$(document).ready(function() { 
    // Quando il documento è pronto
    $(document).on('click', '#back-to-series', function(e) { // Al click del pulsante 'back-to-series' esegue la funzione; usato per il pulsante "Torna all'elenco"
        e.preventDefault(); // Previene il comportamento predefinito del pulsante, ovvero ricaricare la pagina
        showSeriesList(); // Richiama la funzione per mostrare l'elenco delle serie TV
    });
});

// Funzione per caricare e visualizzare l'elenco delle serie TV
function showSeriesList() { 
    // Effettua una richiesta per ottenere i dati di tutte le serie TV
    sendRequest("readAll.php", data => { 
        // Effettua una seconda richiesta per ottenere informazioni sulla sessione utente
        sendRequest("sessionInfo.php", sessionData => { 
            // Determina se l'utente corrente è un amministratore e memorizza il risultato in una variabile booleana
            const isAdmin = sessionData.userType === "amministratore"; 
            
            // Genera il codice HTML per l'header della pagina e richiama la funzione per il pulsante di logout
            let header_html = `
                <!-- Contenitore header fisso in alto -->
                <!-- top-header classe custom per posizionamento e stile -->
                <div class="top-header">
                    <!-- Inserisce il bottone di logout usando la funzione logoutButton() -->
                    ${logoutButton()} 
                </div>`; 
            
            // Inizia la costruzione del contenuto principale della pagina costruendo sia il contenitore principale dove ci sarà la tabella delle serie TV, 
            // sia di quello appena sotto al titolo della pagina che contiene la casella di ricerca ed eventuali pulsanti 
            let read_series_html = `
                <!-- Contenitore principale -->
                <!-- main-content classe custom per stili del contenuto -->
                <div class="main-content">
                    <!-- Contenitore per la barra delle azioni (ricerca e bottoni) -->
                    <!-- actions-container classe custom per layout flessibile -->
                    <div class="actions-container">
                        <!-- Contenitore per il form di ricerca -->
                        <div>
                            <!-- Inserisce il form di ricerca usando la funzione searchForm() -->
                            ${searchForm()} 
                        </div> 
                        <!-- Contenitore per eventuali bottoni come quello per aggiungere nuove serie visibile solo dall'amministratore -->
                        <div>`;

            // Se l'utente è un amministratore, aggiunge il pulsante per creare una nuova serie TV al contenitore sotto il titolo della pagina, ovvero quello con la casella di ricerca
            if (isAdmin) {
                read_series_html += createButton(); 
            }

            // Chiude il contenitore sotto il titolo della pagina
            read_series_html += `
                        </div>
                    </div>`;

            read_series_html += seriesTable(data.seriesList, isAdmin); // Usa la funzione seriesTable per generare la tabella delle serie TV a cui passa come parametri la lista delle serie TV e un booleano che indica se l'utente è amministratore
            read_series_html += `</div>`; // Chiude il contenitore principale della pagina

            if (!$('.top-header').length) { // Controlla se il contenitore dell'header è già presente nella pagina
                $('body').prepend(header_html); // Se non è presente, lo inserisce all'interno del body della pagina
            }

            $("#page-content").html(read_series_html); // Inserisce il codice HTML generato all'interno del contenitore con ID 'page-content'

            changePageTitle("Serie TV - Elenco"); // Funzione per cambiare il titolo della pagina
        });
    });
}





