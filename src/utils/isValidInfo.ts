const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
const PHONE_REGEX = /^[0-9\/\-_.+ ]{0,15}$/;

const isValidEmail = (email: string) => {
  return (
    typeof email === 'undefined' || email === '' || EMAIL_REGEX.test(email)
  );
};

const isValidUrl = (url: string) => {
  try {
    const urlObj = new URL(url);

    const urlRegex = new RegExp(/https?:\/\/(?:www\.)?[\w-]+\.[a-zA-Z]{2,}/);

    if (!urlRegex.test(urlObj.toString())) {
      throw new Error('not a valid url');
    }

    return true;
  } catch (e) {
    return false;
  }
};

const isValidPhone = (phone: string) => {
  return (
    typeof phone === 'undefined' || phone === '' || PHONE_REGEX.test(phone)
  );
};

const isValidInfo = (type: string, value: string): boolean => {
  if (value === '') return true;
  if (type === 'email') return isValidEmail(value);
  if (type === 'url') return isValidUrl(value);
  if (type === 'phone') return isValidPhone(value);
};

export { isValidEmail, isValidInfo, isValidPhone, isValidUrl };
