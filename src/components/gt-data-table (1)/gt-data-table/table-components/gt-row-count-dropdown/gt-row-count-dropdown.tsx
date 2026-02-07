import { ArrowDropDown } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';

import { useClickAway } from '../../../../../hooks/use-click-away';

type GTRowCountDropdownProps = {
  pageCount: number;
  type?: string;
  onChange: (value: Record<string, number>) => void;
};

const GTRowCountDropdown = ({ pageCount, type = 'main', onChange }: GTRowCountDropdownProps) => {
  const [options, setOptions] = useState<Array<number>>([]);

  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const handleSelect = (value: number) => {
    setOpen(false);
    onChange({ pageCount: value });
  };

  useClickAway(ref, setOpen);

  useEffect(() => {
    if (type === 'main') {
      setOptions([15, 25, 50, 100]);
    } else {
      setOptions([5, 10, 15]);
    }
  }, [pageCount]);

  return (
    <div className="relative" ref={ref}>
      <div className="flex justify-end items-end ">
        <input id="row-count" className="w-1/7" type="text" value={pageCount} readOnly />
        <div onClick={() => setOpen((prev) => !prev)}>
          <ArrowDropDown />
        </div>
      </div>
      {open && (
        <ul className="absolute bg-[var(--muidefaults-background-paper-elevation-2)] z-[var(--zIndex-modal)]  px-4 py-2 right-0 flex flex-col items-center">
          {options.length > 0 ? (
            options.map((item, i) => (
              <li className="cursor-default" key={i} onClick={() => handleSelect(item)}>
                {item}
              </li>
            ))
          ) : (
            <p>Loading ...</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default GTRowCountDropdown;
