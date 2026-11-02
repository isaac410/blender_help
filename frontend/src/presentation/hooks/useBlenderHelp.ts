import { useState, useCallback, useEffect } from 'react';
import { BlenderHelp, CreateBlenderHelpInput, UpdateBlenderHelpInput } from '../../domain/blender-help.model';
import { IBlenderHelpRepository } from '../../ports/blender-help.repository.interface';

export function useBlenderHelp(repository: IBlenderHelpRepository) {
  const [items, setItems] = useState<BlenderHelp[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [activeKeywords, setActiveKeywords] = useState<string>('');
  const [activeVersion, setActiveVersion] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [lastQueryTime, setLastQueryTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('blender_help_last_query_time');
    return saved ? new Date(saved) : null;
  });
  const [lastQuerySummary, setLastQuerySummary] = useState<string | null>(() => {
    return localStorage.getItem('blender_help_last_query_summary');
  });
  const [lastMutationTime, setLastMutationTime] = useState<Date | null>(null);

  const fetchTotalCount = useCallback(async () => {
    try {
      const data = await repository.getAll();
      setTotalCount(data.length);

      if (data.length > 0) {
        const latestDate = data.reduce((latest, item) => {
          const current = new Date(item.updatedAt);
          return current > latest ? current : latest;
        }, new Date(0));
        if (latestDate.getTime() > 0) {
          setLastMutationTime(latestDate);
        }
      }
    } catch (err) {
      console.error('Error loading total count:', err);
    }
  }, [repository]);

  // Load total count on startup
  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  const executeSearch = useCallback(async (query: string, keywords: string, version: string) => {
    try {
      setLoading(true);
      setError(null);
      setActiveQuery(query);
      setActiveKeywords(keywords);
      setActiveVersion(version);
      setHasSearched(true);
      const params: string[] = [];
      if (query.trim()) params.push(`búsqueda: ${query.trim()}`);
      if (keywords.trim()) params.push(`palabras claves: ${keywords.trim()}`);
      if (version.trim()) params.push(`versión: ${version.trim()}`);
      const summary = params.length > 0 ? `(${params.join(', ')})` : '(todos)';

      const now = new Date();
      setLastQueryTime(now);
      setLastQuerySummary(summary);
      localStorage.setItem('blender_help_last_query_time', now.toISOString());
      localStorage.setItem('blender_help_last_query_summary', summary);

      const data = await repository.search(query, keywords, version);
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Error searching shortcuts');
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const clearSearch = useCallback(() => {
    setItems([]);
    setActiveQuery('');
    setActiveKeywords('');
    setActiveVersion('');
    setHasSearched(false);
  }, []);

  const createItem = async (input: CreateBlenderHelpInput) => {
    try {
      setError(null);
      const newItem = await repository.create(input);
      setItems((prev) => [newItem, ...prev]);
      setTotalCount((prev) => prev + 1);
      setLastMutationTime(new Date());
      return newItem;
    } catch (err: any) {
      setError(err.message || 'Error creating shortcut');
      throw err;
    }
  };

  const updateItem = async (id: string, input: UpdateBlenderHelpInput) => {
    try {
      setError(null);
      const updated = await repository.update(id, input);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      setLastMutationTime(new Date());
      return updated;
    } catch (err: any) {
      setError(err.message || 'Error updating shortcut');
      throw err;
    }
  };

  const deleteItem = async (id: string, password?: string) => {
    try {
      setError(null);
      await repository.delete(id, password);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setLastMutationTime(new Date());
    } catch (err: any) {
      setError(err.message || 'Error deleting shortcut');
      throw err;
    }
  };

  return {
    items,
    totalCount,
    loading,
    error,
    activeQuery,
    activeKeywords,
    activeVersion,
    hasSearched,
    lastQueryTime,
    lastQuerySummary,
    lastMutationTime,
    executeSearch,
    clearSearch,
    createItem,
    updateItem,
    deleteItem,
  };
}
