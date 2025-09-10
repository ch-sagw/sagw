import 'server-only';
import React, { Fragment } from 'react';
import { Notification } from '@/components/blocks/Notification/Notification';
import { Rte } from '@/components/blocks/Rte/Rte';
import {
  InterfaceNotification, InterfaceTextBlock,
} from '@/payload-types';

interface InterfaceRenderBlocksProps {
  blocks: (InterfaceNotification | InterfaceTextBlock)[] | null | undefined;
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

          if (blockType) {
            if (blockType === 'notificationBlock') {
              return (
                <div key={block.id || index}>
                  <Notification {...block} />
                </div>
              );
            }

            if (blockType === 'textBlock') {
              return (
                <div key={block.id || index}>
                  <Rte {...block} />
                </div>
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
