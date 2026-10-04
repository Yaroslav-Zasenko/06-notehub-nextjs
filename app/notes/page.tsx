import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotesPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const perPage = 12;
  const search = resolvedParams.search || '';

  const queryClient = new QueryClient();

  // Виправляємо queryClient.query на queryClient.prefetchQuery
  await queryClient.prefetchQuery({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: () => getNotes({ page, perPage, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}