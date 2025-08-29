$(document).ready(function() { // Quando il documento è pronto, esegue la funzione

    $(document).on('click', '.delete-button', function() { // Al click del pulsante 'delete-button' esegue la funzione; usato per il pulsante "Cancella"

        const id = $(this).attr('data-id'); // Viene creata la costante 'id' che contiene l'ID della serie TV cliccata, preso dall'attributo 'data-id' del pulsante

        // Mostra una finestra di conferma utilizzando la libreria Bootbox
        bootbox.confirm({
            title: "Attenzione!", // Titolo della finestra di conferma
            message: "Sei sicuro di voler eliminare questa serie TV?", // Messaggio per l'utente
            swapButtonOrder: true, // Inverte l'ordine dei pulsanti: Conferma a sinistra, Annulla a destra
            buttons: { // Definisce i pulsanti della finestra di conferma
                confirm: { 
                    label: '<span class="fa fa-check"></span> Conferma', // Etichetta e icona per il pulsante di conferma
                    className: 'btn-danger' // Stile per il pulsante di conferma
                },
                cancel: { 
                    label: '<span class="fa fa-times"></span> Annulla', // Etichetta e icona per il pulsante di annullamento
                    className: 'btn-secondary' // Stile per il pulsante di annullamento
                }
            },
            callback: function(result) { // Funzione di callback eseguita quando l'utente interagisce con la finestra
                if (result) { // Se l'utente clicca su "Conferma"
                    // Invia una richiesta DELETE al server per eliminare la serie TV specificata dall'ID
                    sendRequest("delete.php?id=" + id, () => {
                        bootbox.alert("Serie TV eliminata con successo."); // Mostra un messaggio di conferma all'utente
                        showSeriesList(); // Aggiorna l'elenco delle serie TV sulla pagina chiamando la funzione showSeriesList
                    }, "DELETE"); // Specifica il metodo HTTP DELETE per la richiesta
                }
            }
        });
    });
});






