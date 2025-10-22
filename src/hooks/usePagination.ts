'use client';

import {
  Children, ReactNode, useEffect, useState,
} from 'react';
import {
  usePathname, useRouter, useSearchParams,
} from 'next/navigation';

interface InterfaceUsePaginationOptions {
  items: ReactNode[] | ReactNode;
}

interface InterfaceUsePaginationReturn {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  currentItems: ReactNode[];
  handlePageChange: (page: number) => void;
}

export const usePagination = ({
  items,
}: InterfaceUsePaginationOptions): InterfaceUsePaginationReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const itemsPerPage = 10;
  const paramName = 'page';

  // Get initial page from URL (if available)
  const initialPage = ((): number => {
    const pageFromUrl = Number(searchParams.get(paramName));

    return Number.isFinite(pageFromUrl) && pageFromUrl > 0
      ? pageFromUrl
      : 1;
  })();

  const [
    currentPage,
    setCurrentPage,
  ] = useState(initialPage);

  // Normalize children/items to an array
  const itemArray = Array.isArray(items)
    ? items
    : Children.toArray(items);
  const totalItems = itemArray.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure page stays within range
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [
    totalPages,
    currentPage,
  ]);

  // Slice items for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = itemArray.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number): void => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);

    // Update URL
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set(paramName, page.toString());
    router.replace(`${pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  // On mount, ensure URL param matches internal state
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get(paramName));

    if (pageFromUrl && pageFromUrl !== currentPage) {
      setCurrentPage(pageFromUrl);
    }
  }, [
    currentPage,
    searchParams,
    paramName,
  ]);

  return {
    currentItems,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
  };
};
