import { SerializedSoftHyphenNode } from '@/components/admin/rte/features/SoftHyphen/SoftHyphenNode';
import { SerializedNonBreakingSpaceNode } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpaceNode';

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export type InterfaceRte = DefaultTypedEditorState<SerializedSoftHyphenNode | SerializedNonBreakingSpaceNode> & Record<string, unknown>;

