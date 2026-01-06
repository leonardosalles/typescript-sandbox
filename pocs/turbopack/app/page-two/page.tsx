"use client";

import Link from "next/link";
import { List, type RowComponentProps } from "react-window";
import SharedComponent from "../../components/SharedComponent";

const generateMockData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => `Item ${index + 1}`);
};

function RowComponent({
  index,
  names,
  style,
}: RowComponentProps<{
  names: string[];
}>) {
  return (
    <div className="flex items-center justify-between" style={style}>
      {names[index]}
      <div className="text-slate-500 text-xs">{`${index + 1} of ${
        names.length
      }`}</div>
    </div>
  );
}

const mockData = generateMockData(10000);

const PageTwo = () => {
  return (
    <div>
      <h1>Page Two</h1>
      <SharedComponent />
      <p>This is the second page with additional heavy content.</p>
      <List
        rowComponent={RowComponent}
        rowCount={mockData.length}
        rowHeight={50}
        rowProps={{ names: mockData }}
      />
      <Link href="/page-one">Go to Page One</Link>
    </div>
  );
};

export default PageTwo;
