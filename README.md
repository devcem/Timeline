# Timeline.js for PlayCanvas

## Overview

Timeline.js is a PlayCanvas script that allows you to create smooth animations using various easing methods. This script provides a collection of attributes that can be customized to get your desired animation effect.

## Links
- Demo: https://playcanvas.com/project/1155534/overview/timeline-demo
- Tween Library: https://github.com/playcanvas/playcanvas-tween/blob/main/tween.js
- Youtube video: https://www.youtube.com/watch?v=uMGgIA_3b5I&ab_channel=CemDemir

## Attributes

### `autoplay`
- **Type**: Boolean
- **Description**: Determines whether the animation should play automatically when the game starts.

### `loop`
- **Type**: Boolean
- **Default**: `false`
- **Description**: If set to `true`, the animation will loop continuously.

### `yoyo`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Enables the yoyo effect, causing the animation to reverse back to its initial state after reaching the end.

### `position`, `scale`, `rotation`, `opacity`, `custom`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Specifies which properties of the object will be animated.

### `playSound`
- **Type**: Boolean
- **Default**: `false`
- **Description**: Whether to play a sound during the animation.

### `duration`
- **Type**: Number
- **Default**: `1`
- **Description**: The duration of the animation in seconds.

### `delay`
- **Type**: Number
- **Default**: `0`
- **Description**: Delay before the animation starts, in seconds.

### `repeat`
- **Type**: Number
- **Default**: `0`
- **Description**: Number of times the animation will be repeated.

### `soundDelay`
- **Type**: Number
- **Default**: `0`
- **Description**: Delay before the sound starts, in seconds.

### `rollback`
- **Type**: Number
- **Default**: `0`
- **Description**: Amount of time it takes for the animation to rollback to its initial state, in seconds.

### `ease`
- **Type**: String
- **Default**: `Linear`
- **Options**: Linear, QuadraticIn, QuadraticOut, etc.
- **Description**: The easing method used for the animation. Refer to [Easing Methods](#easing-methods) for more details.

### `startFrame` and `endFrame`
- **Type**: JSON
- **Schema**: Includes attributes like `position`, `rotation`, `scale`, `opacity`, `custom`
- **Description**: Specifies the starting and ending frames for the animation.

## Easing Methods

You can specify different easing methods for the animation. Here are some of the options:

- Linear
- QuadraticIn
- QuadraticOut
- QuadraticInOut
- … (Refer to the script for the complete list)
