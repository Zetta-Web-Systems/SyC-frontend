export function getUserInitials(
  email: string,
  firstName?: string,
  lastName?: string,
): string {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  if (firstName) return firstName.charAt(0).toUpperCase();

  return email.charAt(0).toUpperCase();
}

export function getDisplayName(
  email: string,
  firstName?: string,
  lastName?: string,
): string {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  return email.split("@")[0];
}
