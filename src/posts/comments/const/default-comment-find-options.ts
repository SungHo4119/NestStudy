export const DEFAULT_COMMENT_FIND_OPTIONS = {
  relations: {
    author: true,
  },
  select: {
    author: {
      id: true,
      nickname: true,
    },
  },
};
