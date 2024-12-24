# Rainbow🌈Print

🌈rainbow console.log⌨️

增强 `console.log`

## 功能

rainbowPrint 由 **打印器** 和 **样式器** 组成

这两者都会被封装在 `rainbowPrint` 中

### 概述

**打印器**

`rainbowPrint.log`, 就是增强的 `console.log`

**样式器**

`rainbowPrint[styleName]`, 进行样式声明，`rainbowPrint` 原生提供了一些样式。同时，你也可以通过 `rainbowPrint.addStyle`、 `rainbowPrint.addStyles` 进行扩展

### console.color

可以在项目的入口文件中进行全局注册到 console.color 上，更便捷的使用, ranbow-print 也提供了良好的 ts 类型声明支持。[详见](#consolecolor-1)

## 使用

### 基本使用

```js
import rainbowPrint from 'rainbow-print'

rainbowPrint.log(rainbowPrint.green('green here >>>'), 'some thing here')
```

效果:
![alt github picture](http://cdn.licuii.xyz/img/image_1.png)

### 解构

你也可以将功能都解构出来

```js
import rainbowPrint from 'rainbow-print'

const { red, log } = rainbowPrint
log(red('red here >>>'), 'some thing here')
```

效果:
![alt github picture](http://cdn.licuii.xyz/img/image_2.png)

### 自定义样式

或者你想要自定义一些自己的样式。可以使用 `addStyles` / `addStyle` 来实现

当你从任意实例添加新的样式时，都会继承之前的样式

```js
import rainbowPrint from 'rainbow-print'

// 自定义
const myRainbowPrint = rainbowPrint.addStyle('skyblue', {
  color: '#fff',
  'background-color': 'skyblue',
  'font-size': '20px',
  'font-weight': 'bold',
  'border-radius': '10px',
  padding: '10px',
  margin: '10px',
})
log(myRainbowPrint.skyblue('mark >>>'), 'some thing here')
```

效果:
![alt github picture](http://cdn.licuii.xyz/img/image_3.png)

### 嵌套

允许[样式器](#概述)的嵌套结构. 例如:

```ts
import rainbowPrint from 'rainbow-print'

console.color = rainbowPrint.log

const rainbowPrint3 = rainbowPrint.addStyles({
  blod: {
    'font-weight': 'bold',
  },
  bgPink: {
    'background-color': 'pink',
  },
})
const { blod, bgPink, green } = rainbowPrint3
console.color(blod(green('here is blod green')))
console.color(bgPink(blod(green('here is bg-pink color-green font-bold'))))
```

效果:
![alt github picture](http://cdn.licuii.xyz/img/image_5.png)

## 类型

rainbowPrint 由 typescript 编写，拥有良好的代码提示。你添加的样式都会被提示。

**当你从任意实例添加新的样式时，都会继承之前的样式**

```ts
import rainbowPrint from 'rainbow-print'

// 自定义
const myRainbowPrint = rainbowPrint.addStyle('skyblue', {
  color: '#fff',
  'background-color': 'skyblue',
  'font-size': '20px',
  'font-weight': 'bold',
  'border-radius': '10px',
  padding: '10px',
  margin: '10px',
})
log(myRainbowPrint.skyblue('mark >>>'), 'some thing here')
// 自定义多个
const myRainbowPrint2 = myRainbowPrint.addStyles({
  orange: {
    color: 'orange',
  },
  blue: {
    color: 'blue',
  },
})
log(
  myRainbowPrint2.orange('orange >>>'),
  'some thing here',
  myRainbowPrint2.blue('<<< blue'),
  myRainbowPrint2.skyblue('from myRainbowPrint'), // 会继承上一个样式
)
```

效果:
![alt github picture](http://cdn.licuii.xyz/img/image_4.png)

# console.color

可以在项目的入口文件中进行全局注册到 console.color 上，更便捷的使用, ranbow-print 也提供了良好的 ts 类型声明支持。

```ts
import rainbowPrint from 'rainbow-print'

console.color = rainbowPrint.log
```

## 类型声明

需要新建一个类型声明文件（确保它被你的 tsconfig 所包含），在类型声明文件中引入 `rainbow-print/color` 即可，例如：

global.d.ts

```ts
/// <reference types="rainbow-print/color" />
```
