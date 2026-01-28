import { FormEvent, useState } from 'react';
import { register as apiRegister } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();
	const navigate = useNavigate();

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			setLoading(true);
			const res = await apiRegister({ username, email, password });
			login(res.data.access_token);
			navigate('/admin');
		} catch (e: any) {
			setError(e?.response?.data?.message || e?.message || 'Error en registro');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page">
			<h2 style={{ marginBottom: 12 }}>Registrarse</h2>
			<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
				<label style={{ display: 'grid', gap: 4 }}>
					<span style={{ fontSize: 14 }}>Usuario</span>
					<input value={username} onChange={(e) => setUsername(e.target.value)} />
				</label>
				<label style={{ display: 'grid', gap: 4 }}>
					<span style={{ fontSize: 14 }}>Email</span>
					<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				</label>
				<label style={{ display: 'grid', gap: 4 }}>
					<span style={{ fontSize: 14 }}>Contraseña</span>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</label>
				<button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Registrarse'}</button>
				{error && <div style={{ color: 'red' }}>{error}</div>}
			</form>
		</div>
	);
}
