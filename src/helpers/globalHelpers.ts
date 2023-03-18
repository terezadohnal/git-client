import { templateExtend, TemplateName } from '@gitgraph/react';
import { Settings } from 'sigma/settings';
import { NodeDisplayData, PartialButFor } from 'sigma/types';

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function drawHover(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayData, 'size' | 'color' | 'label' | 'x' | 'y'>,
  settings: Settings
) {
  const size = settings.labelSize;
  const font = settings.labelFont;
  const weight = settings.labelWeight;
  const subLabelSize = size - 2;

  const { label, author_name: name, author_email: email, date, hash } = data;
  const subLabel = data.tag !== 'unknown' ? data.tag : '';

  // Then we draw the label background
  context.beginPath();
  context.fillStyle = '#fff';
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 2;
  context.shadowBlur = 8;
  context.shadowColor = '#000';

  const biggestWidth = Math.max(
    context.measureText(`${name}(${email})`).width,
    context.measureText(hash).width
  );

  context.font = `${weight} ${size}px ${font}`;
  const labelWidth = context.measureText(label ?? '').width;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const subLabelWidth = subLabel ? context.measureText(subLabel).width : 0;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  const clusterLabelWidth = biggestWidth;

  const textWidth = Math.max(labelWidth, subLabelWidth, clusterLabelWidth);

  const x = Math.round(data.x + 15);
  const y = Math.round(data.y);
  const w = Math.round(textWidth + size / 2 + data.size + 3);
  const hLabel = Math.round(size / 2 + 4);
  const hSubLabel = subLabel ? Math.round(subLabelSize / 2 + 9) : 0;
  const hClusterLabel = Math.round(subLabelSize / 2 + 9);

  drawRoundRect(
    context,
    x,
    y - hSubLabel - 12,
    w,
    hClusterLabel * 3 + hLabel + hSubLabel + 12,
    5
  );
  context.closePath();
  context.fill();

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  // And finally we draw the labels
  context.fillStyle = '#000000';
  context.font = `${weight} ${size}px ${font}`;
  context.fillText(label ?? '', data.x + data.size + 15, data.y + size / 3);

  context.fillStyle = '#000000';
  context.font = `${weight} ${subLabelSize}px ${font}`;
  context.fillText(
    `${date}`,
    data.x + data.size + 15,
    data.y + size / 3 + 3 + subLabelSize
  );

  context.fillStyle = '#000000';
  context.font = `${weight} ${subLabelSize}px ${font}`;
  context.fillText(
    hash,
    data.x + data.size + 15,
    data.y + size / 3 + 3 + 2 * subLabelSize
  );

  if (subLabel) {
    context.fillStyle = '#000000';
    context.font = `${weight} ${subLabelSize}px ${font}`;
    context.fillText(
      subLabel,
      data.x + data.size + 15,
      data.y - (4 * size) / 3 - 2
    );
  }

  context.fillStyle = data.color;
  context.font = `${weight} ${subLabelSize}px ${font}`;
  context.fillText(
    `${name} (${email})`,
    data.x + data.size + 15,
    data.y + size / 3 + 3 + 3 * subLabelSize
  );
}

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
  template: templateExtend(TemplateName.Metro, {
    colors: [
      '#F94144',
      '#F3722C',
      '#F8961E',
      '#F9844A',
      '#F9C74F',
      '#90BE6D',
      '#43AA8B',
      '#4D908E',
      '#577590',
      '#277DA1',
      '#3C1874',
      '#891E67',
      '#F032E6',
      '#B5179E',
      '#FFB627',
      '#FF7F11',
      '#FF1A9E',
      '#BFDBFE',
      '#2B2D42',
      '#8D99AE',
    ],
  }),
};
