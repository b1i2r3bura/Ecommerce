/**
 * EmptyState.jsx — Minimalist Warm Empty State Placeholder
 */

import { Link } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No items found',
  description = 'Try adjusting your search query or switching categories.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 'var(--space-16) var(--space-6)',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        margin: 'var(--space-6) 0',
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-4)',
        }}
      >
        <Icon size={26} />
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '440px', marginBottom: 'var(--space-6)', fontSize: '0.95rem' }}>
        {description}
      </p>

      {actionLink && actionLabel && (
        <Link to={actionLink} className="btn btn-primary btn-md">
          {actionLabel}
        </Link>
      )}

      {onAction && actionLabel && (
        <button onClick={onAction} className="btn btn-primary btn-md">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
