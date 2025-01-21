import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Papa from 'papaparse';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type Absence = {
	vorname: string;
	nachname: string;
	entschuldigt: number;
	unentschuldigt: number;
}

export type CsvRecord = {
	Abwesenheitszeit: string;
	'Aktualisiert am': string;
	Dauer: string;
	'Klasse/Information': string;
	Name: string;
	Status: string;
}

export type CsvRecordTransformed = {
	Dauer: number;
	Name: string;
	Status: string;
}

export function parseCsv(result: Papa.ParseResult<unknown>) {
	let entries: Absence[] = [];
	let entries_transformed: CsvRecordTransformed[] = [];
	let csv: CsvRecord[];
	csv = result.data as CsvRecord[];
	csv.forEach((entry) => {
		entries_transformed.push(...parseEntry(entry));
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
	return entries;
}

export function parseEntry(entry: CsvRecord) {
	let entries_transformed: CsvRecordTransformed[] = []
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

	return entries_transformed;
}