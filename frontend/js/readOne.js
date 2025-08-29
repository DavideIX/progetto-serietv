$(document).ready(function() {
    // Evento click sul pulsante "Dettagli"
    $(document).on("click", ".read-one-button", function(e) { // Al click del pulsante 'read-one-button' esegue la funzione; usato per visualizzare i dettagli di una serie TV
        e.preventDefault(); // Previene il comportamento predefinito del pulsante, ovvero ricaricare la pagina

        const id = $(this).attr("data-id"); // Viene creata la costante 'id' che contiene l'ID della serie TV cliccata, preso dall'attributo 'data-id' del pulsante

        // Effettua una richiesta al server per ottenere i dettagli della serie TV specificata dall'ID
        sendRequest("readOne.php?id=" + id, function(seriesData) { 
            // Alla risposta, effettua una seconda richiesta per ottenere informazioni sull'utente e i suoi permessi
            sendRequest("sessionInfo.php", function(sessionData) { 
                // Determina se l'utente è un amministratore per abilitare pulsanti aggiuntivi e memorizza il risultato in una variabile booleana
                const isAdmin = sessionData.userType === "amministratore"; 
                // Genera il pulsante "Torna all'elenco" e lo memorizza in una variabile alla quale verrà aggiunto il codice HTML per visualizzare i dettagli della serie TV
                let read_one_html = backButton(); 

                // Genera l'HTML per visualizzare i dettagli della serie TV
                read_one_html += `
                    <!-- Sezione principale che contiene i dettagli della serie -->
                    <!-- row crea una riga nel sistema grid di Bootstrap -->
                    <div class='row'> 
                        <!-- Colonna che occupa tutto lo spazio disponibile -->
                        <!-- col-md-12 indica larghezza massima su dispositivi medi e grandi -->
                        <div class='col-md-12'> 
                            <!-- Tabella per organizzare i dettagli -->
                            <table class='table table-bordered'>
                                <tbody>
                                    <!-- Riga per il titolo -->
                                    <tr>
                                        <!-- Intestazione della riga -->
                                        <th>Titolo</th> 
                                        <!-- Dato effettivo dalla serie TV -->
                                        <td>` + seriesData.titolo + `</td> 
                                    </tr>

                                    <!-- Riga per l'anno -->
                                    <tr>
                                        <!-- Intestazione della riga -->
                                        <th>Anno</th> 
                                        <!-- Anno di pubblicazione -->
                                        <td>` + seriesData.anno + `</td> 
                                    </tr>

                                    <!-- Riga per il genere -->
                                    <tr>
                                        <!-- Intestazione della riga -->
                                        <th>Genere</th> 
                                        <!-- Nome del genere, non l'ID -->
                                        <td>` + seriesData.genereNome + `</td> 
                                    </tr>

                                    <!-- Riga per la descrizione -->
                                    <tr>
                                        <!-- Intestazione della riga -->
                                        <th>Descrizione</th> 
                                        <!-- Descrizione della serie -->
                                        <td>` + seriesData.descrizione + `</td> 
                                    </tr>

                                    <!-- Riga per il voto -->
                                    <tr>
                                        <!-- Intestazione della riga -->
                                        <th>Voto</th> 
                                        <!-- Voto numerico della serie -->
                                        <td>` + seriesData.voto + `</td> 
                                    </tr>

                                    <!-- Riga per la recensione -->
                                    <tr>
                                        <!-- Intestazione della riga -->
                                        <th>Recensione</th> 
                                        <!-- Recensione della serie -->
                                        <td>` + seriesData.recensione + `</td> 
                                    </tr>
                                </tbody>
                            </table>
                            <!-- Fine della tabella dei dettagli -->
                        </div>
                    </div>
                    <!-- Fine della sezione principale -->`;

                // Aggiunge i pulsanti "Modifica" e "Cancella" solo se l'utente è amministratore
                if (isAdmin) { 
                    read_one_html += `
                        <!-- Contenitore per i bottoni di azione (solo admin) -->
                        <!-- mt-3 aggiunge un margine superiore -->
                        <div class='mt-3'>
                            <!-- Bottone per modificare la serie -->
                            <!-- btn-info usa il colore info di Bootstrap -->
                            <!-- me-2 aggiunge un margine destro -->
                            <!-- data-id memorizza l'ID della serie per l'evento click -->
                            <button class='btn btn-info me-2 update-button' data-id='` + seriesData.id + `'>
                                <!-- Icona "edit" da Font Awesome -->
                                <i class='fa fa-edit'></i> 
                                Modifica
                            </button>
                            <!-- Bottone per cancellare la serie -->
                            <!-- btn-danger usa il colore rosso di Bootstrap -->
                            <!-- data-id memorizza l'ID della serie per l'evento click -->
                            <button class='btn btn-danger delete-button' data-id='` + seriesData.id + `'>
                                <!-- Icona "trash" da Font Awesome -->
                                <i class='fa fa-trash'></i> 
                                Cancella
                            </button>
                        </div>
                        <!-- Fine contenitore bottoni admin -->`;
                }

                $("#page-content").html(read_one_html); // Inserisce il codice HTML generato all'interno del contenitore con ID 'page-content'

                changePageTitle("Dettagli Serie TV"); // Funzione per cambiare il titolo della pagina
            });
        });
    });
});


