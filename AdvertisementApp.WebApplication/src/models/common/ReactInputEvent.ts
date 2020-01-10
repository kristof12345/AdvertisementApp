import React from "react";
import { FormControlProps } from "react-bootstrap/FormControl";
import { ReplaceProps, BsPrefixProps } from "react-bootstrap/helpers";

export type ReactInputEvent = React.FormEvent<ReplaceProps<"input", BsPrefixProps<"input"> & FormControlProps>>;
