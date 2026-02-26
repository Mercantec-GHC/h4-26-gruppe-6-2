import { register } from '../api';

export const registerService = async (
  email: string,
  name: string,
  password: string,
  confirmPassword: string,
  setIsLoggedIn: (loggedIn: boolean) => void,
  setLoading: (loading: boolean) => void,
  alert: (msg: string) => void
) => {
  // Validation
  if (!email || !password || !confirmPassword || !name) {
    alert('Udfyld alle felter');
    return;
  }
  if (password !== confirmPassword) {
    alert('Adgangskoderne stemmer ikke overens');
    return;
  }
  setLoading(true);
  try {
    await register({
      email: email,
      username: name,
      password: password,
    });
    alert('Konto oprettet!');
    setIsLoggedIn(true);
  } catch (error) {
    alert('Kunne ikke oprette konto. Kontroller din forbindelse og prøv igen.');
  } finally {
    setLoading(false);
  }
};
