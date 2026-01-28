import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUser, updateUser, uploadProfile, User } from '../../api/users';

export default function Perfil() {
	const { user } = useAuth();
	const [data, setData] = useState<User | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	useEffect(() => {
		(async () => {
			try {
				if (!user) return;
				setLoading(true);
				const res = await getUser(user.id);
				setData(res.data);
			} catch (e: any) {
				setError(e?.response?.data?.message || e?.message || 'Error cargando perfil');
			} finally {
				setLoading(false);
			}
		})();
	}, [user?.id]);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!user || !data) return;
		try {
			setLoading(true);
			const payload = {
				nombre: data.nombre,
				apellido: data.apellido,
				telefono: data.telefono,
				direccion: data.direccion,
			};
			await updateUser(user.id, payload);
			if (file) {
				await uploadProfile(user.id, file);
			}
			const fresh = await getUser(user.id);
			setData(fresh.data);
		} catch (e: any) {
			setError(e?.response?.data?.message || e?.message || 'Error guardando perfil');
		} finally {
			setLoading(false);
		}
	};

	if (!user) return <div className="page">Debes iniciar sesión.</div>;
	if (loading && !data) return <div className="page">Cargando...</div>;
	if (error) return <div className="page" style={{ color: 'red' }}>{error}</div>;
	if (!data) return null;

	return (
		<div className="page" style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
			<h2>Mi Perfil</h2>
			<div>
				<b>Usuario:</b> {data.username} | <b>Rol:</b> {data.role}
			</div>
			<form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
				<label style={{ display: 'grid', gap: 4 }}>Nombre <input value={data.nombre || ''} onChange={(e) => setData({ ...data, nombre: e.target.value })} /></label>
				<label style={{ display: 'grid', gap: 4 }}>Apellido <input value={data.apellido || ''} onChange={(e) => setData({ ...data, apellido: e.target.value })} /></label>
				<label style={{ display: 'grid', gap: 4 }}>Teléfono <input value={data.telefono || ''} onChange={(e) => setData({ ...data, telefono: e.target.value })} /></label>
				<label style={{ display: 'grid', gap: 4 }}>Dirección <input value={data.direccion || ''} onChange={(e) => setData({ ...data, direccion: e.target.value })} /></label>
				<label style={{ display: 'grid', gap: 4 }}>
					<span style={{ fontSize: 14 }}>Foto de perfil</span>
					<input type="file" accept="image/png,image/jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
				</label>
				<button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
			</form>
		</div>
	);
}
