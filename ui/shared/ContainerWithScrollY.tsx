import type { FlexProps } from '@chakra-ui/react';
import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

export interface Props extends FlexProps {
  gradientHeight: number;
  onScrollVisibilityChange?: (isVisible: boolean) => void;
};

const ContainerWithScrollY = ({ gradientHeight, children, onScrollVisibilityChange, ...rest }: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [ hasScroll, setHasScroll ] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }

    const hasScroll = ref.current.scrollHeight >= ref.current.clientHeight + gradientHeight / 2;
    setHasScroll(hasScroll);
    onScrollVisibilityChange?.(hasScroll);
  }, [ gradientHeight, onScrollVisibilityChange ]);

  return (
    <Flex
      flexDirection="column"
      overflowY={ hasScroll ? 'scroll' : 'auto' }
      ref={ ref }
      _after={ hasScroll ? {
        position: 'absolute',
        content: '""',
        bottom: 0,
        left: 0,
        right: '20px',
        height: `${ gradientHeight }px`,
        bgGradient: { _light: `linear(to-b, transparent, {colors.white}`, _dark: `linear(to-b, transparent, {colors.black})` },
      } : undefined }
      pr={ hasScroll ? 5 : 0 }
      pb={ hasScroll ? `${ gradientHeight }px` : 0 }
      { ...rest }
    >
      { children }
    </Flex>
  );
};

export default chakra(ContainerWithScrollY);
