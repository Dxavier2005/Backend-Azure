import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLibro, Libro } from '../../api/libros';

export default function DetalleLibro() {
	const { id } = useParams();
	const [libro, setLibro] = useState<Libro | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		(async () => {
			try {
				setLoading(true);
				const res = await getLibro(id);
				setLibro(res.data);
			} catch (e: any) {
				setError(e?.message || 'Error cargando libro');
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	if (loading) return <div className="page">Cargando...</div>;
	if (error) return <div className="page" style={{ color: 'red' }}>{error}</div>;
	if (!libro) return null;

	return (
		<div className="page">
			<h2>{libro.titulo}</h2>
			{libro.autor && <p style={{ marginTop: 8 }}>Autor: {libro.autor}</p>}
			<p style={{ marginTop: 4 }}>Disponibles: {libro.cantidad_disponible}</p>
		</div>
	);
}
