import { useEffect, useState } from 'react';
import { createCategoria, deleteCategoria, listCategorias, Categoria, updateCategoria, Pagination } from '../../api/categorias';
import { useAuth } from '../../context/AuthContext';

export default function CategoriasAdmin() {
	const { user } = useAuth();
	const isAdmin = user?.role === 'admin';

	const [items, setItems] = useState<Categoria[]>([]);
	const [meta, setMeta] = useState<Pagination<Categoria>["meta"] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<Partial<Categoria>>({ nombre: '', descripcion: '' });
	const [editingId, setEditingId] = useState<string | null>(null);

	const [page, setPage] = useState(1);

	const load = async () => {
		try {
			setLoading(true);
			const res = await listCategorias({ page, limit: 10 });
			setItems(res.data.items);
			setMeta(res.data.meta);
		} catch (e: any) {
			setError(e?.message || 'Error cargando categorías');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => { load(); }, [page]);

	const save = async () => {
		try {
			setLoading(true);
			if (editingId) {
				await updateCategoria(editingId, form);
			} else {
				await createCategoria(form);
			}
			setForm({ nombre: '', descripcion: '' });
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
			await deleteCategoria(id);
			await load();
		} catch (e: any) {
			setError(e?.response?.data?.message || e?.message || 'Error eliminando');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="page">
			<h2>Categorías</h2>
			{loading && <div style={{ color: '#444' }}>Cargando...</div>}
			{error && <div style={{ color: 'red' }}>{error}</div>}

			{isAdmin && (
				<div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
					<input placeholder="Nombre" value={form.nombre as string} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
					<input placeholder="Descripción" value={(form.descripcion as string) || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
					<button onClick={save}>{editingId ? 'Actualizar' : 'Crear'}</button>
				</div>
			)}

			<ul style={{ display: 'grid', gap: 8, marginTop: 12, padding: 0, listStyle: 'none' }}>
				{items.map((it) => (
					<li key={it.id}>
						<b>{it.nombre}</b> {it.descripcion && `- ${it.descripcion}`}
						{isAdmin && (
							<>
								<button onClick={() => { setEditingId(it.id); setForm({ nombre: it.nombre, descripcion: it.descripcion }); }}>Editar</button>
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
