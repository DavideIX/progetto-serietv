<?php

    // Importa il file per la gestione del CORS e specifica il tipo di risposta HTTP in formato JSON con codifica UTF-8
    require 'cors.php';
    header("Content-Type: application/json; charset=UTF-8"); 

    // Inclusione delle classi necessarie per la gestione del database, delle serie TV e delle sessioni
    include_once '../dataMgr/Database.php'; 
    include_once '../dataMgr/SerieTV.php'; 
    include_once '../dataMgr/SessionManager.php'; 

    // Istanzia un oggetto della classe SessionManager e verifica che l'utente abbia una sessione valida
    $sessionManager = new SessionManager();
    $sessionManager->verifySession(); 

    // Istanzia un oggetto della classe Database e stabilisce una connessione al database
    $databaseHandler = new Database();
    $databaseConnection = $databaseHandler->getConnection(); 

    // Istanzia un oggetto della classe SerieTV per gestire le operazioni sulle serie TV e passa la connessione al database come parametro
    $serieTVHandler = new SerieTV($databaseConnection); 

    // Controlla se ci sono parametri di ricerca nella richiesta HTTP GET
    if (isset($_GET['keywords'])) { 
        $searchKeywords = $_GET['keywords']; // Se ci sono, assegna le parole chiave alla variabile $searchKeywords
    } else {
        $searchKeywords = ""; // Se non ci sono, assegna una stringa vuota alla variabile $searchKeywords
    }

    // Esegue la ricerca delle serie TV nel database secondo le parole chiave specificate e salva i risultati nella variabile $serieTVQueryResult
    $serieTVQueryResult = $serieTVHandler->search($searchKeywords); 

    if ($serieTVQueryResult) { // Se ci sono risultati

        $response = array(); // Inizializza un array per memorizzare la risposta JSON
        $response["seriesList"] = array(); // Aggiunge una chiave "seriesList" all'array $response alla quale assegna un altro array che conterrà i dettagli delle serie TV

        // Itera sui risultati della query e li aggiunge alla risposta
        foreach ($serieTVQueryResult as $serieTVRecord) { // Per ogni record trovato nella query lo salva nella variabile $serieTVRecord
            $serieTVDetails = array( // Crea un array associativo con i dettagli della serie TV
                "id" => $serieTVRecord['id'], // Associa i valori delle colonne del record salvato in $serieTVRecord alle chiavi dell'array $serieTVDetails
                "titolo" => $serieTVRecord['titolo'], 
                "anno" => $serieTVRecord['anno'], 
                "descrizione" => $serieTVRecord['descrizione'], 
                "voto" => $serieTVRecord['voto'], 
                "recensione" => $serieTVRecord['recensione'], 
                "genereId" => $serieTVRecord['id_gen'], 
                "genereNome" => $serieTVRecord['nomegen'] 
            );

            array_push($response["seriesList"], $serieTVDetails); // Ad ogni iterazione, aggiunge l'array $serieTVDetails, che contiene i dettagli di ogni serie TV trovata, all'array $response["seriesList"]
        }

        http_response_code(200); // Codice di risposta HTTP 200: Successo
        echo json_encode($response); // Converte l'array PHP in JSON e lo restituisce al client come risposta

    } else {

        http_response_code(404); // Codice di risposta HTTP 404: Nessun risultato trovato
        echo json_encode(array("message" => "Nessuna serie trovata. Riprova")); // Array che contiene un messaggio di errore convertito in formato JSON e restituito come risposta

    }
    
?>