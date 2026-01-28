import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home';
import CatalogoLibros from './pages/public/CatalogoLibros';
import DetalleLibro from './pages/public/DetalleLibro';
import Contacto from './pages/public/Contacto';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/admin/Dashboard';
import LibrosAdmin from './pages/admin/LibrosAdmin';
import CategoriasAdmin from './pages/admin/CategoriasAdmin';
import Perfil from './pages/private/Perfil';

export default function App() {
	return (
		<div>
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/catalogo" element={<CatalogoLibros />} />
				<Route path="/libros/:id" element={<DetalleLibro />} />
				<Route path="/contacto" element={<Contacto />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />

				<Route element={<ProtectedRoute />}>
					<Route path="/admin" element={<Dashboard />} />
					<Route path="/perfil" element={<Perfil />} />
				</Route>

				<Route element={<ProtectedRoute roles={["admin"]} />}>
					<Route path="/admin/libros" element={<LibrosAdmin />} />
					<Route path="/admin/categorias" element={<CategoriasAdmin />} />
				</Route>

				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</div>
	);
}
