type TechnologyLogoName = "linux" | "windows" | "cisco" | "vmware" | "wazuh" | "hikvision";

interface TechnologyLogoProps {
  name: TechnologyLogoName;
}

const logoPaths: Record<TechnologyLogoName, React.ReactNode> = {
  linux: (
    <>
      <ellipse cx="12" cy="13.5" rx="6.2" ry="7.8" fill="currentColor" opacity=".16" />
      <path d="M8.2 10.2c.1-4.4 1.4-7 3.8-7s3.7 2.6 3.8 7c2.1 1.8 3.2 4.2 3 7.1-1.5-.1-2.8-.7-3.8-1.7-.6 2.7-1.6 4.4-3 4.4s-2.4-1.7-3-4.4c-1 1-2.3 1.6-3.8 1.7-.2-2.9.9-5.3 3-7.1Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="10.2" cy="8" r=".8" fill="currentColor" />
      <circle cx="13.8" cy="8" r=".8" fill="currentColor" />
      <path d="m10 10.3 2-1 2 1-2 1.4-2-1.4Z" fill="currentColor" />
    </>
  ),
  windows: (
    <path d="M3 4.6 10.6 3v8H3V4.6Zm8.6-1.8L21 1v10h-9.4V2.8ZM3 12h7.6v8L3 18.5V12Zm8.6 0H21v10l-9.4-1.8V12Z" fill="currentColor" />
  ),
  cisco: (
    <>
      <path d="M3 11v2m3-5v8m3-11v14m3-16v18m3-16v14m3-11v8m3-5v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M5 19.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".45" />
    </>
  ),
  vmware: (
    <>
      <rect x="3" y="6" width="10" height="10" rx="2.7" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="11" y="8" width="10" height="10" rx="2.7" fill="none" stroke="currentColor" strokeWidth="2" />
    </>
  ),
  wazuh: (
    <>
      <path d="M12 2.5 20 6v5.7c0 4.8-3.1 8.3-8 9.8-4.9-1.5-8-5-8-9.8V6l8-3.5Z" fill="currentColor" opacity=".14" />
      <path d="M5.5 8.3 8.4 17l3.6-6 3.6 6 2.9-8.7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  hikvision: (
    <>
      <path d="M3 6v12m18-12v12M3 12h18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3.4" fill="currentColor" opacity=".18" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </>
  ),
};

export function TechnologyLogo({ name }: TechnologyLogoProps) {
  return (
    <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
      {logoPaths[name]}
    </svg>
  );
}
