import { templateExtend, TemplateName } from '@gitgraph/react';

export const formatKey = (key: KeyboardEvent): string => {
  let pressed = '';
  const specialKeyList = ['altKey', 'ctrlKey', 'shiftKey', 'metaKey'];
  specialKeyList.forEach((val: string) => {
    // @ts-ignore
    if (key[val]) {
      const code = val.replace('Key', '');
      pressed += code[0].toUpperCase() + code.substring(1);
    }
  });
  return pressed + key.code;
};

export const options = {
  // mode: Mode.Compact,
  template: templateExtend(TemplateName.Metro, {
    colors: [
      '#F94144',
      '#f59d38',
      '#F8961E',
      '#F9844A',
      '#F9C74F',
      '#90BE6D',
      '#43AA8B',
      '#4D908E',
      '#4e80ad',
      '#277DA1',
      '#3C1874',
      '#891E67',
      '#d42c72',
      '#e695da',
      '#FFB627',
      '#FF7F11',
      '#c74e94',
      '#BFDBFE',
      '#616bcf',
      '#82a4e0',
    ],
    branch: {
      spacing: 45,
      lineWidth: 3,
      label: {
        display: false,
      },
    },
    tag: {
      color: 'white',
      bgColor: 'transparent',
      borderRadius: 0,
      pointerWidth: 0,
      strokeColor: 'transparent',
    },
    commit: {
      dot: {
        size: 8,
      },
      message: {
        color: 'transparent',
        display: false,
        displayAuthor: false,
        displayHash: false,
      },
      spacing: 45,
      hasTooltipInCompactMode: true,
    },
  }),
};
