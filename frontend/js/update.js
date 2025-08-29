$(document).ready(function() {
    $(document).on('click', '.update-button', function(e) { // Al click del pulsante 'update-button' esegue la funzione; usato per il pulsante "Modifica"
        e.preventDefault(); // Previene il comportamento predefinito del pulsante, ovvero ricaricare la pagina

        // Viene creata la costante 'id' che contiene l'ID della serie TV cliccata, preso dall'attributo 'data-id' del pulsante
        const id = $(this).attr('data-id'); 
        
        // Effettua una richiesta al server per ottenere i dettagli della serie TV specificata dall'ID
        sendRequest("readOne.php?id=" + id, data => {
            // Genera il pulsante "Torna all'elenco" e lo memorizza in una variabile che poi conterrà l'interfaccia per aggiornare i dettagli della serie TV
            let update_series_html = backButton(); 
            // Genera il modulo HTML per aggiornare i dettagli della serie TV
            update_series_html += `
                <!-- Form principale per la modifica -->
                <!-- action='#' previene il submit di default -->
                <!-- method='post' specifica il metodo HTTP da usare -->
                <form id='update-series-form' action='#' method='post'>
                    <!-- Tabella per organizzare i campi del form -->
                    <table class='table table-hover table-responsive table-bordered'>

                        <!-- Campo per il titolo -->
                        <tr>
                            <td>Titolo</td>
                            <td>
                                <!-- value viene precompilato con il titolo esistente -->
                                <!-- required indica che il campo è obbligatorio -->
                                <input value=\"` + data.titolo + `\" type='text' name='titolo' class='form-control' required />
                            </td>
                        </tr>

                        <!-- Campo per l'anno -->
                        <tr>
                            <td>Anno</td>
                            <td>
                                <!-- Input numerico per l'anno -->
                                <!-- min e max limitano l'intervallo di anni validi -->
                                <!-- value viene precompilato con l'anno esistente -->
                                <input value=\"` + data.anno + `\" type='number' name='anno' class='form-control' min='1900' max='2099' required />
                            </td>
                        </tr>

                        <!-- Campo per la descrizione -->
                        <tr>
                            <td>Descrizione</td>
                            <td>
                                <!-- Textarea per la descrizione -->
                                <!-- Il testo esistente viene inserito tra i tag di apertura e chiusura -->
                                <!-- Non ha attributi min/max perché la lunghezza è gestita dal backend -->
                                <textarea name='descrizione' class='form-control' required>` + data.descrizione + `</textarea>
                            </td>
                        </tr>

                        <!-- Campo per il voto -->
                        <tr>
                            <td>Voto</td>
                            <td>
                                <!-- Input numerico per il voto -->
                                <!-- step='0.5' permette solo mezzi voti -->
                                <!-- min e max limitano il voto tra 1 e 10 -->
                                <!-- value viene precompilato con il voto esistente -->
                                <input value=\"` + data.voto + `\" type='number' name='voto' class='form-control' min='1' max='10' step='0.5' required />
                            </td>
                        </tr>

                        <!-- Campo per la recensione -->
                        <tr>
                            <td>Recensione</td>
                            <td>
                                <!-- Textarea per la recensione -->
                                <!-- Il testo esistente viene inserito tra i tag di apertura e chiusura -->
                                <textarea name='recensione' class='form-control' required>` + data.recensione + `</textarea>
                            </td>
                        </tr>

                        <!-- Campo per l'ID del genere -->
                        <tr>
                            <td>ID Genere</td>
                            <td>
                                <!-- Input numerico per l'ID del genere -->
                                <!-- min='1' assicura che venga selezionato un genere valido -->
                                <!-- value viene precompilato con l'ID del genere esistente -->
                                <input value=\"` + data.genereId + `\" type='number' name='genere_id' class='form-control' min='1' required />
                            </td>
                        </tr>

                        <!-- Riga finale con campo nascosto e bottone -->
                        <tr>
                            <td>
                                <!-- Campo nascosto per l'ID della serie -->
                                <!-- Mantiene l'ID della serie durante l'update -->
                                <input value=\"` + id + `\" name='id' type='hidden' />
                            </td>
                            <td>
                                <!-- Bottone di submit -->
                                <button type='submit' class='btn btn-info'>
                                    <!-- Icona "edit" da Font Awesome -->
                                    <span class='fa fa-edit'></span> 
                                    Aggiorna Serie TV
                                </button>
                            </td>
                        </tr>
                    </table>
                </form>`;
            // Fine del modulo HTML

            $("#page-content").html(update_series_html); // Inserisce il codice HTML generato all'interno del contenitore con ID 'page-content'

            changePageTitle("Aggiorna Serie TV"); // Funzione per cambiare il titolo della pagina
        });
    });

    $(document).on('submit', '#update-series-form', function(e) { // Al submit del modulo con ID 'update-series-form' esegue la funzione
        e.preventDefault(); // Previene il comportamento predefinito del modulo, ovvero ricaricare la pagina

        // Crea una costante 'form_data' che conterrà i dati del modulo serializzati in formato JSON
        const form_data = JSON.stringify(Object.fromEntries(new FormData(this))); // Serializza i dati del modulo in formato JSON, ovvero li trasforma in una stringa JSON usando Object.fromEntries e FormData
        bootbox.confirm({ // Mostra una finestra di conferma utilizzando la libreria Bootbox
            title: "Conferma Modifica", // Titolo della finestra di conferma
            message: "Sei sicuro di voler aggiornare questa serie TV?", // Messaggio per l'utente
            swapButtonOrder: true, // Inverte l'ordine dei pulsanti: Conferma a sinistra, Annulla a destra
            buttons: { // Definisce i pulsanti della finestra di conferma
                confirm: { // Pulsante di conferma
                    label: '<span class="fa fa-check"></span> Conferma', // Etichetta e icona per il pulsante di conferma
                    className: 'btn-info' // Stile per il pulsante di conferma
                },
                cancel: { // Pulsante di annullamento
                    label: '<span class="fa fa-times"></span> Annulla', 
                    className: 'btn-secondary' 
                }
            },
            callback: function(result) { // Funzione di callback eseguita quando l'utente interagisce con la finestra che ha come parametro il risultato della scelta dell'utente
                if (result) { // Se l'utente clicca su "Conferma"
                    sendRequest("update.php", () => { // Invia una richiesta al server per aggiornare la serie TV
                        bootbox.alert("Serie TV aggiornata con successo."); // Mostra un messaggio di conferma all'utente
                        showSeriesList(); // Aggiorna l'elenco delle serie TV sulla pagina chiamando la funzione showSeriesList  
                    }, "PUT", form_data); // Specifica il metodo HTTP PUT per la richiesta e i dati del modulo serializzati salvati nella costante 'form_data'
                   
                }
            }
        });
    });
});


