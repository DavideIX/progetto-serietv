<?php

    require 'cors.php'; // Importa il file per la gestione del CORS
    header("Access-Control-Allow-Methods: POST"); // Consente solo richieste HTTP POST
    header("Content-Type: application/json; charset=UTF-8"); // Specifica che la risposta sarà in formato JSON con codifica UTF-8

    // Inclusione delle classi necessarie per la gestione del database, delle serie TV e delle sessioni
    include_once '../dataMgr/Database.php'; 
    include_once '../dataMgr/SerieTV.php'; 
    include_once '../dataMgr/SessionManager.php'; 

    $sessionManager = new SessionManager(); // Istanzia un oggetto della classe SessionManager
    $sessionManager->verifyAdminSession(); // Assicura che solo gli amministratori possano accedere a questa funzionalità utilizzando il metodo verifyAdminSession sull'oggetto $sessionManager

    // Istanzia un oggetto della classe Database e stabilisce una connessione al database
    $databaseHandler = new Database();
    $databaseConnection = $databaseHandler->getConnection(); 

    // Istanzia un oggetto della classe SerieTV per gestire le operazioni sulle serie TV e passa la connessione al database come parametro
    $serieTVHandler = new SerieTV($databaseConnection);

    // Lettura dei dati inviati tramite il corpo della richiesta HTTP
    $data = json_decode(file_get_contents("php://input")); // Decodifica il JSON in un oggetto PHP

    // Verifica che tutti i campi obbligatori siano presenti e non vuoti
    if (!empty($data->titolo) &&
        !empty($data->anno) &&
        !empty($data->descrizione) &&
        !empty($data->voto) &&
        !empty($data->recensione) &&
        !empty($data->genere_id)) {

            // Imposta i valori per la nuova serie TV utilizzando i metodi setter 
            $serieTVHandler->setTitolo($data->titolo); 
            $serieTVHandler->setAnno($data->anno); 
            $serieTVHandler->setDescrizione($data->descrizione); 
            $serieTVHandler->setVoto($data->voto); 
            $serieTVHandler->setRecensione($data->recensione); 
            $serieTVHandler->setGenere_id($data->genere_id); 

            // Tenta di creare una nuova serie TV
            if ($serieTVHandler->create()) {

                http_response_code(201); // Codice di risposta HTTP 201: Risorsa creata
                echo json_encode(array("message" => "Nuova serie TV creata con successo.")); // Messaggio di conferma

            } else { // Se la creazione della serie TV fallisce

                http_response_code(503); // Codice di risposta HTTP 503: Servizio non disponibile
                echo json_encode(array("message" => "Impossibile creare la serie TV.")); // Messaggio di errore se la creazione fallisce
            }

    } else {

        // Se i campi obbligatori sono vuoti o mancanti
        http_response_code(400); // Codice di risposta HTTP 400: Richiesta errata
        echo json_encode(array("message" => "Impossibile creare la serie TV. Dati incompleti.")); // Messaggio di errore per campi mancanti

    }

?>