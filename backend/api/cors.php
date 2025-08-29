<?php

    // Controlla se l'header HTTP_ORIGIN è presente nella richiesta.
    // Questo header viene inviato dal browser per indicare da quale dominio (origine) proviene la richiesta.
    if(isset($_SERVER['HTTP_ORIGIN'])){

        // Permette al browser di accettare la richiesta da questo dominio.
        // {$_SERVER['HTTP_ORIGIN']} è una variabile che contiene il dominio da cui arriva la richiesta.
        header("Access-Control-Allow-Origin:{$_SERVER['HTTP_ORIGIN']}");
        
        // Permette l'uso di cookie o credenziali (come autenticazioni) nelle richieste da altri domini.
        header('Access-Control-Allow-Credentials: true');

        // Dice al browser che può ricordare (in cache) questa configurazione per 86400 secondi (cioè 24 ore).
        header('Access-Control-Max-Age: 86400');
    }

    // Controlla se il metodo della richiesta HTTP è "OPTIONS".
    // Questo tipo di richiesta è speciale e viene usato dal browser per verificare se è permesso fare richieste più complesse (es. con metodi POST o PUT).
    if($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){

        // Controlla se il browser ha specificato quali metodi HTTP (es. GET, POST) vuole usare.
        if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){

            // Dice al browser quali metodi sono consentiti: GET, POST, PUT, DELETE e OPTIONS.
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        }

        // Controlla se il browser ha specificato quali "header" HTTP vuole usare (es. informazioni aggiuntive come Content-Type).
        if(isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){

            // Dice al browser quali header HTTP sono permessi (ad esempio Content-Type, Authorization, ecc.).
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        }

        // Termina lo script qui perché non serve fare altro per le richieste "OPTIONS".
        exit(0);
    }
?>