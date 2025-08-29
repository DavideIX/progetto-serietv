// ATTENZIONE: Modifica BASEURL in base al percorso del backend nel tuo ambiente.
// Esempio per sviluppo locale con XAMPP: "http://localhost/progetto-serietv/backend/api/"
// Se cambi cartella, aggiorna di conseguenza.
const BASEURL = "http://localhost/progetto-serietv/backend/api/"; // URL base per le richieste API

// Funzione universale per l'invio di richieste HTTP; accetta l'API da chiamare, una funzione di callback per gestire la risposta, il metodo HTTP da utilizzare, il corpo della richiesta e una funzione di callback per gestire eventuali errori
function sendRequest(api, successCallback, method = "GET", body = null, errorCallback = null) {
    // Costruisce l'URL completo per la richiesta concatenando l'URL base con l'API specificata e attraverso fetch invia la richiesta al server
    fetch(BASEURL + api, { 
        method, // Specifica il metodo HTTP da utilizzare per la richiesta; GET è il metodo predefinito
        credentials: "include", // Specifica di includere le credenziali nella richiesta
        headers: body ? { "Content-Type": "application/json" } : undefined, // Specifica l'intestazione 'Content-Type' per il corpo della richiesta se è presente un corpo; con application/json si indica che il corpo della richiesta è in formato JSON
        body // Corpo della richiesta; se è presente, contiene i dati serializzati in formato JSON
    })
    .then(response => { // Gestisce la risposta alla richiesta
        if (!response.ok) { // Se la risposta ha un codice di stato HTTP diverso da 200
            if (errorCallback) { // Se è stata specificata una funzione di callback per gestire gli errori
                errorCallback({ status: response.status, message: response.statusText }); // Chiama la funzione di callback per gestire l'errore passando lo stato e il messaggio dell'errore
            }
            throw new Error(`HTTP error: ${response.status}`); // Anche se non è stata specificata una funzione di callback, lancia un errore con il codice di stato HTTP
        }
        return response.json(); // Restituisce i dati della risposta in formato JSON se la richiesta ha avuto successo
    })
    .then(data => successCallback(data)) // Chiama la funzione di callback per gestire la risposta passando i dati della risposta
    .catch(error => { // Gestisce eventuali errori generici 
        if (!errorCallback) { // Se non è stata specificata una funzione di callback per gestire gli errori
            console.error("Errore nella richiesta:", error.message); // Stampa un messaggio di errore nella console
        }
    });
}

// Funzione per mostrare la casella di ricerca delle serie TV
function searchForm() {
    const searchForm = `
        <!-- Form di ricerca con ID univoco per gestione eventi -->
        <!-- action='#' previene il comportamento di default del form -->
        <form id='search-form' action='#' method='post'>
            <!-- Contenitore per il gruppo input + bottone -->
            <!-- input-group raggruppa input e bottone -->
            <!-- pull-left allinea a sinistra -->
            <!-- w-25 imposta la larghezza al 25% del contenitore -->
            <div class='input-group pull-left w-25'>
                <!-- Campo di input per la ricerca -->
                <!-- name='keywords' identifica il campo per il backend -->
                <input type='text' name='keywords' class='form-control search-keywords' 
                       placeholder='Cerca serie TV...' />
                <!-- Contenitore per il bottone -->
                <!-- input-group-btn raggruppa bottoni nell'input group -->
                <span class='input-group-btn'>
                    <!-- Bottone di ricerca con icona -->
                    <!-- btn-default applica lo stile base di Bootstrap -->
                    <button type='submit' class='btn btn-default' type='button'>
                        <!-- Icona di ricerca da Font Awesome -->
                        <span class='fa fa-search'></span>
                    </button>
                </span>
            </div>
        </form>`;
    return searchForm;
}

// Funzione per mostrare il pulsante di creazione di una nuova serie TV
function createButton() {
    const createButton = `
        <!-- Contenitore del bottone con stili e ID -->
        <!-- btn-primary applica il colore primario di Bootstrap -->
        <!-- btn-sm rende il bottone più piccolo -->
        <!-- pull-right allinea a destra -->
        <!-- mb-3 aggiunge un margine bottom -->
        <!-- ms-2 aggiunge un margine sinistro -->
        <div id='add-series' class='btn btn-primary btn-sm pull-right mb-3 ms-2'>
            <!-- Icona "plus" da Font Awesome -->
            <span class='fa fa-plus'></span> 
            Inserisci nuova serie
        </div>`;
    return createButton;
}

// Funzione per mostrare il pulsante di ritorno all'elenco delle serie TV
function backButton() {
    const backButton = `
        <!-- Contenitore del bottone con stili e ID -->
        <!-- Stili simili al createButton ma senza margine sinistro -->
        <div id='back-to-series' class='btn btn-primary btn-sm pull-right mb-3'>
            <!-- Icona "arrow-left" da Font Awesome -->
            <span class='fa fa-arrow-left'></span> 
            Torna all'elenco
        </div>`;
    return backButton;
}

// Funzione per mostrare il pulsante di logout
function logoutButton() {
    const logoutButton = `
        <!-- Contenitore del bottone con stili e ID -->
        <!-- btn-danger usa il colore rosso di Bootstrap -->
        <!-- logout-button classe custom per stili specifici -->
        <div id='logout' class='btn btn-danger logout-button'>
            <!-- Icona "sign-out" da Font Awesome -->
            <span class='fa fa-sign-out'></span> 
            Logout
        </div>`;
    return logoutButton;
}

// Funzione per mostrare la tabella delle serie TV
function seriesTable(seriesList, isAdmin) { // Come parametri riceve la lista delle serie TV e un booleano che indica se l'utente è amministratore
    if (!seriesList || seriesList.length === 0) { // Se la lista delle serie TV è vuota o non è definita
        return '<p>Nessuna serie TV trovata.</p>'; // Restituisce un messaggio che indica che non sono state trovate serie TV
    }

    // Se la lista delle serie TV non è vuota, costruisce la tabella HTML per visualizzare le serie TV
    let table = `
        <!-- Tabella principale con stili Bootstrap -->
        <!-- table-bordered aggiunge i bordi -->
        <!-- table-hover aggiunge l'effetto hover sulle righe -->
        <table class='table table-bordered table-hover'>
            <!-- Intestazione della tabella -->
            <thead>
                <tr>
                    <!-- Intestazioni delle colonne con larghezze fisse -->
                    <!-- w-25 imposta ogni colonna al 25% della larghezza -->
                    <th class='w-25'>Titolo</th>
                    <th class='w-25'>Anno</th>
                    <th class='w-25'>Genere</th>
                    <!-- text-center centra il contenuto -->
                    <th class='w-25 text-center'>Azioni</th>
                </tr>
            </thead>
            <tbody>`;

    // Per ogni serie TV nella lista, aggiunge una riga alla tabella con i dettagli della serie TV e i pulsanti di azione
    $.each(seriesList, function(key, serie) { 
        table += `<tr>
            <td>` + serie.titolo + `</td>
            <td>` + serie.anno + `</td>
            <td>` + serie.genereNome + `</td>
            <!-- Colonna per i pulsanti di azione -->
            <td class='text-center'>
                <div class='btn-group btn-group-sm'>
                <!-- Pulstante per visualizzare i dettagli -->
                <button class='btn btn-primary me-2 read-one-button' data-id='` + serie.id + `'>
                    <span class='fa fa-eye'></span> <small>Dettagli</small>
                </button>`;

        // Se l'utente è un amministratore, aggiunge i pulsanti per modificare e cancellare la serie TV
        if (isAdmin) {
            table += `
                    <!-- Bottone modifica (solo per admin) -->
                    <button class='btn btn-info me-2 update-button' data-id='` + serie.id + `'>
                        <!-- Icona "edit" da Font Awesome -->
                        <span class='fa fa-edit'></span><small>Modifica</small>
                    </button>
                    <!-- Bottone cancella (solo per admin) -->
                    <button class='btn btn-danger delete-button' data-id='` + serie.id + `'>
                        <!-- Icona "trash" da Font Awesome -->
                        <span class='fa fa-trash'></span><small>Cancella</small>
                    </button>`;
        }

        // Chiude il contenitore dei pulsanti di azione
        table += `
                </div>
            </td>
        </tr>`;
    });

    // Chiude la tabella HTML
    table += `</tbody></table>`;
    return table; // Restituisce la tabella HTML
}

// Funzione per aggiornare il titolo della pagina
function changePageTitle(page_title) { // Come parametro riceve il titolo della pagina
    $('#page-title').text(page_title); // Seleziona l'elemento con ID 'page-title' e imposta il testo con il titolo della pagina
    document.title = page_title; // Aggiorna anche il titolo della scheda del browser
}

// Funzione per verificare lo stato della sessione utente
function checkSession() {
    sendRequest("sessionInfo.php", function(data) { // Effettua una richiesta per ottenere informazioni sulla sessione utente
        if (data.loggedIn) { // Se l'utente è autenticato e quindi loggedIn è true
            showSeriesList(); // Mostra l'elenco delle serie TV
        } else { // Se l'utente non è autenticato e quindi loggedIn è false
            showLoginForm(); // Mostra il modulo di login
        }
    });
}




