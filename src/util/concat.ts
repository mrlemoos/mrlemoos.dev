function concat(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default concat;
