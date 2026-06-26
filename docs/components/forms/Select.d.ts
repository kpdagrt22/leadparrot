import * as React from "react";

/** Squared native select styled to the Crest. Pass <option> children. */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  children?: React.ReactNode;
}
export function Select(props: SelectProps): React.ReactElement;
