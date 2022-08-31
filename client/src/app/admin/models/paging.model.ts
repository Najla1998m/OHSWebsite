export interface Paging<T> {
  items: T;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
