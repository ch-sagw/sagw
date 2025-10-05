import type {
  SerializedAutoLinkNode,
  SerializedBlockNode,
  SerializedHeadingNode,
  SerializedHorizontalRuleNode,
  SerializedLinkNode,
  SerializedListItemNode,
  SerializedListNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedRelationshipNode,
  SerializedTextNode,
  SerializedUploadNode,
  TypedEditorState,
} from '@payloadcms/richtext-lexical';

import { SerializedSoftHyphenNode } from '@/components/admin/rte/features/SoftHyphen/SoftHyphenNode';
import { SerializedNonBreakingSpaceNode } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpaceNode';

export type InterfaceRte = TypedEditorState<
  | SerializedAutoLinkNode
  | SerializedBlockNode
  | SerializedHorizontalRuleNode
  | SerializedLinkNode
  | SerializedListItemNode
  | SerializedListNode
  | SerializedParagraphNode
  | SerializedQuoteNode
  | SerializedRelationshipNode
  | SerializedTextNode
  | SerializedUploadNode
  | SerializedHeadingNode
  | SerializedSoftHyphenNode
  | SerializedNonBreakingSpaceNode
>;
