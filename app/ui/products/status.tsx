import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ProductStatus({ quantity }: { quantity: number }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-red-500 text-white': quantity === 0,
        },
      )}
    >
      {quantity === 0 ? (
        <>
          Sold Out
        </>
      ) : null}
      {quantity !== 0 ? (
        <>
          {quantity}
        </>
      ) : null}
    </span>
  );
}
