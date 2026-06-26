import * as React from "react";

/** Labelled text input / textarea styled to the Crest. */
export interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement & HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Leading prefix glyph (e.g. "$", "@"). */
  prefix?: React.ReactNode;
  /** Render a multiline textarea. @default false */
  textarea?: boolean;
  rows?: number;
}
export function Field(props: FieldProps): React.ReactElement;
