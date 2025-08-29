<?php
// Copia questo file come Database.php e inserisci le tue credenziali locali
class Database
{
    // Proprietà private per configurare la connessione al database
    private $databaseHost = "INSERISCI_HOST_DEL_DATABASE"; // Indirizzo del server del database, es: localhost
    private $databaseName = "INSERISCI_NOME_DATABASE"; // Nome del database, es: serietv
    private $databaseUsername = "INSERISCI_USERNAME_DATABASE"; // Nome utente per accedere al database, es: root
    private $databasePassword = "INSERISCI_PASSWORD_DATABASE"; // Password per accedere al database, es: password
    private $databaseConnection; // Variabile che conterrà l'oggetto connessione PDO

    // Metodo per ottenere la connessione al database
    public function getConnection()
    {
        // Inizializza la connessione come null per gestire eventuali errori precedenti
        $this->databaseConnection = null;

        try {
            // Crea un'istanza PDO per connettersi al database utilizzando i parametri configurati
            $this->databaseConnection = new PDO(
                "mysql:host=" . $this->databaseHost . ";dbname=" . $this->databaseName . ";charset=utf8", // Stringa di connessione dove specifica il tipo di database, host, nome del database e codifica caratteri
                $this->databaseUsername, // Nome utente per accedere al database
                $this->databasePassword  // Password per accedere al database
            );
        } catch (PDOException $exception) { // Cattura eventuali eccezioni di tipo PDOException che vengono salvate in $exception
            // Gestisce l'errore di connessione e mostra un messaggio d'errore
            echo "Errore di connessione: " . $exception->getMessage(); // Messaggio di errore preso usando il metodo getMessage() dell'oggetto PDOException $exception
        }
        
        // Restituisce l'oggetto PDO o null se la connessione è fallita
        return $this->databaseConnection;
    }
}
