import * as React from "react";

export interface TabItem {
  id?: string;
  label: string;
  count?: number;
}

/** Underline tab strip with mono labels and optional counts. */
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs: TabItem[];
  /** Active tab id (or label if no id). */
  value?: string;
  onChange?: (id: string) => void;
}
export function Tabs(props: TabsProps): React.ReactElement;
