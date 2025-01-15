import { forwardRef } from 'react';

import { Button, type ButtonProps } from './button';

export interface IconButtonProps extends ButtonProps {}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    return (
      <Button
        display="inline-flex"
        px="0"
        py="0"
        height="auto"
        minW="auto"
        flexShrink="0"
        ref={ ref }
        { ...props }
        visual={ props.visual ?? 'plain' }
      />
    );
  },
);
