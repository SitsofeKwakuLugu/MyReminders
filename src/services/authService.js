const STORAGE_KEY = "tasks_user";

export const authService = {
  login(email, password) {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!user || user.email !== email || user.password !== password) {
      throw new Error("Invalid credentials");
    }

    return { id: user.id, name: user.name, email: user.email };
  },

  signup({ name, email, password }) {
    const user = {
      id: Date.now(),
      name,
      email,
      password
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    return { id: user.id, name: user.name, email: user.email };
  },

  logout() {
    // no-op for now (token-based systems would invalidate tokens)
    return true;
  },

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!user) return null;

    return { id: user.id, name: user.name, email: user.email };
  }
};
