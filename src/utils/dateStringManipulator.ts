export function generateDateTimeString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:00`;

  return dateTimeString;
}

export function ISODateToLocal(isoDateTime: string): string {
  return `${isoDateTime.slice(8, 10)}/${isoDateTime.slice(5, 7)}/${isoDateTime.slice(0, 4)}`;
}

export function ISOTimeToLocal(isoDateTime: string): string {
  return isoDateTime.slice(11, -3);
}
