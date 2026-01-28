import { useEffect, useState } from 'react';
import { listLibros } from '../../api/libros';
import { listCategorias } from '../../api/categorias';
import type { Libro, Pagination } from '../../api/libros';
import type { Categoria } from '../../api/categorias';
import { Link } from 'react-router-dom';

export default function CatalogoLibros() {
	const [data, setData] = useState<Pagination<Libro> | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [categorias, setCategorias] = useState<Categoria[]>([]);
	const [categoriaId, setCategoriaId] = useState<string>('');

	const load = async () => {
		try {
			setLoading(true);
			const res = await listLibros({ page, limit: 10, search: search || undefined, searchField: search ? 'titulo' : undefined });
			setData(res.data);
		} catch (e: any) {
			setError(e?.message || 'Error cargando libros');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	useEffect(() => {
		(async () => {
			try {
				const res = await listCategorias({ page: 1, limit: 100 });
				setCategorias(res.data.items);
			} catch {}
		})();
	}, []);

	const meta = data?.meta;
	const totalPages = meta?.totalPages ?? 1;
	const currentPage = meta?.currentPage ?? page;
	const canGoNext = meta ? meta.currentPage < meta.totalPages : false;
	const canGoPrev = page > 1;

	if (loading) return <div className="page">Cargando...</div>;
	if (error) return <div className="page" style={{ color: 'red' }}>{error}</div>;

	return (
		<div className="page">
			<h2>Catálogo</h2>
			<div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
				<input style={{ maxWidth: 220 }} placeholder="Buscar por título" value={search} onChange={(e) => setSearch(e.target.value)} />
				<button onClick={() => { setPage(1); load(); }}>Buscar</button>
				<select style={{ maxWidth: 220 }} value={categoriaId} onChange={(e) => { setCategoriaId(e.target.value); }}>
					<option value="">Todas las categorías</option>
					{categorias.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
				</select>
			</div>
			<ul style={{ display: 'grid', gap: 8, padding: 0, listStyle: 'none' }}>
				{data?.items
				?.filter((l: Libro) => !categoriaId || l.categoria_id === categoriaId)
				?.map((l: Libro) => (
					<li key={l.id}>
						<Link to={`/libros/${l.id}`}>{l.titulo}</Link> {l.autor && `- ${l.autor}`} (Disp: {l.cantidad_disponible})
					</li>
				))}
			</ul>
			<div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
				<button disabled={!canGoPrev} onClick={() => setPage((p) => p - 1)}>Anterior</button>
				<span>Página {currentPage} de {meta ? totalPages : '-'} </span>
				<button disabled={!canGoNext} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
			</div>
		</div>
	);
}
