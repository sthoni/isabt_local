<script lang="ts">
	import Papa from 'papaparse';

    let entries: CsvRecordTransformed[] = $state([]);

	interface CsvRecord {
		Abwesenheitszeit: string;
		'Aktualisiert am': string;
		Dauer: string;
		'Klasse/Information': string;
		Name: string;
		Status: string;
	}

	interface CsvRecordTransformed {
		Dauer: number;
		Name: string;
		Status: string;
	}

	function handleFileUpload(event: Event) {
		const upload_element = event.target as HTMLInputElement;
        let entries_transformed: CsvRecordTransformed[] = []

		if (upload_element && upload_element.files) {
			const file = upload_element.files[0];
			let csv: CsvRecord[];
			Papa.parse(file, {
				header: true,
				complete: (result) => {
					csv = result.data as CsvRecord[];
					csv.forEach((entry) => {
                        if (entry.Dauer) {
                            const dauerString = entry.Dauer.split(' ');
						if (dauerString[1] == 'Stunden') {
							const hours_string = dauerString[0].split(':');
							const hours_in_minutes = Number(hours_string[0]) * 60;
							const minutes_in_minutes = Number(hours_string[1]);
							const dauer_in_school_hours = Math.floor((hours_in_minutes + minutes_in_minutes) / 67);
							const entry_transformed: CsvRecordTransformed = {
                                 Dauer: dauer_in_school_hours,
                                 Name: entry.Name,
                                 Status: entry.Status
                            }
                            entries_transformed.push(entry_transformed);
						}
                        else {
                            const days = Number(dauerString[0]);
                            const entry_transformed: CsvRecordTransformed = {
                                 Dauer: (days * 4),
                                 Name: entry.Name,
                                 Status: entry.Status
                            }
                            entries_transformed.push(entry_transformed);
                        }
                        }
					});
				},
				error: (error) => {
					console.log(error.message);
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

{#if entries.length > 0}
<h2>Einträge</h2>
    <ol>
        {#each entries as entry}
            <li>{entry.Name}: {entry.Dauer}</li>
        {/each}
    </ol>
{/if}

<input type="file" accept=".csv" onchange={handleFileUpload} />
