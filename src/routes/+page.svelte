<script lang="ts">
	import Papa from 'papaparse';

	let entries: Absence[] = $state([]);

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

	interface Absence {
		vorname: string;
		nachname: string;
		entschuldigt: number;
		unentschuldigt: number;
	}

	function handleFileUpload(event: Event) {
		const upload_element = event.target as HTMLInputElement;
		let entries_transformed: CsvRecordTransformed[] = [];

		if (upload_element && upload_element.files) {
			const file = upload_element.files[0];
			let csv: CsvRecord[];
			Papa.parse(file, {
				header: true,
				complete: (result) => {
					entries = [];
					csv = result.data as CsvRecord[];
					csv.forEach((entry) => {
						if (entry.Dauer) {
							const dauerString = entry.Dauer.split(' ');
							if (dauerString[1] == 'Stunden') {
								const hours_string = dauerString[0].split(':');
								const hours_in_minutes = Number(hours_string[0]) * 60;
								const minutes_in_minutes = Number(hours_string[1]);
								const dauer_in_school_hours = Math.floor(
									(hours_in_minutes + minutes_in_minutes) / 67
								);
								const entry_transformed: CsvRecordTransformed = {
									Dauer: dauer_in_school_hours,
									Name: entry.Name,
									Status: entry.Status
								};
								entries_transformed.push(entry_transformed);
							} else {
								const days = Number(dauerString[0]);
								const entry_transformed: CsvRecordTransformed = {
									Dauer: days * 4,
									Name: entry.Name,
									Status: entry.Status
								};
								entries_transformed.push(entry_transformed);
							}
						}
					});
					const names = new Set(
						entries_transformed.map((entry) => {
							return entry.Name;
						})
					);
					names.forEach((name) => {
						const entschuldigt: number = entries_transformed
							.filter((entry) => entry.Name == name && entry.Status == 'entschuldigt')
							.map((e) => e.Dauer)
							.reduce((acc, current) => acc + current, 0);
						const unentschuldigt: number = entries_transformed
							.filter((entry) => entry.Name == name && entry.Status == 'unentschuldigt')
							.map((e) => e.Dauer)
							.reduce((acc, current) => acc + current, 0);
						const name_splitted = name.split(' ');
						const vorname = name_splitted.slice(0, -1).join(' ');
						const nachname = name_splitted.slice(-1).toString();
						const absence: Absence = {
							vorname,
							nachname,
							entschuldigt,
							unentschuldigt
						};
						entries.push(absence);
					});
					handleSortNachname();
				},
				error: (error) => {
					console.log(error.message);
				}
			});
		}
	}

	function handleSortVorname() {
		entries.sort((a, b) => a.vorname.localeCompare(b.vorname));
	}

	function handleSortNachname() {
		entries.sort((a, b) => a.nachname.localeCompare(b.nachname));
	}

	function handleSortEntschuldigt() {
		entries.sort((a, b) => b.entschuldigt - a.entschuldigt);
	}

	function handleSortUnentschuldigt() {
		entries.sort((a, b) => b.unentschuldigt - a.unentschuldigt);
	}

	function handleSortGesamt() {
		entries.sort((a, b) => b.entschuldigt + b.unentschuldigt - (a.entschuldigt + a.unentschuldigt));
	}
</script>

<h1>ISABT: IServ-Abwesenheitstool</h1>
<p>Willkommen beim Upload-Tool für die Abwesenheitslisten. Befolgen Sie bitte folgende Schritte:</p>
<ol>
	<li>
		Exportieren Sie die gewünschte Abwesenheitsliste bei IServ
		(https://steinbart-gym.eu/iserv/absence/)
	</li>
	<li>Speichern Sie die Liste unter einem auffindbaren Namen auf Ihrem Gerät.</li>
	<li>
		Drücken Sie auf auf die Schaltfläche unten und wählen Sie die Abwesenheitsdatei (*.csv) von
		Ihrem Gerät aus.
	</li>
</ol>

<input type="file" accept=".csv" onchange={handleFileUpload} />

{#if entries.length > 0}
	<h2>Einträge</h2>
	<table>
		<thead>
			<tr>
				<th onclick={handleSortVorname}>Vorname</th>
				<th onclick={handleSortNachname}>Nachname</th>
				<th onclick={handleSortEntschuldigt}>Entschuldigt</th>
				<th onclick={handleSortUnentschuldigt}>Unentschuldigt</th>
				<th onclick={handleSortGesamt}>Gesamt</th>
			</tr>
		</thead>
		<tbody>
			{#each entries as entry}
				<tr>
					<td>{entry.vorname}</td>
					<td>{entry.nachname}</td>
					<td>{entry.entschuldigt}</td>
					<td>{entry.unentschuldigt}</td>
					<td>{entry.entschuldigt + entry.unentschuldigt}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

<style>
	th {
		cursor: pointer;
	}
</style>
