// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import Editor from './TextMatchEditor.svelte';
import { exportVideo, loadProjectFonts } from '../../lib/text-match/render';
import { loadGoogleFont } from '../../lib/text-match/fonts';
import type { FontResource } from '../../lib/text-match/project';
import { createProject } from '../../lib/text-match/project';
vi.mock('../../lib/text-match/render', () => ({ renderFrame: vi.fn(() => ({ fits: true })), loadProjectFonts: vi.fn(async () => {}), exportVideo: vi.fn(async () => new Blob(['video'], { type: 'video/webm' })) }));
vi.mock('../../lib/text-match/fonts', () => ({ fetchFontCatalogue: vi.fn(async () => ['Test Serif']), loadGoogleFont: vi.fn() }));
beforeEach(() => {
  vi.clearAllMocks();
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value), clear: () => storage.clear() });
});
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe('Text Match editor workflow', () => {
  it('selects and saves a theme with the keyboard and closes with Escape', async () => {
    render(Editor);
    const theme = screen.getByRole('combobox', { name: 'Theme' });
    expect(theme.tagName).toBe('BUTTON');
    theme.focus();
    await fireEvent.keyDown(theme, { key: 'ArrowDown' });
    await screen.findByRole('listbox');
    await fireEvent.keyDown(theme, { key: 'End' });
    await fireEvent.keyDown(theme, { key: 'Enter' });
    await waitFor(() => expect(localStorage.getItem('text-match-theme')).toBe('dark'));
    await fireEvent.keyDown(theme, { key: 'ArrowDown' });
    await screen.findByRole('listbox');
    await fireEvent.keyDown(theme, { key: 'Escape' });
    await waitFor(() => expect(theme).toHaveAttribute('aria-expanded', 'false'));
    expect(localStorage.getItem('text-match-theme')).toBe('dark');
  });
  it('switches print presets with arrow keys', async () => {
    render(Editor);
    const newspaper = screen.getByRole('radio', { name: /newspaper/i });
    newspaper.focus();
    await fireEvent.keyDown(newspaper, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByRole('radio', { name: /book/i })).toHaveAttribute('aria-checked', 'true'));
    expect(JSON.parse(localStorage.getItem('text-match-draft-v1')!).preset).toBe('book');
  });
  it('moves focus between sections with arrow keys', async () => {
    render(Editor);
    const timing = screen.getByRole('button', { name: /^Timing & framing/ });
    timing.focus();
    await fireEvent.keyDown(timing, { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: /^Font & colour/ })).toHaveFocus();
  });
  it('reloads the selected font when choosing a previously unavailable weight', async () => {
    localStorage.setItem('text-match-draft-v1', JSON.stringify({ ...createProject(), fontFamily: 'Test Serif', fonts: [{ family: 'Test Serif', weight: 700, data: 'data:font/ttf;base64,YQ==', licence: 'Test licence' }] }));
    vi.mocked(loadGoogleFont).mockResolvedValueOnce({ family: 'Test Serif', weight: 800, data: 'data:font/ttf;base64,YQ==', licence: 'Test licence' });
    render(Editor);
    await waitFor(() => expect(screen.getByText('Play preview')).not.toBeDisabled());
    await fireEvent.click(screen.getByText('Font & colour'));
    vi.mocked(loadProjectFonts).mockRejectedValueOnce(new Error('Selected weight unavailable.'));
    await fireEvent.change(screen.getByLabelText('Weight'), { target: { value: '800' } });
    await waitFor(() => expect(screen.getByText('Play preview')).toBeDisabled());
    await fireEvent.focus(screen.getByLabelText('Font'));
    await fireEvent.pointerUp(await screen.findByRole('option', { name: 'Test Serif' }), { pointerType: 'mouse' });
    await waitFor(() => expect(loadGoogleFont).toHaveBeenCalledWith('Test Serif', 800));
    await waitFor(() => expect(screen.getByText('Play preview')).not.toBeDisabled());
  });
  it('selects fonts with the keyboard and dismisses choices with Escape', async () => {
    vi.mocked(loadGoogleFont).mockResolvedValueOnce({ family: 'Test Serif', weight: 700, data: 'data:font/ttf;base64,YQ==', licence: 'Test licence' });
    render(Editor);
    await fireEvent.click(screen.getByText('Font & colour'));
    const font = screen.getByRole('combobox', { name: 'Font' });
    await fireEvent.keyDown(font, { key: 'ArrowDown' });
    expect(await screen.findByRole('listbox')).toBeVisible();
    await fireEvent.input(font, { target: { value: 'Test Serif' } });
    await screen.findByRole('option', { name: 'Test Serif' });
    await fireEvent.keyDown(font, { key: 'ArrowDown' });
    await fireEvent.keyDown(font, { key: 'Enter' });
    await waitFor(() => expect((font as HTMLInputElement).value).toBe('Test Serif'));
    expect(JSON.parse(localStorage.getItem('text-match-draft-v1')!).fontFamily).toBe('Test Serif');
    await fireEvent.keyDown(font, { key: 'ArrowDown' });
    await fireEvent.keyDown(font, { key: 'Escape' });
    await waitFor(() => expect(font).toHaveAttribute('aria-expanded', 'false'));
  });
  it('loads font choices from search without a separate provider button', async () => {
    render(Editor);
    expect(screen.queryByText('Browse Google Fonts')).toBeNull();
    await fireEvent.click(screen.getByText('Font & colour'));
    await fireEvent.focus(screen.getByLabelText('Font'));
    expect(await screen.findByText('Test Serif')).toBeTruthy();
  });
  it('recovers a draft and preserves it when reset is cancelled', async () => {
    localStorage.setItem('text-match-draft-v1', JSON.stringify({ ...createProject(), phrase: 'Recovered phrase' }));
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    render(Editor);
    expect((await screen.findByLabelText('Word or phrase') as HTMLTextAreaElement).value).toBe('Recovered phrase');
    await fireEvent.click(screen.getByText('Project'));
    await fireEvent.click(screen.getByText('Reset project…'));
    expect((screen.getByLabelText('Word or phrase') as HTMLTextAreaElement).value).toBe('Recovered phrase');
  });
  it('blocks playback and export when selected fonts cannot load', async () => {
    vi.mocked(loadProjectFonts).mockRejectedValueOnce(new Error('Font could not load.'));
    render(Editor);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Font could not load.'));
    expect(screen.getByText('Play preview')).toBeDisabled();
    expect(screen.getByText('Export video')).toBeDisabled();
  });
  it('accepts a second local font and restores readiness after a missing weight', async () => {
    render(Editor);
    await waitFor(() => expect(screen.getByText('Play preview')).not.toBeDisabled());
    await fireEvent.click(screen.getByText('Font & colour'));
    await fireEvent.click(screen.getByLabelText('I have permission to embed these fonts in project files.'));
    await fireEvent.change(screen.getByLabelText('Upload font'), { target: { files: [new File(['font one'], 'Lora.ttf')] } });
    await waitFor(() => expect((screen.getByLabelText('Font') as HTMLSelectElement).value).toBe('Lora'));
    vi.mocked(loadProjectFonts).mockRejectedValueOnce(new Error('Selected weight unavailable.'));
    await fireEvent.change(screen.getByLabelText('Weight'), { target: { value: '800' } });
    await waitFor(() => expect(screen.getByText('Play preview')).toBeDisabled());
    expect(loadGoogleFont).not.toHaveBeenCalled();
    await fireEvent.change(screen.getByLabelText('Upload font'), { target: { files: [new File(['font two'], 'Second.ttf')] } });
    await waitFor(() => expect((screen.getByLabelText('Font') as HTMLSelectElement).value).toBe('Second'));
    expect(screen.getByText('Play preview')).not.toBeDisabled();
    expect(JSON.parse(localStorage.getItem('text-match-draft-v1')!).fonts).toHaveLength(2);
  });
  it('ignores a Google font download completed after reset', async () => {
    let complete!: (font: FontResource) => void;
    vi.mocked(loadGoogleFont).mockImplementationOnce(() => new Promise((resolve) => { complete = resolve; }));
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(Editor);
    await waitFor(() => expect(screen.getByLabelText('Font')).not.toBeDisabled());
    await fireEvent.click(screen.getByText('Font & colour'));
    await fireEvent.focus(screen.getByLabelText('Font'));
    await fireEvent.pointerUp(await screen.findByRole('option', { name: 'Test Serif' }), { pointerType: 'mouse' });
    await waitFor(() => expect(complete).toBeTypeOf('function'));
    await fireEvent.click(screen.getByText('Reset project…'));
    complete({ family: 'Test Serif', weight: 700, data: 'data:font/ttf;base64,YQ==', licence: 'Test licence' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    await waitFor(() => expect(screen.queryByText('Loading fonts…')).toBeNull());
    expect((screen.getByLabelText('Font') as HTMLSelectElement).value).toBe('Georgia');
    expect(screen.getByText('Play preview')).not.toBeDisabled();
  });
  it('rejects Google fonts exceeding project limits before changing the draft', async () => {
    const fonts = Array.from({ length: 12 }, (_, index) => ({ family: `Font ${index}`, weight: 700, data: 'data:font/ttf;base64,YQ==', licence: 'Test licence' }));
    localStorage.setItem('text-match-draft-v1', JSON.stringify({ ...createProject(), fonts }));
    vi.mocked(loadGoogleFont).mockResolvedValueOnce({ family: 'Test Serif', weight: 700, data: 'data:font/ttf;base64,YQ==', licence: 'Test licence' });
    render(Editor);
    await waitFor(() => expect(screen.getByLabelText('Font')).not.toBeDisabled());
    await fireEvent.click(screen.getByText('Font & colour'));
    await fireEvent.focus(screen.getByLabelText('Font'));
    await fireEvent.pointerUp(await screen.findByRole('option', { name: 'Test Serif' }), { pointerType: 'mouse' });
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Invalid project settings'));
    expect((screen.getByLabelText('Font') as HTMLSelectElement).value).toBe('Georgia');
    expect(JSON.parse(localStorage.getItem('text-match-draft-v1')!).fonts).toHaveLength(12);
    expect(loadProjectFonts).toHaveBeenCalledTimes(1);
  });
  it('locks editing during export while keeping cancellation available', async () => {
    vi.mocked(exportVideo).mockImplementationOnce((_project, _progress, signal) => new Promise((_resolve, reject) => {
      signal?.addEventListener('abort', () => reject(new Error('Export cancelled.')), { once: true });
    }));
    render(Editor);
    const button = screen.getByText('Export video');
    await waitFor(() => expect(button).not.toBeDisabled());
    await fireEvent.click(button);
    await waitFor(() => expect(exportVideo).toHaveBeenCalledTimes(1));
    expect(screen.getByLabelText('Word or phrase')).toBeDisabled();
    expect(screen.getByLabelText('Weight')).toBeDisabled();
    expect(screen.getByLabelText('Upload font')).toBeDisabled();
    expect(screen.getByLabelText('Import project')).toBeDisabled();
    expect(screen.getByText('Reset project…')).toBeDisabled();
    expect(screen.getByText('Cancel export')).not.toBeDisabled();
    await fireEvent.click(screen.getByText('Cancel export'));
    await waitFor(() => expect(screen.getByLabelText('Word or phrase')).not.toBeDisabled());
  });
  it('keeps completed exports available until the project changes', async () => {
    vi.stubGlobal('URL', class extends URL { static createObjectURL() { return 'blob:test'; } static revokeObjectURL() {} });
    render(Editor);
    const button = screen.getByText('Export video');
    await waitFor(() => expect(button).not.toBeDisabled());
    await fireEvent.click(button);
    expect(await screen.findByText('Download video')).toBeTruthy();
    await fireEvent.input(screen.getByLabelText('Word or phrase'), { target: { value: 'New edit' } });
    await waitFor(() => expect(screen.queryByText('Download video')).toBeNull());
  });
  it('rejects invalid imports without replacing the current phrase', async () => {
    render(Editor);
    await fireEvent.input(screen.getByLabelText('Word or phrase'), { target: { value: 'Keep this phrase' } });
    const file = new File(['{}'], 'bad.json', { type: 'application/json' });
    Object.defineProperty(file, 'text', { value: async () => '{}' });
    await fireEvent.change(screen.getByLabelText('Import project'), { target: { files: [file] } });
    await waitFor(() => expect(screen.getByRole('alert').textContent).toContain('Current draft preserved'));
    expect((screen.getByLabelText('Word or phrase') as HTMLTextAreaElement).value).toBe('Keep this phrase');
  });
});
