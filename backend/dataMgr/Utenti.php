<?php

    class Utenti {

        // Proprietà private per la connessione al database e i dettagli dell'utente
        private $databaseConnection;
        private $id; 
        private $username; 
        private $password; 
        private $admin; // Flag che indica se l'utente è amministratore

        // Costruttore della classe che accetta la connessione al database come parametro
        public function __construct($databaseConnection) {
            $this->databaseConnection = $databaseConnection; // Imposta la connessione al database
        }

        // Getter e setter per l'ID
        public function getId() {
            return $this->id;
        }
        public function setId($newId) {
            $this->id = $newId;
        }

        // Getter e setter per il nome utente
        public function getUsername() {
            return $this->username;
        }
        public function setUsername($newUsername) {
            $this->username = $newUsername;
        }

        // Getter e setter per la password
        public function getPassword() {
            return $this->password;
        }
        public function setPassword($newPassword) {
            $this->password = $newPassword;
        }

        // Getter e setter per il flag di amministratore
        public function getAdmin() {
            return $this->admin;
        }
        public function setAdmin($newAdmin) {
            $this->admin = $newAdmin;
        } 
                
        // Metodo per registrare un nuovo utente
        public function Registrazione() {
            // Controlla se il nome utente è già utilizzato
            $verifica = "SELECT * 
                        FROM utenti 
                        WHERE username = :username";

            $verificaResult = $this->databaseConnection->prepare($verifica); // Prepara la query
            
            $verificaResult->bindParam(":username", $this->username); // Associa il parametro alla variabile 
            $verificaResult->execute(); // Esegue la query e salva il risultato in $verificaResult

            $row = $verificaResult->fetch(PDO::FETCH_ASSOC); // Estrae il risultato come array associativo e lo salva in $row

            if ($row) {
                // Se il nome utente esiste già, resetta le proprietà e restituisce false
                $this->id = null;
                $this->username = null;
                $this->password = null;

                return false;
            } else {
                // Altrimenti, crea un nuovo utente nel database
                $query = "INSERT INTO utenti
                          SET username = :username,
                              password = :password";

                $queryResult = $this->databaseConnection->prepare($query);

                // Associa i parametri della query alle proprietà della classe
                $queryResult->bindParam(":username", $this->username);
                $queryResult->bindParam(":password", $this->password);

                $queryResult->execute();

                return true; // Restituisce true se l'utente è stato creato con successo
            }
        }

        // Metodo per effettuare il login
        public function Login() {
            // Query per verificare le credenziali dell'utente 
            $query = "SELECT * 
                      FROM utenti 
                      WHERE username = :username AND password = :password";
                      
            $verificaResult = $this->databaseConnection->prepare($query);
            
            $verificaResult->bindParam(":username", $this->username);
            $verificaResult->bindParam(":password", $this->password);
            $verificaResult->execute();
            
            $row = $verificaResult->fetch(PDO::FETCH_ASSOC); // Estrae il risultato come array associativo e lo salva in $row
            
            if ($row) { // Se le credenziali sono corrette
                if ($row['admin'] === "amministratore") { // Controlla se l'utente è un amministratore
                    $this->admin = "amministratore"; // Se sì, imposta il flag di amministratore a true
                } 

                return true; // Restituisce true se il login è avvenuto con successo sia per utenti che per amministratori
                
            } else {
                // Se le credenziali sono errate, restituisce false
                return false;
            }
        }

        // Metodo per verificare se un utente esiste già nel database
        public function utenteEsiste() {
            $query = "SELECT id 
                      FROM utenti 
                      WHERE username = :username";

            $queryResult = $this->databaseConnection->prepare($query);
            $queryResult->bindParam(":username", $this->username);
            $queryResult->execute();
        
            if ($queryResult->rowCount() > 0) { // Se la query restituisce almeno una riga, significa che l'utente esiste
    
                return true; // Restituisce true se l'utente esiste

            } else { // Se la query non restituisce alcuna riga, significa che l'utente non esiste
      
                return false; // Restituisce false se l'utente non esiste
            }
        }
    }
?>
