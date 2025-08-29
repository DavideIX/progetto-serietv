<?php

    class SessionManager {
        
        // Costruttore della classe SessionManager
        public function __construct() {
            // Controlla se la sessione non è già avviata e la avvia
            if (session_status() === PHP_SESSION_NONE) { 
                session_start(); 
            }
        }

        // Crea una sessione impostando le informazioni di login
        public function createSession($username, $userType) { // La funzione accetta il nome utente e il tipo di utente come parametri
            $_SESSION['logged_in'] = true; // Flag per indicare che l'utente è autenticato
            $_SESSION['username'] = $username; // Nome utente salvato nella sessione
            $_SESSION['user_type'] = $userType; // Tipo di utente (es. "amministratore")
        }

        // Verifica che l'utente sia autenticato
        public function verifySession() {
            // Controlla se la chiave "logged_in" non è impostata
            if (!isset($_SESSION['logged_in'])) { 
                http_response_code(401); // Imposta il codice di risposta HTTP a 401 (non autorizzato)
                echo json_encode(array("message" => "Sessione non valida. Effettuare il login.")); // Messaggio di errore in formato JSON 
                exit(); // Interrompe l'esecuzione dello script
            }
            
            // Controlla se il flag "logged_in" è impostato a true
            if ($_SESSION['logged_in'] !== true) { 
                http_response_code(401);
                echo json_encode(array("message" => "Sessione non valida. Effettuare il login."));
                exit();
            }

            return true; // Restituisce true se la sessione è valida
        }

        // Verifica che l'utente sia un amministratore
        public function verifyAdminSession() {
            // Controlla se l'utente non è autenticato andando a vedere se la chiave "logged_in" non è impostata o è impostata a false
            if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) { 
                http_response_code(403); // Imposta il codice di risposta HTTP a 403 (accesso negato)
                echo json_encode(array("message" => "Sessione non valida. Effettuare il login."));
                exit();
            }
        
            // Controlla se l'utente non è un amministratore andando a vedere se la chiave "user_type" non è impostata o è diversa da "amministratore"
            if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== "amministratore") { 
                http_response_code(403);
                echo json_encode(array("message" => "Accesso non autorizzato. Richiesti privilegi di amministratore.")); 
                exit();
            }
        
            return true; // Restituisce true se l'utente è un amministratore
        }

        // Distrugge la sessione corrente
        public function destroySession() {
            session_unset(); // Rimuove tutte le variabili di sessione
            session_destroy(); // Distrugge la sessione
        }

        // Restituisce le informazioni sulla sessione
        public function getSessionInfo() {
            $sessionInfo = array(); // Array per raccogliere le informazioni sulla sessione
            
            $sessionInfo['session_id'] = session_id(); // Salva l'ID della sessione nel array sotto la chiave "session_id"
            
            // Controlla se il nome utente è impostato nella variabile di sessione
            if (isset($_SESSION['username'])) {
                $sessionInfo['username'] = $_SESSION['username']; // Se sì, salva il nome utente nel array sotto la chiave "username"
            } else {
                $sessionInfo['username'] = null; // Se no, assegna il valore null alla chiave "username" dell'array
            }
            
            // Controlla se il tipo di utente è impostato
            if (isset($_SESSION['user_type'])) {
                $sessionInfo['user_type'] = $_SESSION['user_type']; // Se sì, salva il tipo di utente nel array sotto la chiave "user_type"
            } else {
                $sessionInfo['user_type'] = null; // Se no, assegna il valore null alla chiave "user_type" dell'array
            }
            
            return $sessionInfo; // Restituisce l'array con le informazioni sulla sessione
        }
    }

?>

