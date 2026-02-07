import { useEffect, useState } from 'react';

type ResizerProps = {
  children: ({ ref }: { ref: React.Ref<HTMLDivElement> }) => JSX.Element;
  onResizeHandler: (value: string) => void;
};

export const GTDataTableResizer = ({ children, onResizeHandler }: ResizerProps) => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  const [dxDy, setDxDy] = useState<{ dx: number; dy: number }>({
    dx: 0,
    dy: 0,
  });

  const ref = (nodeEle: HTMLDivElement) => {
    setNode(nodeEle);
  };

  const updateCursor = () => {
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const resetCursor = () => {
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
  };

  useEffect(() => {
    if (!node) {
      return;
    }

    const handleMouseDown = (e: MouseEvent) => {
      const parent = node.parentElement as HTMLElement;

      const startPos = {
        x: e.clientX,
        y: e.clientY,
      };
      const styles = window.getComputedStyle(parent);
      const w = parseInt(styles.width, 10);

      const handleMouseMove = (e: MouseEvent) => {
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;

        setDxDy({ dx, dy });
        onResizeHandler(`${w + dx}px`);
        updateCursor();
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        resetCursor();
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const parent = node.parentElement as HTMLElement;
      const touch = e.touches[0];

      const startPos = {
        x: touch.clientX,
        y: touch.clientY,
      };
      const styles = window.getComputedStyle(parent);
      const w = parseInt(styles.width, 10) - dxDy.dx;

      const handleTouchMove = (e: TouchEvent) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startPos.x;

        onResizeHandler(`${w + dx}px`);
        updateCursor();
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        resetCursor();
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    };

    node.addEventListener('mousedown', handleMouseDown);
    node.addEventListener('touchstart', handleTouchStart);

    return () => {
      node.removeEventListener('mousedown', handleMouseDown);
      node.removeEventListener('touchstart', handleTouchStart);
    };
  }, [dxDy.dx, node, onResizeHandler]);

  return children({ ref });
};
