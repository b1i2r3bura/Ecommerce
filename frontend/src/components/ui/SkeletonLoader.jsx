/**
 * SkeletonLoader.jsx — Fast, lightweight placeholder skeletons
 */

export const ProductCardSkeleton = () => {
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', height: '100%' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '1 / 1' }} />
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div className="skeleton" style={{ width: '60px', height: '18px' }} />
        <div className="skeleton" style={{ width: '85%', height: '20px' }} />
        <div className="skeleton" style={{ width: '100px', height: '14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
          <div className="skeleton" style={{ width: '70px', height: '22px' }} />
          <div className="skeleton" style={{ width: '70px', height: '32px' }} />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <div
            className="skeleton"
            style={{
              width: i === 0 ? '50%' : '75%',
              height: '16px',
            }}
          />
        </td>
      ))}
    </tr>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--space-4)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)' }}>
        <div className="skeleton" style={{ aspectRatio: '1 / 1', borderRadius: 'var(--radius-md)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="skeleton" style={{ width: '80px', height: '20px' }} />
          <div className="skeleton" style={{ width: '90%', height: '36px' }} />
          <div className="skeleton" style={{ width: '140px', height: '18px' }} />
          <div className="skeleton" style={{ width: '100px', height: '32px' }} />
          <div className="skeleton" style={{ width: '100%', height: '120px' }} />
          <div className="skeleton" style={{ width: '220px', height: '48px', marginTop: 'var(--space-4)' }} />
        </div>
      </div>
    </div>
  );
};
