$(document).ready(function() {

    $(document).on('click', '#logout', function(e) { // Al click del pulsante con ID 'logout' esegue la funzione; usato per il pulsante "Logout"
        e.preventDefault(); // Previene il comportamento predefinito al click del pulsante, ovvero ricaricare la pagina
        
        bootbox.confirm({ // Apre una finestra di dialogo per confermare il logout
            title: "Conferma Logout", // Titolo della finestra di dialogo
            message: "Sei sicuro di voler effettuare il logout?", // Messaggio per l'utente
            swapButtonOrder: true, // Inverte l'ordine dei pulsanti: Conferma a sinistra, Annulla a destra
            buttons: { // Definisce i pulsanti della finestra di dialogo
                confirm: { // Pulsante di conferma
                    label: '<span class="fa fa-check"></span> Conferma', // Etichetta e icona per il pulsante di conferma
                    className: 'btn-danger' // Stile per il pulsante di conferma
                },
                cancel: { // Pulsante di annullamento
                    label: '<span class="fa fa-times"></span> Annulla',
                    className: 'btn-secondary'
                }
            },

            callback: function(result) { // Funzione di callback eseguita quando l'utente interagisce con la finestra di dialogo
                if (result) { // Se l'utente clicca su "Conferma"
                    sendRequest("logout.php", () => { // Invia una richiesta al server per effettuare il logout
                        showLoginForm(); // Mostra il modulo di login
                    });
                }
            }
        });
    });

    $(document).on('submit', '#login-form', function(e) { // Al submit del modulo con ID 'login-form' esegue la funzione che gestisce il login
        e.preventDefault(); // Previene il comportamento predefinito all'invio del modulo, ovvero ricaricare la pagina
        const form_data = JSON.stringify(Object.fromEntries(new FormData(this))); // Serializza i dati del modulo in formato JSON, ovvero li trasforma in una stringa JSON
    
        sendRequest("login.php",(data) => { // Invia una richiesta al server per effettuare il login e una volta completata esegue la funzione di callback usando i dati ricevuti
                showSeriesList(); // Una volta effettuato il login con successo, mostra l'elenco delle serie TV
            },
            "POST", // Specifica il metodo HTTP POST per la richiesta 
            form_data, // Specifica i dati del modulo serializzati
            (error) => { // Funzione di callback per gestire gli errori
                if (error.status === 401) { // Se il codice di stato dell'errore è 401
                    // Mostra una finestra di dialogo per informare l'utente che le credenziali sono errate
                    bootbox.alert({ 
                        title: "Errore",
                        message: "Credenziali errate. Per favore riprova.",
                    });
                } else if (error.status === 404) { // Se il codice di stato dell'errore è 404
                    // Mostra una finestra di dialogo per informare l'utente che l'utente non è registrato
                    bootbox.alert({
                        title: "Errore",
                        message: "Utente non registrato.",
                    });
                } else { // Se il codice di stato dell'errore non è 401 o 404
                    // Mostra una finestra di dialogo per informare l'utente che si è verificato un errore generico
                    bootbox.alert({
                        title: "Errore",
                        message: "Si è verificato un errore. Riprova più tardi.",
                    });
                }
            }
        );
    });

    $(document).on('submit', '#register-form', function(e) { // Al submit del modulo con ID 'register-form' esegue la funzione che gestisce la registrazione
        e.preventDefault(); // Previene il comportamento predefinito all'invio del modulo, ovvero ricaricare la pagina
        const form_data = JSON.stringify(Object.fromEntries(new FormData(this))); // Serializza i dati del modulo in formato JSON, ovvero li trasforma in una stringa JSON
        
        sendRequest("registrazione.php",() => { // Invia una richiesta al server per effettuare la registrazione e una volta completata esegue la funzione di callback
                bootbox.alert({ // Mostra una finestra di dialogo per informare l'utente che la registrazione è avvenuta con successo attraverso la libreria Bootbox
                    title: "Successo",
                    message: "Registrazione effettuata con successo! Ora puoi effettuare il login.",
                    callback: showLoginForm // Al click del pulsante "OK" nella finestra di dialogo, mostra il modulo di login
                });
            },
            "POST", // Specifica il metodo HTTP POST per la richiesta
            form_data, // Specifica i dati del modulo serializzati
            (error) => { // Funzione di callback per gestire gli errori
                if (error.status === 400) { // Se il codice di stato dell'errore è 400
                    // Mostra una finestra di dialogo per informare l'utente che l'username è già in uso
                    bootbox.alert({
                        title: "Errore",
                        message: "Username già in uso. Per favore scegline un altro.",
                    });
                } else { // Se il codice di stato dell'errore non è 400
                    // Mostra una finestra di dialogo per informare l'utente che si è verificato un errore generico
                    bootbox.alert({
                        title: "Errore",
                        message: "Si è verificato un errore durante la registrazione. Riprova più tardi.",
                    });
                }
            }
        );
    });

    // Switch tra il modulo di login e quello di registrazione
    $(document).on('click', '#show-register', function(e) { // Al click del pulsante con ID 'show-register' esegue la funzione; usato per il pulsante "Non hai un account? Registrati"
        e.preventDefault(); // Previene il comportamento predefinito del pulsante, ovvero ricaricare la pagina
        showRegisterForm(); // Richiama la funzione per mostrare il modulo di registrazione
    });

    $(document).on('click', '#show-login', function(e) { // Al click del pulsante con ID 'show-login' esegue la funzione; usato per il pulsante "Hai già un account? Accedi"
        e.preventDefault(); 
        showLoginForm(); // Richiama la funzione per mostrare il modulo di login
    });
});

// Funzione per mostrare il modulo di login
function showLoginForm() { 
    $('.top-header').remove(); // Rimuove l'header della pagina se presente per toglie il pulsante di logout
    
    changePageTitle("Login"); // Funzione per cambiare il titolo della pagina
    
    // Codice HTML per il modulo di login
    let html = `
    <!-- Riga principale centrata usando le classi Bootstrap -->
    <div class="row justify-content-center">
        <div class="col-md-6">
            <!-- Contenitore del form con stili personalizzati -->
            <div class="form-container">
                <!-- Contenitore interno per il contenuto del form -->
                <div class="form-content">

                    <!-- Form di login con ID univoco e prevenzione submit di default -->
                    <form id='login-form' action='#' method='post'>

                        <!-- Gruppo per il campo username -->
                        <div class="mb-3">
                            <!-- Label per l'input username -->
                            <label for="username" class="form-label">Username</label>
                            <!-- Campo input per l'username, richiesto -->
                            <input type="text" class="form-control" name="username" required>
                        </div>

                        <!-- Gruppo per il campo password -->
                        <div class="mb-3">
                            <!-- Label per l'input password -->
                            <label for="password" class="form-label">Password</label>
                            <!-- Campo input per la password, tipo password per nascondere i caratteri -->
                            <input type="password" class="form-control" name="password" required>
                        </div>

                        <!-- Bottone di submit per il form -->
                        <button type="submit" class="btn btn-primary">Login</button>

                        <!-- Link per passare al form di registrazione -->
                        <a href="#" id="show-register" class="btn btn-link">Non hai un account? Registrati</a>
                    </form>
                </div>
            </div>
        </div>
    </div>`;

    $("#page-content").html(html); // Inserisce il codice HTML generato all'interno del contenitore con ID 'page-content'
}

// Funzione per mostrare il modulo di registrazione
function showRegisterForm() { 
    changePageTitle("Registrazione"); // Funzione per cambiare il titolo della pagina
    
    // Codice HTML per il modulo di registrazione
    let html = `
        <!-- Riga principale centrata usando le classi Bootstrap -->
        <div class="row justify-content-center">
            <div class="col-md-6">
                <!-- Contenitore del form con stili personalizzati -->
                <div class="form-container">
                    <!-- Contenitore interno per il contenuto del form -->
                    <div class="form-content">

                        <!-- Form di registrazione con ID univoco e prevenzione submit di default -->
                        <form id='register-form' action='#' method='post'>

                            <!-- Gruppo per il campo username -->
                            <div class="mb-3">
                                <!-- Label per l'input username -->
                                <label for="username" class="form-label">Username</label>
                                <!-- Campo input per l'username, richiesto -->
                                <input type="text" class="form-control" name="username" required>
                            </div>

                            <!-- Gruppo per il campo password -->
                            <div class="mb-3">
                                <!-- Label per l'input password -->
                                <label for="password" class="form-label">Password</label>
                                <!-- Campo input per la password, tipo password per nascondere i caratteri -->
                                <input type="password" class="form-control" name="password" required>
                            </div>
                            
                            <!-- Bottone di submit per il form -->
                            <button type="submit" class="btn btn-primary">Registrati</button>
                            <!-- Link per tornare al form di login -->
                            <a href="#" id="show-login" class="btn btn-link">Hai già un account? Accedi</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>`;

    $("#page-content").html(html); // Inserisce il codice HTML generato all'interno del contenitore con ID 'page-content'
}


