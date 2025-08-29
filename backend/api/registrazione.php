<?php

    // Importa il file per la gestione del CORS e specifica il tipo di risposta HTTP in formato JSON con codifica UTF-8
    require 'cors.php'; 
    header('Content-Type: application/json charset=UTF-8'); 

    // Inclusione delle classi necessarie per la gestione del database e degli utenti
    include_once '../dataMgr/Database.php'; 
    include_once '../dataMgr/Utenti.php'; 

    // Istanzia un oggetto della classe Database e stabilisce una connessione al database
    $database = new Database(); 
    $databaseConnection = $database->getConnection();

    // Istanzia un oggetto della classe Utenti per gestire le operazioni sugli utenti e passa la connessione al database come parametro
    $utenteHandler = new Utenti($databaseConnection);

    // Legge e decodifica i dati JSON ricevuti nel corpo della richiesta HTTP
    $data = json_decode(file_get_contents("php://input")); 

    // Verifica che i campi obbligatori siano presenti e non vuoti
    if (!empty($data->username) && !empty($data->password)) { // Se i campi username e password non sono vuoti

        // Imposta i valori degli attributi dell'oggetto Utenti con i dati ricevuti
        $utenteHandler->setUsername($data->username); // Assegna il nome utente
        $utenteHandler->setPassword($data->password); // Assegna la password

        // Poi prova a registrare l'utente
        if ($utenteHandler->Registrazione()) { // Usa il metodo Registrazione sull'oggetto Utenti per registrare l'utente e se l'operazione ha successo
            http_response_code(200); // Codice di risposta HTTP 200: Successo
            echo json_encode(array("message" => "Utente registrato con successo")); // Messaggio di successo
        } else { // Se l'operazione non ha successo perché l'username è già in uso
            http_response_code(400); // Codice di risposta HTTP 400: Richiesta errata
            echo json_encode(array("message" => "Username già in uso")); // Messaggio di errore specifico
        }
    } else { // Se i campi obbligatori sono vuoti o mancanti 
        http_response_code(400); // Codice di risposta HTTP 400: Richiesta errata
        echo json_encode(array("message" => "Impossibile registrare l'utente. Dati incompleti")); // Messaggio di errore generico
    }

?>
