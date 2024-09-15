"use client";
import { FC, ReactNode } from 'react';
import { shapes, getSvg } from '../utils/svgs';
import styles from './styles/AnimatedBackground.module.scss';

const colors = ['primary-accent-color', 'secondary-accent-color'];

const AnimatedBackground: FC = () => {
  const numShapes = 15;

  const generateSvgsForAnim = (
    num: number,
  ): ReactNode[] => {
    const svgs = [];
    const styleElement = document.createElement('style');
    for (let i = 0; i < num; i++) {
      const animationName = `raise${i}`;
      const scale = Math.floor(Math.random() * 2) - 0.4;
      const left = `${Math.floor(Math.random() * 120) - 20}%`;
      const animation = `${animationName} ${
        6 + Math.floor(Math.random() * 15)
      }s linear ${Math.floor(Math.random() * 5) - 5}s infinite`;
      const transform = `scale(${0.3 * (i % 10) - 0.6}) rotate(${Math.floor(
        Math.random() * 360,
      )}deg)`;
      const filter = `blur(${(i % 10) - 6}px)`;
      const zIndex = 9 - (i % 10);
      const keyframes = `
        @keyframes ${animationName} {
          to {
            bottom: 150vh;
            transform:
            scale(${0.3 * (i % 10) - 0.6})
            rotate(${Math.random() * 360}deg);
          }
        }
      `;
      const svg = getSvg(
        shapes[i % shapes.length],
        i,
        styles.svg,
        {
          scale,
          left,
          animation,
          transform,
          filter,
          zIndex,
        },
        colors[Math.floor(Math.random() * colors.length)],
      );
      svgs.push(svg);
      styleElement.textContent += keyframes;
    }
    document.head.appendChild(styleElement);
    return svgs;
  };

  const svgs = generateSvgsForAnim(numShapes);

  return <div className="contents">{svgs.map((elem) => elem)}</div>;
};

export default AnimatedBackground;
