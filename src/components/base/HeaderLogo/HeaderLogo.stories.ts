import type {
  Meta,
  StoryObj,
} from '@storybook/nextjs-vite';
import { HeaderLogo } from '@/components/base/HeaderLogo/HeaderLogo';
import { defaultDecorator } from '@/storybook-helpers';

type HeaderLogoProps = React.ComponentProps<typeof HeaderLogo>;

type StrictStory = StoryObj<typeof HeaderLogo> & {
  args: HeaderLogoProps;
};

const meta: Meta<typeof HeaderLogo> = {
  args: {},
  component: HeaderLogo,
  decorators: [defaultDecorator],
  parameters: {/* layout: 'centered', */ },
  tags: [
    'autodocs',
    'a11y:check',
  ],
  title: 'Components/base/HeaderLogo',
};

export default meta;

export const LogoCodicesDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'codices',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoCodicesLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'codices',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoCollromDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'collrom',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoCollromLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'collrom',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSagDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sag',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSagLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sag',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSagwDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sagw',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSagwLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sagw',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSagoDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sago',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSagoLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sago',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSanasDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sanas',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSanasLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sanas',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSauteDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'saute',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSauteLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'saute',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSegDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'seg',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSegLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'seg',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgaDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sga',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgaLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sga',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgasDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgas',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgasLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgas',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgavlDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgavl',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgavlLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgavl',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgbDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgb',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgbLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgb',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgbeDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgbe',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgbeLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgbe',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgbfDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgbf',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgbfLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgbf',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSggDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgg',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSggLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgg',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSggfDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sggf',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSggfLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sggf',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgjfDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgjf',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgjfLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgjf',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgksDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgks',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgksLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgks',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgmoikDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgmoik',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgmoikLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgmoik',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgrDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgr',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgrLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgr',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgssDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgss',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgssLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgss',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSgtkDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgtk',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSgtkLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sgtk',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSmgDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'smg',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSmgLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'smg',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSpgDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'spg',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSpgLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'spg',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSsehDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sseh',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSsehLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sseh',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSsgDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'ssg',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSsgLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'ssg',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSslasDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sslas',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSslasLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sslas',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSthgDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sthg',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSthgLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'sthg',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};

export const LogoSvavDark: StrictStory = {
  args: {
    colorMode: 'dark',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'svav',
  },
  globals: {
    backgrounds: {
      value: 'dark',
    },
  },
};

export const LogoSvavLight: StrictStory = {
  args: {
    colorMode: 'light',
    link: '/',
    linkText: 'Back to Homepage',
    name: 'svav',
  },
  globals: {
    backgrounds: {
      value: 'light',
    },
  },
};
