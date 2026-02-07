import { type Dispatch, type RefObject, type SetStateAction, useEffect } from 'react';

export const useClickAway = (
  ref: RefObject<HTMLElement | null>,
  setOpen: Dispatch<SetStateAction<boolean>>,
) => {
  useEffect(() => {
    const handleClickAway = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;

      if (!ref.current || !target || ref.current.contains(target)) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickAway);
    document.addEventListener('touchstart', handleClickAway);

    return () => {
      document.removeEventListener('mousedown', handleClickAway);
      document.removeEventListener('touchstart', handleClickAway);
    };
  }, [ref, setOpen]);
};
