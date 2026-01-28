import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type User = {
	id: string;
	username?: string;
	role?: string;
	nombre?: string;
	apellido?: string;
	telefono?: string;
	direccion?: string;
};

type AuthContextValue = {
	token: string | null;
	user: User | null;
	isAuthenticated: boolean;
	login: (token: string) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'token';

function decodeUser(jwt: string): User | null {
	try {
		const payload = JSON.parse(atob(jwt.split('.')[1] || ''));
		return {
			id: payload.sub,
			username: payload.username || payload.email,
			role: payload.role,
		};
	} catch {
		return null;
	}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
	const [user, setUser] = useState<User | null>(() => (token ? decodeUser(token) : null));

	useEffect(() => {
		if (token) {
			localStorage.setItem(TOKEN_KEY, token);
			setUser(decodeUser(token));
		} else {
			localStorage.removeItem(TOKEN_KEY);
			setUser(null);
		}
	}, [token]);

	const value = useMemo<AuthContextValue>(() => ({
		token,
		user,
		isAuthenticated: Boolean(token),
		login: (tk: string) => setToken(tk),
		logout: () => setToken(null),
	}), [token, user]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
	return ctx;
}
