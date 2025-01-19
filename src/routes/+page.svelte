<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import TypographyH1 from '$lib/components/TypographyH1.svelte';
	import TypographyP from '$lib/components/TypographyP.svelte';
	import TypographyList from '$lib/components/TypographyList.svelte';
	import { ArrowDown10, ArrowDownAZ } from 'lucide-svelte';
	import { parseCsv, type Absence } from '$lib/utils';
	import Papa from 'papaparse';
	import TypographyH2 from '$lib/components/TypographyH2.svelte';

	let entries: Absence[] = $state([]);

	function handleFileUpload(event: Event) {
		const upload_element = event.target as HTMLInputElement;

		if (upload_element && upload_element.files) {
			const file = upload_element.files[0];
			Papa.parse(file, {
				header: true,
				complete: (result) => {
					entries = parseCsv(result);
					localStorage.setItem(`Upload am ${Date.now().toString()}`, JSON.stringify(entries));
					handleSortVorname();
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

<div>
	<TypographyH1>IServ-Abwesenheitstool</TypographyH1>
	<TypographyP
		>Mit diesem kleinen Tool können Sie Abwesenheitslisten aus IServ schnell zusammenfassen. Damit
		erhalten Sie einen einfachen Überblick über die Fehlzeiten Ihrer Schülerinnen und Schüler.</TypographyP
	>
	<TypographyP>Es gilt wie bei der Lottoziehung: <b>Alle Angaben ohne Gewähr</b>.</TypographyP>
</div>

<div class="mt-12">
	<TypographyH2>CSV-Upload</TypographyH2>
	<TypographyList>
		<li>
			Exportieren Sie die gewünschte Abwesenheitsliste bei <a
				href="https://steinbart-gym.eu/iserv/absence/"
				class="underline">IServ</a
			>. Das Schuljahr begann am Mittwoch, den 21.08.2024.
		</li>
		<li>Speichern Sie die Liste unter einem auffindbaren Namen auf Ihrem Gerät.</li>
		<li>
			Drücken Sie auf auf die Schaltfläche unten und wählen Sie die Abwesenheitsdatei (*.csv) von
			Ihrem Gerät aus. Wenn alles in Ordnung ist, erscheint sofort eine Tabelle mit den Schülerinnen
			und Schülern.
		</li>
		<li>
			Klicken Sie in der Tabelle auf die Überschriften der Spalten, um nach der Größe zu sortieren.
		</li>
	</TypographyList>
	<div class="grid w-full max-w-sm items-center gap-1.5">
		<Label class="text-2xl font-bold" for="abwesenheitscsv">CSV-Datei hochladen</Label>
		<Input onchange={handleFileUpload} id="abwesenheitscsv" type="file" accept=".csv" />
	</div>
</div>

<div class="mt-12">
	{#if entries.length > 0}
		<TypographyH2>Einträge</TypographyH2>
		<Table.Root>
			<Table.Caption>Liste mit Fehlzeiten</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head onclick={handleSortVorname} class="cursor-pointer hover:bg-slate-200"
						><ArrowDownAZ /> Vorname</Table.Head
					>
					<Table.Head onclick={handleSortNachname} class="cursor-pointer hover:bg-slate-200"
						><ArrowDownAZ /> Nachname</Table.Head
					>
					<Table.Head onclick={handleSortEntschuldigt} class="cursor-pointer hover:bg-slate-200"
						><ArrowDown10 /> Entschuldigt</Table.Head
					>
					<Table.Head onclick={handleSortUnentschuldigt} class="cursor-pointer hover:bg-slate-200"
						><ArrowDown10 /> Unentschuldigt</Table.Head
					>
					<Table.Head onclick={handleSortGesamt} class="cursor-pointer hover:bg-slate-200"
						><ArrowDown10 /> Gesamt</Table.Head
					>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each entries as entry}
					<Table.Row>
						<Table.Cell>{entry.vorname}</Table.Cell>
						<Table.Cell>{entry.nachname}</Table.Cell>
						<Table.Cell>{entry.entschuldigt}</Table.Cell>
						<Table.Cell>{entry.unentschuldigt}</Table.Cell>
						<Table.Cell>{entry.entschuldigt + entry.unentschuldigt}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	{/if}
</div>
