// app/users/page.tsx
import { supabase } from '@/utils/supabase/server'

export const revalidate = 0; // opcional, desactiva cache si quieres datos siempre actualizados

export default async function UsersPage() {
  // Consultar la tabla 'users'
  const { data: users, error } = await supabase
    .from('users')
    .select('*')

  console.log(users)

  if (error) {
    console.error('Error fetching users:', error)
    return <p>Error fetching users: {error.message}</p>
  }

  if (!users || users.length === 0) {
    return <p>No se encontraron usuarios.</p>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.email} {user.firstName ? `- ${user.firstName}` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
