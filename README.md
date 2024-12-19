# Rainbow🌈Print

🌈rainbow console.log⌨️

增强 `console.log`

## 基本
rainbowPrint 由 **打印器** 和 **样式器** 组成

这两者都会被封装在 `rainbowPrint` 中

**打印器**

`rainbowPrint.log`, 就是增强的 `console.log`

**样式器**

`rainbowPrint[styleName]`, 进行样式声明，rainbowPrint 原生提供了一些样式。同时，你也可以通过 `rainbowPrint.addStyle`、 `rainbowPrint.addStyles` 进行扩展

## 使用

**基本使用**

```js
import rainbowPrint from 'rainbow-print'

rainbowPrint.log(rainbowPrint.green('green here >>>'), 'some thing here')
```

效果:
![alt text](docs/imgs/image_1.png)

**解构**

你也可以将功能都解构出来

```js
import rainbowPrint from 'rainbow-print'

const { red, log } = rainbowPrint
log(red('red here >>>'), 'some thing here')
```

效果:
![alt text](docs/imgs/image_2.png)

**自定义样式**

或者你想要自定义一些自己的样式。可以使用 `addStyles` / `addStyle` 来实现

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
![alt text](docs/imgs/image_3.png)

## 类型声明
rainbowPrint 由 typescript 编写，拥有良好的代码提示。你添加的样式都会被提示。

**当你从任意实例添加新的样式时，都会继承之前的样式**

```ts
import rainbowPrint from 'rainbow-print'

