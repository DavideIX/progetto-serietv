<?php

    // Importa il file per la gestione del CORS e specifica il tipo di risposta HTTP in formato JSON con codifica UTF-8
    require 'cors.php'; 
    header('Content-Type: application/json charset=UTF-8'); 

    include_once '../dataMgr/SessionManager.php'; // Include la classe per la gestione delle sessioni, che consente di interagire con la sessione PHP

    $sessionManager = new SessionManager(); // Istanzia un oggetto della classe SessionManager
    $sessionManager->destroySession(); // Chiama il metodo per distruggere la sessione corrente, rimuovendo tutte le variabili di sessione e terminando la sessione

    http_response_code(200); // Codice di risposta HTTP 200: indica che l'operazione è stata completata con successo
    echo json_encode(array(
        "message" => "Logout effettuato con successo" // Messaggio JSON di conferma che comunica l'avvenuto logout
    ));
    
?>