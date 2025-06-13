"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AppDispatch } from "@/store";
import { setCurrentItem } from "@/store/paginationSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

type DynamicPaginationType = {
  data: any[];
};

const DynamicPagination: React.FC<DynamicPaginationType> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    dispatch(setCurrentItem(currentItems));
  }, [dispatch, data, currentPage]);

  return (
    <Pagination className="mt-10">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            href=""
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage((prev) => Math.max(prev - 1, 1));
            }}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => {
            return (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            );
          })
          .reduce((acc: (number | "...")[], page, index, arr) => {
            if (index === 0 || page === arr[index - 1] + 1) {
              acc.push(page);
            } else {
              acc.push("...");
              acc.push(page);
            }
            return acc;
          }, [])
          .map((page, index) => (
            <PaginationItem key={index}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href=""
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                    dispatch(setCurrentItem(currentItems));
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            href=""
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              dispatch(setCurrentItem(currentItems));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default DynamicPagination;
