export type ContactInformation = {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  commercial_email: string | null;
  address: string | null;
  business_hours: string | null;
  guard_hours: string | null;
};

export type ContactInformationActionState = {
  message?: string;
  success?: boolean;
  fieldErrors?: Partial<Record<Exclude<keyof ContactInformation, "id">, string>>;
};
