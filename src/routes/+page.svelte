<script lang="ts">
    import Papa from "papaparse";

    interface CsvRecord {
        Abwesenheitszeit: string,
        "Aktualisiert am": string,
        Dauer: string,
        "Klasse/Information": string,
        Name: string,
        Status: string
    }

    function handleFileUpload(event: Event) {
        const upload_element = event.target as HTMLInputElement;
        if (upload_element && upload_element.files) {
            const file = upload_element.files[0];
            let csv: CsvRecord[];
            Papa.parse(file, {
                header: true,
                complete: (result) => {
                    csv = result.data;
                    csv.forEach(entry => {
                        entry.Dauer = 1
                    });
                    console.log(csv)
                },
                error: (error) => {
                    console.log(error.message)
                }
            });
        }
    }
</script>

<h1>ISABT: IServ Abwesenheitstool</h1>
<h2>Workflow</h2>
<ol>
    <li>CSV hochladen</li>
    <li>CSV verarbeiten</li>
    <li>Daten abspeichern</li>
    <li>Daten laden</li>
    <li>In Tabelle anzeigen</li>
    <li>Sortier- und Filterbar</li>
</ol>

<input type="file" accept=".csv" on:change={handleFileUpload} />