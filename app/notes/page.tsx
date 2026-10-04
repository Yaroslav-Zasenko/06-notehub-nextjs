import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  const queryClient = new QueryClient();
  const page = 1;
  const perPage = 12;
  const search = '';

  await queryClient.query({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: () => getNotes({ page, perPage, search }),
    staleTime: 1000 * 60, // або 'static', залежно від того, що приймає тип
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}