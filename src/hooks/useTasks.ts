import { useState, useEffect, useCallback } from 'react';
import { API_URL, MESSAGES } from '../utils/constants';
import type { Task, TaskFormData, UseTasksReturn } from '../types';

// Função auxiliar genérica para requisições
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Erro na requisição');
  }

  return response.status !== 204 ? await response.json() : null;
};

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Função auxiliar para validação (Eliminação de duplicidade)
  const validateTaskData = (taskData: TaskFormData): boolean => {
    if (!taskData.title.trim()) {
      setError(MESSAGES.ERROR_EMPTY_TITLE);
      return false;
    }
    return true;
  };

  // Função para carregar tarefas
  const fetchTasks = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<Task[]>('');
      setTasks(data);
    } catch (err) {
      setError(MESSAGES.ERROR_LOAD);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para criar nova tarefa
  const createTask = useCallback(async (taskData: TaskFormData): Promise<boolean> => {
    if (!validateTaskData(taskData)) return false;

    setSubmitting(true);
    setError(null);
    try {
      const newTask = await apiRequest<Task>('', {
        method: "POST",
        body: JSON.stringify({ ...taskData, completed: false }),
      });
      
      setTasks(prev => [...prev, newTask]);
      return true;
    } catch (err) {
      setError(MESSAGES.ERROR_CONNECTION);
      console.error('Erro:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // Função para atualizar tarefa existente
  const updateTask = useCallback(async (id: number, taskData: TaskFormData): Promise<boolean> => {
    if (!validateTaskData(taskData)) return false;

    setSubmitting(true);
    setError(null);
    try {
      const updatedTask = await apiRequest<Task>(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
      });

      setTasks(prev => prev.map(t => (t.id === id ? updatedTask : t)));
      return true;
    } catch (err) {
      setError(MESSAGES.ERROR_CONNECTION);
      console.error('Erro:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  // Função para alternar status da tarefa
  const toggleTask = useCallback(async (id: number): Promise<void> => {
    const previousTasks = [...tasks];
    
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));

    try {
      await apiRequest(`/${id}/toggle`, { method: "PATCH" });
    } catch (err) {
      setTasks(previousTasks);
      setError(MESSAGES.ERROR_UPDATE);
      console.error('Erro:', err);
    }
  }, [tasks]);

  // Função para deletar tarefa
  const deleteTask = useCallback(async (id: number): Promise<void> => {
    const previousTasks = [...tasks];
    
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      await apiRequest(`/${id}`, { method: "DELETE" });
    } catch (err) {
      setTasks(previousTasks);
      setError(MESSAGES.ERROR_DELETE);
      console.error('Erro:', err);
    }
  }, [tasks]);

  // Carregar tarefas ao inicializar
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    submitting,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    fetchTasks
  };
}