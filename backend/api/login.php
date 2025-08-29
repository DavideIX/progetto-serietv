<?php

    // Importa il file per la gestione del CORS e specifica il tipo di risposta HTTP in formato JSON con codifica UTF-8
    require 'cors.php';
    header('Content-Type: application/json charset=UTF-8'); 

    // Inclusione delle classi necessarie per la gestione del database, degli utenti e delle sessioni
    include_once '../dataMgr/Database.php'; 
    include_once '../dataMgr/Utenti.php'; 
    include_once '../dataMgr/SessionManager.php'; 

    $sessionManager = new SessionManager(); // Istanzia un oggetto della classe SessionManager per gestire le sessioni

    // Istanzia un oggetto della classe Database e stabilisce una connessione al database
    $databaseHandler = new Database();
    $databaseConnection = $databaseHandler->getConnection(); 

    // Istanzia un oggetto della classe Utenti per gestire le operazioni sugli utenti e passa la connessione al database come parametro
    $utenteHandler = new Utenti($databaseConnection);

    // Lettura dei dati inviati tramite il corpo della richiesta HTTP
    $data = json_decode(file_get_contents("php://input")); // Decodifica il JSON in un oggetto PHP

    // Verifica che i campi obbligatori siano presenti e non vuoti
    if (!empty($data->username) && !empty($data->password)) { // Se i campi username e password non sono vuoti

        $utenteHandler->setUsername($data->username); // Imposta il nome utente ricevuto dal client all'oggetto Utenti
        $utenteHandler->setPassword($data->password); // Imposta la password ricevuta dal client all'oggetto Utenti
    
        // Verifica se l'utente esiste nel database
        if ($utenteHandler->utenteEsiste()) {
            // Se l'utente esiste, verifica le credenziali
            if ($utenteHandler->Login()) {
                // Se il login ha successo, controlla il tipo di utente
                if ($utenteHandler->getAdmin() === "amministratore") { // Se l'utente è un amministratore
                    // Crea una sessione per un amministratore
                    $sessionManager->createSession($data->username, "amministratore"); 
                    http_response_code(200); // Codice di risposta HTTP 200: Successo
                    echo json_encode(array(
                        "message" => "Benvenuto amministratore", // Messaggio di benvenuto per l'amministratore
                        "session_info" => $sessionManager->getSessionInfo() // Informazioni sulla sessione creata prese attresso dal metodo getSessionInfo
                    ));
                } else { // Se login ha successo ma l'utente non è un amministratore
                    // Crea una sessione per un utente normale
                    $sessionManager->createSession($data->username, "utente");
                    http_response_code(200); 
                    echo json_encode(array(
                        "message" => "Login effettuato con successo", 
                        "session_info" => $sessionManager->getSessionInfo() 
                    ));
                }
            } else { // Se il login fallisce a causa di credenziali errate
                http_response_code(401); // Codice di risposta HTTP 401: Non autorizzato
                echo json_encode(array("message" => "Credenziali errate")); // Messaggio di errore per credenziali errate
            }
        } else { // Se l'utente non esiste nel database
            http_response_code(404); // Codice di risposta HTTP 404: Risorsa non trovata
            echo json_encode(array("message" => "Utente non registrato")); // Messaggio di errore per utente non trovato
        }
    } else { // Se i campi obbligatori sono vuoti o mancanti
        http_response_code(400); // Codice di risposta HTTP 400: Richiesta errata
        echo json_encode(array("message" => "Impossibile effettuare il login. Dati incompleti")); // Messaggio di errore per dati mancanti
    }
   
?>
