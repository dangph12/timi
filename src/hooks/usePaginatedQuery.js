import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function usePaginatedQuery(queryKey, queryFn, options = {}) {
  const {
    defaultPage = 0,
    page: externalPage,
    setPage: externalSetPage,
    size = 20,
    ...queryOptions
  } = options;

  const [internalPage, internalSetPage] = useState(defaultPage);
  const page = externalPage ?? internalPage;
  const setPage = externalSetPage ?? internalSetPage;

  const query = useQuery({
    queryKey: [...queryKey, { page, size }],
    queryFn: () => queryFn({ page, size }),
    ...queryOptions,
  });

  return {
    ...query,
    page,
    setPage,
    items: query.data?.content ?? [],
    totalPages: query.data?.page?.totalPages ?? 0,
    totalElements: query.data?.page?.totalElements ?? 0,
  };
}
