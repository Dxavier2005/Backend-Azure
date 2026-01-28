import { useEffect, useState } from 'react';
import { createLibro, deleteLibro, listLibros, Libro, updateLibro, Pagination } from '../../api/libros';
import { useAuth } from '../../context/AuthContext';

export default function LibrosAdmin() {
	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';

	const [items, setItems] = useState<Libro[]>([]);
	const [meta, setMeta] = useState<Pagination<Libro>["meta"] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<Partial<Libro>>({ titulo: '', autor: '', cantidad_disponible: 1 });
	const [editingId, setEditingId] = useState<string | null>(null);

	const [page, setPage] = useState(1);

	const load = async () => {
		try {
			setLoading(true);
			const res = await listLibros({ page, limit: 10 });
			setItems(res.data.items);
			setMeta(res.data.meta);
		} catch (e: any) {
			setError(e?.message || 'Error cargando libros');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, [page]);

	const save = async () => {
		try {
			setLoading(true);
			if (editingId) {
				await updateLibro(editingId, form);
			} else {
				await createLibro(form);
			}
			setForm({ titulo: '', autor: '', cantidad_disponible: 1 });
			setEditingId(null);
			await load();
		} catch (e: any) {
			setError(e?.response?.data?.message || e?.message || 'Error guardando');
		} finally {
			setLoading(false);
		}
	};

	const remove = async (id: string) => {
		try {
			setLoading(true);
			await deleteLibro(id);
			await load();
		} catch (e: any) {
			setError(e?.response?.data?.message || e?.message || 'Error eliminando');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page">
			<h2>Libros</h2>
			{loading && <div style={{ color: '#444' }}>Cargando...</div>}
			{error && <div style={{ color: 'red' }}>{error}</div>}

			{isAdmin && (
				<div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
					<input placeholder="Título" value={form.titulo as string} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
					<input placeholder="Autor" value={(form.autor as string) || ''} onChange={(e) => setForm({ ...form, autor: e.target.value })} />
					<input type="number" placeholder="Cantidad" value={form.cantidad_disponible as number} onChange={(e) => setForm({ ...form, cantidad_disponible: Number(e.target.value) })} />
					<button onClick={save}>{editingId ? 'Actualizar' : 'Crear'}</button>
				</div>
			)}

			<ul style={{ display: 'grid', gap: 8, marginTop: 12, padding: 0, listStyle: 'none' }}>
				{items.map((it) => (
					<li key={it.id}>
						<b>{it.titulo}</b> {it.autor && `- ${it.autor}`} (Disp: {it.cantidad_disponible})
						{isAdmin && (
							<>
								<button onClick={() => { setEditingId(it.id); setForm({ titulo: it.titulo, autor: it.autor, cantidad_disponible: it.cantidad_disponible }); }}>Editar</button>
								<button onClick={() => remove(it.id)}>Eliminar</button>
							</>
						)}
					</li>
				))}
			</ul>
			<div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
				<button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</button>
				<span>Página {meta?.currentPage ?? page} de {meta?.totalPages ?? '-'}</span>
				<button disabled={meta ? meta.currentPage >= meta.totalPages : true} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
			</div>
		</div>
	);
}
