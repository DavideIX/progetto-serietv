<?php

   class SerieTV {
       
       private $databaseConnection; // Connessione al database
    
       // Proprietà pubbliche che rappresentano i campi della tabella "serie"
       public $id;
       public $titolo;
       public $anno;
       public $descrizione;
       public $voto;
       public $recensione; 
       public $genere_id;
       public $genere_nome;

       // Costruttore che accetta la connessione al database come parametro
       public function __construct($databaseConnection) {
           $this->databaseConnection = $databaseConnection; 
       }

       // Getter e setter per ogni proprietà
       public function getId() {
           return $this->id;
       }
       public function setId($newId) {
           $this->id = $newId;
       }

       public function getTitolo() {
           return $this->titolo;
       }
       public function setTitolo($newTitolo) {
           $this->titolo = $newTitolo;
       }

       public function getAnno() {
           return $this->anno;
       }
       public function setAnno($newAnno) {
           $this->anno = $newAnno;
       }

       public function getDescrizione() {
           return $this->descrizione;
       }
       public function setDescrizione($newDescrizione) {
           $this->descrizione = $newDescrizione;
       }

       public function getVoto() {
           return $this->voto;
       }
       public function setVoto($newVoto) {
           $this->voto = $newVoto;
       }

       public function getRecensione() {
           return $this->recensione;
       }
       public function setRecensione($newRecensione) {
           $this->recensione = $newRecensione;
       }

       public function getGenere_id() {
           return $this->genere_id;
       }
       public function setGenere_id($newGenereId) {
           $this->genere_id = $newGenereId;
       }

       public function getGenere_nome() {
           return $this->genere_nome;
       }
       public function setGenere_nome($newGenereNome) {
           $this->genere_nome = $newGenereNome;
       }

       // Metodo per leggere tutti i record dalla tabella "serie" collegati alla tabella "genere"
       public function readAll() {
            // Query per selezionare tutti i record dalla tabella "serie" e unirli con la tabella "genere" sulla base dell'ID del genere
           $query = "SELECT * 
                     FROM serie
                     JOIN genere ON serie.id_gen = genere.idgen 
                     ORDER BY serie.titolo";
           
           $queryResult = $this->databaseConnection->prepare($query); // Prepara la query
           $queryResult->execute(); // Esegue la query
           return $queryResult; // Restituisce il risultato della query e lo salva nella variabile $queryResult
       }

       // Metodo per leggere un singolo record identificato dall'ID
       public function readOne(){
           $query = "SELECT *
                     FROM serie
                     JOIN genere ON serie.id_gen = genere.idgen
                     WHERE serie.id = :id";

           $queryResult = $this->databaseConnection->prepare($query);
           $queryResult->bindParam(":id", $this->id); // Associa il valore dell'ID al parametro della query
           $queryResult->execute();

           $row = $queryResult->fetch(PDO::FETCH_ASSOC); // Estrae il risultato come array associativo e lo salva in $row
 
           // Se il record è trovato, popola le proprietà della classe
           if($row) {
               $this->titolo = $row['titolo'];
               $this->anno = $row['anno'];
               $this->descrizione = $row['descrizione'];
               $this->voto = $row['voto'];
               $this->recensione = $row['recensione'];
               $this->genere_id = $row['id_gen'];
               $this->genere_nome = $row['nomegen'];

               return true; // Restituisce true se il record è trovato

           } else {
               // Se il record non è trovato, resetta le proprietà
               $this->titolo = null;
               $this->anno = null;
               $this->descrizione = null;
               $this->voto = null;
               $this->recensione = null;
               $this->genere_id = null;
               $this->genere_nome = null;

               return false; // Restituisce false se il record non è trovato
           }
       }

       // Metodo per creare un nuovo record nella tabella "serie"
       public function create() {
           $query = "INSERT INTO serie
                     SET titolo = :titolo,
                         anno = :anno,
                         descrizione = :descrizione,
                         voto = :voto,
                         recensione = :recensione,
                         id_gen = :genereId";

           $queryResult = $this->databaseConnection->prepare($query);
           
           // Associa i valori delle proprietà ai parametri della query
           $queryResult->bindParam(":titolo", $this->titolo);
           $queryResult->bindParam(":anno", $this->anno);
           $queryResult->bindParam(":descrizione", $this->descrizione);
           $queryResult->bindParam(":voto", $this->voto);
           $queryResult->bindParam(":recensione", $this->recensione);
           $queryResult->bindParam(":genereId", $this->genere_id);

           $queryResult->execute();
           return $queryResult; // Restituisce il risultato della query
       }
   
       // Metodo per aggiornare un record esistente
       public function update() {
           $query = "UPDATE serie
                     SET titolo = :titolo,
                         anno = :anno,
                         descrizione = :descrizione,
                         voto = :voto,
                         recensione = :recensione,
                         id_gen = :genereId
                     WHERE id = :id";

           $queryResult = $this->databaseConnection->prepare($query);

           // Associa i valori delle proprietà ai parametri della query
           $queryResult->bindParam(":titolo", $this->titolo);
           $queryResult->bindParam(":anno", $this->anno);
           $queryResult->bindParam(":descrizione", $this->descrizione);
           $queryResult->bindParam(":voto", $this->voto);
           $queryResult->bindParam(":recensione", $this->recensione);
           $queryResult->bindParam(":genereId", $this->genere_id);
           $queryResult->bindParam(":id", $this->id);

           $queryResult->execute();
           return $queryResult;
       }

       // Metodo per eliminare un record dalla tabella "serie"
       public function delete() {
           $query = "DELETE FROM serie 
                     WHERE id = :id";
           
           $queryResult = $this->databaseConnection->prepare($query);
           
           $queryResult->bindParam(":id", $this->id); // Associa il valore dell'ID al parametro della query
           
           $queryResult->execute();
           return $queryResult;
       }
  
       // Metodo per cercare record basati su parole chiave 
       public function search($searchKeywords) { 
            // LIKE è un operatore SQL che consente di cercare una corrispondenza parziale all'interno di una stringa
           $query = "SELECT *
                     FROM serie
                     JOIN genere ON serie.id_gen = genere.idgen
                     WHERE serie.titolo LIKE :titolo 
                        OR serie.descrizione LIKE :descrizione 
                        OR genere.nomegen LIKE :nomegen
                     ORDER BY serie.titolo";

           $queryResult = $this->databaseConnection->prepare($query); 
           
           $searchPattern = "%{$searchKeywords}%"; // Aggiunge il carattere jolly % prima e dopo le parole chiave per cercare corrispondenze parziali

           // Associa il valore del pattern di ricerca ai parametri della query per cercare corrispondenze parziali nei campi "titolo", "descrizione" e "nomegen"
           $queryResult->bindParam(":titolo", $searchPattern);
           $queryResult->bindParam(":descrizione", $searchPattern);
           $queryResult->bindParam(":nomegen", $searchPattern);

           $queryResult->execute();
           return $queryResult;
       }
   }
?>
