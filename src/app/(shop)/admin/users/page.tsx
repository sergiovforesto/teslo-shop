import { getPaginatedUsers } from '@/actions';
import { Title } from '@/components';

import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

export default async function UsersAdminPage() {

  const { users = [], ok } = await getPaginatedUsers()

  if (!ok) {
    redirect('/auth/login')
  }

  return (
    <>
      <Title title="Mantenimiento Usuarios" />

      <div className="mb-10">
        <UsersTable users={users}/>
      </div>
    </>
  );
}
