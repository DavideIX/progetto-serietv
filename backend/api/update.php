<?php

    require 'cors.php'; // Importa il file per la gestione del CORS
    header("Content-Type: application/json; charset=UTF-8"); // // Specifica che la risposta sarà in formato JSON con codifica UTF-8

    // Inclusione delle classi necessarie per la gestione del database, delle serie TV e delle sessioni
    include_once '../dataMgr/Database.php'; 
    include_once '../dataMgr/SerieTV.php'; 
    include_once '../dataMgr/SessionManager.php'; 

    $sessionManager = new SessionManager(); // Istanzia un oggetto della classe SessionManager
    $sessionManager->verifyAdminSession(); // Verifica che l'utente sia un amministratore attraverso il metodo verifyAdminSession
    
    $databaseHandler = new Database(); // Istanzia un oggetto della classe Database
    $databaseConnection = $databaseHandler->getConnection(); // Utilizza il metodo getConnection per stabilire una connessione al database 
    
    // Creazione dell'oggetto SerieTV per gestire le operazioni sulle serie TV e passaggio della connessione al database come parametro
    $serieTVHandler = new SerieTV($databaseConnection);

    $data = json_decode(file_get_contents("php://input")); // Legge e decodifica i dati JSON ricevuti nel corpo della richiesta HTTP
 
    // Assegna i dati ricevuti alle rispettive proprietà della classe SerieTV
    $serieTVHandler->setId($data->id); 
    $serieTVHandler->setTitolo($data->titolo); 
    $serieTVHandler->setAnno($data->anno); 
    $serieTVHandler->setDescrizione($data->descrizione); 
    $serieTVHandler->setVoto($data->voto); 
    $serieTVHandler->setRecensione($data->recensione); 
    $serieTVHandler->setGenere_id($data->genere_id); 

    // Esegue l'aggiornamento della serie TV nel database
    if ($serieTVHandler->update()) { // Usa il metodo update per aggiornare la serie TV e verifica se l'operazione ha successo

        http_response_code(200); // Codice di risposta HTTP 200: Successo
        echo json_encode(array("message" => "Serie TV aggiornata con successo.")); // Array che contiene un messaggio di successo convertito in formato JSON e restituito come risposta
    } else { // Se l'operazione non ha successo

        http_response_code(503); // Codice di risposta HTTP 503: Servizio non disponibile
        echo json_encode(array("message" => "Impossibile aggiornare la serie TV.")); // Messaggio di errore

    }  

?>
