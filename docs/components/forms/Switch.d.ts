import * as React from "react";

/** Pill toggle switch. Controlled via checked/onChange. */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}
export function Switch(props: SwitchProps): React.ReactElement;
