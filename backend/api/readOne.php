<?php

    require 'cors.php'; // Importa il file per la gestione del CORS
    header("Access-Control-Allow-Methods: GET"); // Consente solo richieste HTTP GET
    header("Content-Type: application/json; charset=UTF-8"); // Specifica che la risposta sarà in formato JSON con codifica UTF-8

    // Inclusione delle classi necessarie per la gestione del database, delle serie TV e delle sessioni
    include_once '../dataMgr/Database.php'; 
    include_once '../dataMgr/SerieTV.php'; 
    include_once '../dataMgr/SessionManager.php'; 

    $sessionManager = new SessionManager(); // Istanzia un oggetto della classe SessionManager
    $sessionManager->verifySession(); // Usa il metodo verifySession sull'oggetto $sessionManager per verificare che l'utente abbia una sessione valida

    // Istanzia un oggetto della classe Database e stabilisce una connessione al database
    $databaseHandler = new Database();
    $databaseConnection = $databaseHandler->getConnection(); 

    // Istanzia un oggetto della classe SerieTV per gestire le operazioni sulle serie TV e passa la connessione al database come parametro
    $serieTVHandler = new SerieTV($databaseConnection);

    // Verifica che sia stato fornito un ID come parametro GET
    if (isset($_GET['id'])) {
        // Se l'ID è specificato, lo assegna alla proprietà ID dell'oggetto SerieTV
        $serieTVHandler->setId($_GET['id']); 
    } else { // Se l'ID non è specificato, restituisce un messaggio di errore
        http_response_code(400); // Codice di risposta HTTP 400: Richiesta errata
        echo json_encode(array("message" => "Specificare l'id della serie che si vuole leggere.")); // Messaggio di errore informativo
        die(); // Interrompe l'esecuzione dello script

    }

    // Se l'ID è stato fornito, esegue la lettura della serie TV
    $serieTVQueryResult = $serieTVHandler->readOne(); // Utilizza il metodo readOne sull'oggetto SerieTVHandler per ottenere i dettagli della serie TV e salva il risultato in $serieTVQueryResult

    if ($serieTVQueryResult) { // Se la serie TV è stata trovata
        $serieTVDetails = array( // Crea un array associativo con i dettagli della serie TV e assegna i valori ottenuti dai metodi getter dell'oggetto SerieTVHandler a ciascuna chiave dell'array
            "id" => $serieTVHandler->getId(), 
            "titolo" => $serieTVHandler->getTitolo(), 
            "anno" => $serieTVHandler->getAnno(), 
            "descrizione" => $serieTVHandler->getDescrizione(),
            "voto" => $serieTVHandler->getVoto(), 
            "recensione" => $serieTVHandler->getRecensione(), 
            "genereId" => $serieTVHandler->getGenere_id(),
            "genereNome" => $serieTVHandler->getGenere_nome()
        );

        http_response_code(200); // Codice di risposta HTTP 200: Successo
        echo json_encode($serieTVDetails); // Restituisce i dettagli della serie TV in formato JSON

    } else { // Se la serie TV non è stata trovata

        http_response_code(404); // Codice di risposta HTTP 404: Risorsa non trovata
        echo json_encode(array("message" => "Serie non trovata.")); // Messaggio di errore se la serie non è trovata

    }

?>