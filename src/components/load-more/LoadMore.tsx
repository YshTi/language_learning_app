import ButtonLink from "../buttons/Button";
import Loader from "../loader/Loader";

import styles from "./LoadMore.module.css";

interface LoadMoreProps {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const LoadMore = ({
  isLoading,
  hasMore,
  onLoadMore,
}: LoadMoreProps) => {
  if (!hasMore) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {isLoading ? (
        <Loader size={70} />
      ) : (
        <ButtonLink
          as="button"
          variant="primary"
          onClick={onLoadMore}
          className={styles.button}
        >
          Load more
        </ButtonLink>
      )}
    </div>
  );
};

export default LoadMore;