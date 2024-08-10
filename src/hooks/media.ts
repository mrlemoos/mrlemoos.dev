/**
 * Custom hook for playing sound media in the browser. The volume level is
 * adjustable. Default is 1.
 */
export function useSoundMedia({
	soundPath,
	volume = 1,
}: {
	soundPath: string;
	volume?: number;
}) {
	const audio = new Audio(soundPath);
	audio.volume = volume;

	function playSoundEffect() {
		audio.play();
	}

	return {
		playSoundEffect,
	};
}
