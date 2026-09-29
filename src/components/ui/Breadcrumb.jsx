import { Link } from 'react-router';

/**
 * Fil d'Ariane : aide l'utilisateur à se situer dans le site.
 * @param {{ items: { label: string, to?: string }[] }} props
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="breadcrumb">
        {items.map((item, index) => {
          const isCurrentPage = index === items.length - 1;

          return (
            <li
              key={`${index}-${item.label}`}
              className={`breadcrumb-item${isCurrentPage ? ' active' : ''}`}
              aria-current={isCurrentPage ? 'page' : undefined}
            >
              {isCurrentPage || !item.to ? item.label : <Link to={item.to}>{item.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
