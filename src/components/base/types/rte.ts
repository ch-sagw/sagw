import type { SerializedSoftHyphenNode } from '@/components/admin/rte/features/SoftHyphen/SoftHyphen.shared';
import type { SerializedNonBreakingSpaceNode } from '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpace.shared';

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';

export type InterfaceRte = DefaultTypedEditorState<SerializedSoftHyphenNode | SerializedNonBreakingSpaceNode> & Record<string, unknown>;

