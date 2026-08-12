import type { InterfaceResolveMailtoInput } from '@/app/actions/resolveMailto';

// Note: this module must not import the resolveMailto server action at
// runtime. It is used by components that are rendered in Storybook,
// where 'use server' modules (and their transitive payload imports)
// cannot be bundled. The action is passed down as a prop from server
// components instead (see e.g. RenderFooter / RenderBlocks).
export type InterfaceResolveMailtoAction = (input: InterfaceResolveMailtoInput) => Promise<string | null>;

// Shared click handler for "write email" buttons. The email address is
// intentionally not part of the rendered markup; it is resolved from
// the server only when the visitor clicks the button.
export const openMailto = async ({
  action,
  input,
}: {
  action?: InterfaceResolveMailtoAction;
  input: InterfaceResolveMailtoInput;
}): Promise<void> => {
  if (!action) {
    return;
  }

  const mail = await action(input);

  if (!mail) {
    return;
  }

  window.location.href = `mailto:${mail}`;
};
