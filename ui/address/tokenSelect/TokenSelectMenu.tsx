import { Text, Box, Input, Flex } from '@chakra-ui/react';
import { sumBy } from 'es-toolkit';
import type { ChangeEvent } from 'react';
import React from 'react';

import type { FormattedData } from './types';
import type { TokenType } from 'types/api/token';

import { getTokenTypeName } from 'lib/token/tokenTypes';
import { InputGroup } from 'toolkit/chakra/input-group';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

import type { Sort } from '../utils/tokenUtils';
import { sortTokenGroups, sortingFns } from '../utils/tokenUtils';
import TokenSelectItem from './TokenSelectItem';

interface Props {
  searchTerm: string;
  erc20sort: Sort;
  erc1155sort: Sort;
  erc404sort: Sort;
  filteredData: FormattedData;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSortClick: (event: React.SyntheticEvent) => void;
}

const TokenSelectMenu = ({ erc20sort, erc1155sort, erc404sort, filteredData, onInputChange, onSortClick, searchTerm }: Props) => {
  const hasFilteredResult = sumBy(Object.values(filteredData), ({ items }) => items.length) > 0;

  return (
    <>
      <InputGroup
        startElement={ <IconSvg name="search" boxSize={ 4 } color={{ _light: 'blackAlpha.600', _dark: 'whiteAlpha.600' }}/> }
        startOffset="38px"
        mb={ 5 }
      >
        <Input placeholder="Search by token name" onChange={ onInputChange } size="sm" bgColor="dialog.bg"/>
      </InputGroup>
      <Flex flexDir="column" rowGap={ 6 }>
        { Object.entries(filteredData).sort(sortTokenGroups).map(([ tokenType, tokenInfo ]) => {
          if (tokenInfo.items.length === 0) {
            return null;
          }

          const type = tokenType as TokenType;
          const arrowTransform =
            (type === 'ERC-1155' && erc1155sort === 'desc') ||
            (type === 'ERC-404' && erc404sort === 'desc') ||
            (type === 'ERC-20' && erc20sort === 'desc') ?
              'rotate(90deg)' :
              'rotate(-90deg)';
          const sortDirection: Sort = (() => {
            switch (type) {
              case 'ERC-1155':
                return erc1155sort;
              case 'ERC-20':
                return erc20sort;
              default:
                return 'desc';
            }
          })();
          const hasSort =
            (type === 'ERC-404' && tokenInfo.items.some(item => item.value)) ||
            type === 'ERC-1155' ||
            (type === 'ERC-20' && tokenInfo.items.some(({ usd }) => usd));
          const numPrefix = tokenInfo.isOverflow ? '>' : '';

          return (
            <Box key={ type }>
              <Flex justifyContent="space-between">
                <Text mb={ 3 } color="gray.500" fontWeight={ 600 } fontSize="sm">
                  { getTokenTypeName(type) } tokens ({ numPrefix }{ tokenInfo.items.length })
                </Text>
                { hasSort && (
                  <Link data-type={ type } onClick={ onSortClick } aria-label={ `Sort ${ getTokenTypeName(type) } tokens` }>
                    <IconSvg name="arrows/east" boxSize={ 5 } transform={ arrowTransform } transitionDuration="faster"/>
                  </Link>
                ) }
              </Flex>
              { tokenInfo.items.sort(sortingFns[type](sortDirection)).map((data) =>
                <TokenSelectItem key={ data.token.address + data.token_id } data={ data }/>) }
            </Box>
          );
        }) }
      </Flex>
      { Boolean(searchTerm) && !hasFilteredResult && <Text fontSize="sm">Could not find any matches.</Text> }
    </>
  );
};

export default React.memo(TokenSelectMenu);
