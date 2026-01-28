import { FormEvent, useState } from 'react';
import { login as apiLogin } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [username, setUsername] = useState('');
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
			const res = await apiLogin(username, password);
			login(res.data.access_token);
			navigate('/admin');
		} catch (e: any) {
			setError(e?.response?.data?.message || e?.message || 'Error en login');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page">
			<h2 style={{ marginBottom: 12 }}>Ingresar</h2>
			<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
				<label style={{ display: 'grid', gap: 4 }}>
					<span style={{ fontSize: 14 }}>Usuario</span>
					<input value={username} onChange={(e) => setUsername(e.target.value)} />
				</label>
				<label style={{ display: 'grid', gap: 4 }}>
					<span style={{ fontSize: 14 }}>Contraseña</span>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</label>
				<button type="submit" disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
				{error && <div style={{ color: 'red' }}>{error}</div>}
			</form>
		</div>
	);
}
