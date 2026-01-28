import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div className="page">
      <h2>Panel de Administración</h2>
      <p>Rol actual: <b>{user?.role}</b></p>
      <p>Usa el menú para gestionar recursos.</p>
    </div>
  );
}
