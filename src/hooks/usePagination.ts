'use client';

import {
  Children, ReactNode, useEffect, useState,
} from 'react';
import {
  usePathname, useRouter, useSearchParams,
} from 'next/navigation';

interface InterfaceUsePaginationOptions {
  items: ReactNode[] | ReactNode;
  listRef?: React.RefObject<HTMLUListElement | null>;
  userPaginatedRef?: React.MutableRefObject<boolean>;
  sectionRef?: React.RefObject<HTMLElement | null>;
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
  listRef,
  userPaginatedRef,
  sectionRef,
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

    // Set user paginated flag if userPaginatedRef is provided
    if (userPaginatedRef) {
      userPaginatedRef.current = true;
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

  // scroll to top
  useEffect(() => {
    if (!userPaginatedRef?.current) {
      return;
    }

    if (!sectionRef?.current) {
      return;
    }

    window.scrollTo({
      behavior: 'smooth',

      // not 0 since otherwise the header would expand
      top: 10,
    });
  }, [
    currentPage,
    sectionRef,
    userPaginatedRef,
  ]);

  // observe the page, as soon as the first link is in viewport, focus it
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    if (userPaginatedRef?.current && listRef?.current) {
      const firstListItem = listRef.current.querySelector('li');

      if (firstListItem) {
        observer = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
              const firstLink = firstListItem.querySelector('a') as HTMLElement | null;

              if (firstLink) {
                firstLink.focus({
                  preventScroll: true,
                });
              }
              observer?.disconnect();

              return;
            }
          }
        }, {
          root: null,
          rootMargin: '0px',
          threshold: [
            0.5,
            0.75,
            0.9,
          ],
        });

        observer.observe(firstListItem);
      }
    }

    return (): void => {
      observer?.disconnect();
    };
  }, [
    currentItems,
    listRef,
    userPaginatedRef,
  ]);

  return {
    currentItems,
    currentPage,
    handlePageChange,
    totalItems,
    totalPages,
  };
};
