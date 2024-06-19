export function formatDateTime(date: Date) {
  // Extract the components of the date
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getFullYear();

  // Extract the time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format the date as yyyy-mm-dd
  const formattedDate = `${year}-${month}-${day}`;

  // Format the time as HH:MM
  const formattedTime = `${hours}:${minutes}`;

  // Combine date and time in the required format
  return `${formattedDate}T${formattedTime}`;
}
