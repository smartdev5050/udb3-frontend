const EMAIL_REGEX: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;
const URL_REGEX: RegExp =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?!&\/=]*)$/;
const PHONE_REGEX: RegExp = /^[0-9\/\-_.+ ]{0,15}$/;

export { EMAIL_REGEX, PHONE_REGEX, URL_REGEX };
