import React, { Fragment } from 'react';
import { Notification } from '@/components/blocks/Notification/Notification';
import { Rte } from '@/components/blocks/Rte/Rte';

type BlocksMap = {
  notificationBlock: typeof Notification;
  textBlock: typeof Rte;
};

const blockComponents: BlocksMap = {
  notificationBlock: Notification,
  textBlock: Rte,
};

interface InterfaceRenderBlocksProps {
  blocks: {
    blockType: string; id?: string | null
  }[] | null | undefined;
}

export const RenderBlocks = ({
  blocks,
}: InterfaceRenderBlocksProps): React.JSX.Element | null => {
  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0;

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const {
            blockType,
          } = block;

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof BlocksMap] as React.ComponentType<any>;

            if (Block) {
              return (
                <Block key={block.id || index} {...block} />
              );
            }
          }

          return null;
        })}
      </Fragment>
    );
  }

  return null;
};
