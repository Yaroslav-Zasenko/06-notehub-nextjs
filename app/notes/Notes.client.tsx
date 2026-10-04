'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { getNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import css from './NotesPage.module.css';

export default function NotesClient(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const perPage = 12;

  const debouncedSetSearch = useDebouncedCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, 300);

  const handleSearchChange = (query: string) => {
    setInputValue(query);
    debouncedSetSearch(query);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', { page, perPage, search }],
    queryFn: () => getNotes({ page, perPage, search }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <main className={css.main}>
      <div className={css.app}>
        <div className={css.toolbar}>
          <div className={css.searchContainer}>
            <SearchBox value={inputValue} onSearch={handleSearchChange} />
          </div>

          {totalPages > 1 && (
            <div className={css.paginationContainer}>
              <Pagination
                pageCount={totalPages}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          <div className={css.actionContainer}>
            <button 
              className={css.button}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create Note
            </button>
          </div>
        </div>

        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Failed to load notes. Please try again.</p>}

        {!isLoading && !isError && (
          notes.length > 0 ? (
            <NoteList 
              notes={notes} 
            />
          ) : (
            <p className={css.noNotes}>No notes found.</p>
          )
        )}

        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <NoteForm onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      </div>
    </main>
  );
}