'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import type { Note } from '@/types/note';
import css from './NotesPage.module.css';

export default function NotesPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const perPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => getNotes({ page, perPage, search }),
    placeholderData: (previousData) => previousData,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (query: string) => {
    if (query === search) return;

    setSearch(query);
    setPage(1); // При пошуку завжди скидаємо на 1-шу сторінку
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <main className={css.main}>
      <div className={css.app}>
        {/* Тулбар: Пошук зліва, Пагінація по центру, Кнопка створення справа */}
        <div className={css.toolbar}>
          <div className={css.searchContainer}>
            <SearchBox onSearch={handleSearch} />
          </div>

          <div className={css.paginationContainer}>
            <Pagination
              pageCount={totalPages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </div>

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
          <NoteList 
            notes={notes} 
            onView={(note) => setSelectedNote(note)} 
          />
        )}

        {/* Модальне вікно створення нотатки */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
          <NoteForm onClose={() => setIsCreateModalOpen(false)} />
        </Modal>

        {/* Модальне вікно перегляду нотатки */}
        {/* Модальне вікно перегляду нотатки */}
        {selectedNote && (
          <Modal isOpen={!!selectedNote} onClose={() => setSelectedNote(null)}>
            <div className={css.modalContent}>
              <h2>{selectedNote.title}</h2>
              <p>{selectedNote.content}</p>
              
              <div className={css.modalFooter}>
                <span className={css.modalTag}>{selectedNote.tag}</span>
                {selectedNote.createdAt && (
                  <span className={css.modalDate}>
                    {new Date(selectedNote.createdAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </main>
  );
}