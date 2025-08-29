<?php

    // Importa il file per la gestione del CORS e specifica il tipo di risposta HTTP in formato JSON con codifica UTF-8
    require 'cors.php'; 
    header("Content-Type: application/json; charset=UTF-8"); 

    // Inclusione delle classi necessarie per la gestione del database, delle serie TV e delle sessioni
    include_once '../dataMgr/Database.php'; 
    include_once '../dataMgr/SerieTV.php'; 
    include_once '../dataMgr/SessionManager.php'; 

    $sessionManager = new SessionManager(); // Istanzia un oggetto della classe SessionManager
    $sessionManager->verifyAdminSession(); // Usa il metodo verifyAdminSession sull'oggetto $sessionManager per verificare che l'utente sia un amministratore

    // Istanzia un oggetto della classe Database e stabilisce una connessione al database
    $databaseHandler = new Database();
    $databaseConnection = $databaseHandler->getConnection(); 

    // Istanzia un oggetto della classe SerieTV per gestire le operazioni sulle serie TV e passa la connessione al database come parametro
    $serieTVHandler = new SerieTV($databaseConnection);

    // Verifica se l'ID della serie TV da cancellare è passato come parametro nella richiesta HTTP GET
    if (isset($_GET['id'])) {
        $serieTVHandler->setId($_GET['id']); // Se l'ID è specificato, lo assegna alla proprietà ID dell'oggetto SerieTV
    } else {
        // Se l'ID non è specificato, restituisce un messaggio di errore
        http_response_code(400); // Codice di risposta HTTP 400: Richiesta errata
        echo json_encode(array(
            "message" => "Specificare l'id della serie da cancellare." // Messaggio JSON passato come risposta al client in caso di errore
        ));
        die(); // Interrompe l'esecuzione dello script 
    }

    // Una volta che l'ID è stato assegnato, esegue la cancellazione della serie TV
    $serieTVQueryResult = $serieTVHandler->delete(); // Utilizza il metodo delete sull'oggetto SerieTVHandler per cancellare la serie TV e salva il risultato in $serieTVQueryResult

    if ($serieTVQueryResult) {
        // Risposta di successo se la cancellazione è completata
        http_response_code(200); // Codice di risposta HTTP 200: Successo
        echo json_encode(array(
            "message" => "Serie TV cancellata con successo." // Messaggio di conferma
        ));
    } else {
        // Risposta di errore se la cancellazione fallisce
        http_response_code(503); // Codice di risposta HTTP 503: Servizio non disponibile
        echo json_encode(array(
            "message" => "Impossibile cancellare la serie TV." // Messaggio di errore
        ));
    }

?>