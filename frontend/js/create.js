$(document).ready(function() {
    $(document).on('click', '#add-series', function(e) { // Al click del pulsante 'add-series' esegue la funzione; usato per il pulsante "Inserisci nuova serie TV"
        e.preventDefault(); // Previene il comportamento predefinito del pulsante, ovvero ricaricare la pagina

        let create_series_html = backButton(); // Genera il pulsante "Torna all'elenco" e lo memorizza in una variabile che poi conterrà l'interfaccia per creare una nuova serie TV
        // Genera il modulo HTML per creare una nuova serie TV
        create_series_html += `
            <!-- Form principale per la creazione della serie TV -->
            <!-- action='#' previene il submit di default, method='post' indica che i dati verranno inviati come POST -->
            <form id='create-series-form' action='#' method='post'>
                <!-- Tabella responsive per organizzare i campi del form -->
                <table class='table table-hover table-responsive table-bordered'>
                
                    <!-- Campo per il titolo della serie -->
                    <tr>
                        <!-- Etichetta del campo -->
                        <td>Titolo</td>
                        <!-- Contenitore dell'input -->
                        <td>
                            <!-- required indica che il campo è obbligatorio -->
                            <!-- form-control applica gli stili Bootstrap all'input -->
                            <input type='text' name='titolo' class='form-control' required />
                        </td>
                    </tr>

                    <!-- Campo per l'anno di uscita -->
                    <tr>
                        <td>Anno</td>
                        <td>
                            <!-- Input numerico con range definito -->
                            <!-- min='1900' max='2099' limita gli anni inseribili -->
                            <input type='number' name='anno' class='form-control' min='1900' max='2099' required />
                        </td>
                    </tr>

                    <!-- Campo per la descrizione -->
                    <tr>
                        <td>Descrizione</td>
                        <td>
                            <!-- Textarea per testi lunghi -->
                            <!-- Non ha attributi min/max perché la lunghezza è gestita dal backend -->
                            <textarea name='descrizione' class='form-control' required></textarea>
                        </td>
                    </tr>

                    <!-- Campo per il voto -->
                    <tr>
                        <td>Voto</td>
                        <td>
                            <!-- Input numerico per il voto con decimali -->
                            <!-- step='0.5' permette solo mezzi voti (es. 7.5, 8.0) -->
                            <!-- min='1' max='10' limita il voto tra 1 e 10 -->
                            <input type='number' name='voto' class='form-control' min='1' max='10' step='0.5' required />
                        </td>
                    </tr>

                    <!-- Campo per la recensione -->
                    <tr>
                        <td>Recensione</td>
                        <td>
                            <textarea name='recensione' class='form-control' required></textarea>
                        </td>
                    </tr>

                    <!-- Campo per l'ID del genere -->
                    <tr>
                        <td>ID Genere</td>
                        <td>
                            <!-- Input numerico per selezionare il genere -->
                            <!-- min='1' assicura che venga selezionato un genere valido -->
                            <input type='number' name='genere_id' class='form-control' min='1' required />
                        </td>
                    </tr>

                    <!-- Riga per il bottone di submit -->
                    <tr>
                        <!-- Prima colonna vuota per mantenere l'allineamento -->
                        <td></td>
                        <!-- Seconda colonna contiene il bottone -->
                        <td>
                            <!-- Bottone di submit con icona -->
                            <!-- btn-primary applica lo stile principale di Bootstrap -->
                            <button type='submit' class='btn btn-primary'>
                                <!-- Icona "plus" da Font Awesome -->
                                <span class='fa fa-plus'></span> 
                                Crea Serie TV
                            </button>
                        </td>
                    </tr>
                </table>
            </form>`;
        // Fine del modulo HTML

        $("#page-content").html(create_series_html); // Inserisce il codice HTML generato all'interno del contenitore con ID 'page-content'
        changePageTitle("Crea Serie TV"); // Funzione per cambiare il titolo della pagina
    });

    $(document).on('submit', '#create-series-form', function(e) { // Al submit del modulo 'create-series-form' esegue la funzione
        e.preventDefault(); // Previene il comportamento predefinito del modulo, ovvero ricaricare la pagina

        // Crea una costante 'form_data' che conterrà i dati del modulo serializzati in formato JSON
        const form_data = JSON.stringify(Object.fromEntries(new FormData(this))); // Serializza i dati del modulo in formato JSON, ovvero li trasforma in una stringa JSON usando Object.fromEntries e FormData
        bootbox.confirm({ // Mostra una finestra di dialogo per confermare l'azione utilizzando la libreria Bootbox
            title: "Conferma Creazione", // Titolo della finestra di dialogo
            message: "Sei sicuro di voler creare questa serie TV?", // Messaggio per l'utente
            swapButtonOrder: true, // Inverte l'ordine dei pulsanti: Conferma a sinistra, Annulla a destra
            buttons: { // Definisce i pulsanti della finestra di dialogo
                confirm: { // Pulsante di conferma
                    label: '<span class="fa fa-check"></span> Conferma', // Etichetta e icona per il pulsante di conferma
                    className: 'btn-primary' // Stile per il pulsante di conferma
                },
                cancel: { // Pulsante di annullamento
                    label: '<span class="fa fa-times"></span> Annulla', 
                    className: 'btn-secondary' 
                }
            },
            callback: function(result) { // Funzione di callback eseguita quando l'utente interagisce con la finestra di dialogo
                if (result) { // Se l'utente clicca su "Conferma"
                    sendRequest("create.php", () => { // Invia una richiesta al server per creare una nuova serie TV
                        bootbox.alert("Serie TV creata con successo."); // Mostra un messaggio di conferma all'utente
                        showSeriesList(); // Aggiorna l'elenco delle serie TV sulla pagina chiamando la funzione showSeriesList
                    }, "POST", form_data); // Specifica il metodo HTTP POST per la richiesta e i dati del modulo serializzati salvati nella costante 'form_data'
                }
            }
        });
    });
});








