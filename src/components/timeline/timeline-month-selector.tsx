type Props = {
  year: number;
  month: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
};

import { useTimelineMonths } from "./timeline-months.hook";
import { NativeSelect } from "@chakra-ui/react";
import type { TimelineMonth } from "./timeline-months.hook";
export const TimelineMonthSelector = ({
  year,
  month,
  setYear,
  setMonth,
}: Props) => {
  const now = new Date();
  const months: TimelineMonth[] = useTimelineMonths();
  const ymList: { label: string; year: number; month: number }[] = months.map(
    ({ year, month }) => ({
      label: `${year}-${String(month).padStart(2, "0")}`,
      year,
      month,
    }),
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [yStr, mStr] = e.target.value.split("-");
    const y = Number(yStr) || now.getFullYear();
    const m = Number(mStr) || 1;
    setYear(y);
    setMonth(m);
  };

  return (
    <NativeSelect.Root size="sm" width="200px">
      <NativeSelect.Field
        value={`${year}-${String(month).padStart(2, "0")}`}
        onChange={handleChange}
        placeholder="年月を選択"
      >
        {ymList.map(({ label }) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
};
