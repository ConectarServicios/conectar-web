const glyphs: Record<string, string> = { wifi: "⌁", play: "▶", security: "◇", business: "↔", server: "▤", software: "</>" };
export function ServiceAreaIcon({ icon }: Readonly<{ icon: string | null }>) {
  const glyph = icon && glyphs[icon.toLowerCase()] ? glyphs[icon.toLowerCase()] : "◆";
  return <span aria-hidden="true" className="grid size-12 place-items-center rounded-2xl bg-blue-950 text-lg font-black text-white">{glyph}</span>;
}
