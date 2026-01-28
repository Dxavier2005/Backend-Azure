import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const linkStyle = ({ isActive }: { isActive: boolean }) => ({ fontWeight: isActive ? 'bold' : undefined });

	return (
		<nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd', alignItems: 'center', background: '#fff' }}>
			<Link to="/">Biblioteca</Link>
			<NavLink to="/catalogo" style={linkStyle}>Catálogo</NavLink>
			<NavLink to="/contacto" style={linkStyle}>Contacto</NavLink>
			{isAuthenticated ? (
				<>
					<NavLink to="/admin" style={linkStyle}>Admin</NavLink>
					<NavLink to="/perfil" style={linkStyle}>Mi Perfil</NavLink>
					{user?.role === 'admin' && (
						<>
							<NavLink to="/admin/libros" style={linkStyle}>Libros</NavLink>
							<NavLink to="/admin/categorias" style={linkStyle}>Categorías</NavLink>
						</>
					)}
					<span style={{ marginLeft: 'auto' }}>Hola, {user?.username}</span>
					<button onClick={handleLogout}>Salir</button>
				</>
			) : (
				<>
					<NavLink to="/login" style={({ isActive }) => ({ ...linkStyle({ isActive }), marginLeft: 'auto' })}>Ingresar</NavLink>
					<NavLink to="/register" style={linkStyle}>Registro</NavLink>
				</>
			)}
		</nav>
	);
}
