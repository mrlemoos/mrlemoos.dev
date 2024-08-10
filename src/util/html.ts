export function setDocumentTitle(title: string): void {
	if (typeof window === 'undefined') {
		return;
	}

	document.title = title;
}
