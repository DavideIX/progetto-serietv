<?php

    // Importa il file per la gestione del CORS e specifica il tipo di risposta HTTP in formato JSON con codifica UTF-8
    include_once '../dataMgr/SessionManager.php'; 
    header("Content-Type: application/json; charset=UTF-8"); 

    // Istanzia un oggetto della classe SessionManager per gestire le sessioni
    $sessionManager = new SessionManager();

    // Prova a ottenere le informazioni sulla sessione e restituire i dettagli in formato JSON
    try {
        $sessionInfo = $sessionManager->getSessionInfo(); // Utilizza il metodo getSessionInfo per ottenere i dettagli della sessione e salvarli in $sessionInfo

        // Verifica se la sessione è attiva e l'utente è loggato
        if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) { 
            // Se l'utente è loggato, restituisce i dettagli della sessione in formato JSON
            echo json_encode([
                "loggedIn" => true, // Indica che l'utente è loggato
                "userType" => $_SESSION['user_type'], // Specifica il tipo di utente ("utente" o "amministratore")
                "username" => $_SESSION['username'] // Nome utente della sessione attiva
            ]);
        } else {
            // Se l'utente non è loggato, restituisce loggedIn come false
            echo json_encode([
                "loggedIn" => false // Indica che non c'è un utente loggato
            ]);
        }
    } catch (Exception $e) { // Se si verifica un errore durante il recupero delle informazioni sulla sessione
        // Viene restituito un messaggio di errore in formato JSON 
        echo json_encode([
            "loggedIn" => false, // Indica che non c'è un utente loggato
            "error" => $e->getMessage() // Messaggio dettagliato sull'errore, preso attraverso il metodo getMessage usato sull'oggetto $e
        ]);
    }

?>