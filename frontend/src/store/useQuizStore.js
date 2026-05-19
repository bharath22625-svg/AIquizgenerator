import { create } from 'zustand'

export const useQuizStore = create((set) => ({
  documentId: null,
  quizData: null,
  isLoading: false,
  error: null,
  setDocumentId: (id) => set({ documentId: id }),
  setQuizData: (data) => set({ quizData: data }),
  setIsLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error: error }),
  resetStore: () => set({ documentId: null, quizData: null, isLoading: false, error: null }),
}))
