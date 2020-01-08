### 高级类型
#### 交叉类型 (Intersrction Types)
交叉类型是将多个类型合并为一个类型。我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。例如，`Person & Serializable & Loggable`同时是`Person`和`Serializable`和`Loggable`。这个类型的对像同时拥有了这三种类型的成员。

我们大多是在混入（mixins） 或其它不适合典型面向对象模型的地方看到交叉类型的使用。
``` TypeScript
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in firest){
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second){
        (<any>result)[id] = (<any>second)[id];
    }
    return result;
}

class Person {
    constructor(public name: string){ }
}
interface Loggable {
    log(): void;
}

class ConsoleLogger implements Loggable{
    log() {
        //...
    }
}
var jim = extend(new Person("jim"), new ConsoleLogger)
var n = jim.name;
jim.log();
```

#### 联合类型 (Union Types)
联合类型和交叉类型很有关联，但是用上完全不同。偶尔会遇到某种情况，一个代码库希望传入 `number`或`string`类型的参数。例如下面的函数：
```ts
function padLeft(value: string ,padding: any) {
    if(typeof padding === 'number') {
        return Array(padding + 1).join(" ") + value;
    }
    if(typeof padding === 'string') {
        return padding + value;
    }
    throw new Error (`Expected string or number, got '${padding}'.`)
}

padLeft("Hello world", 4); // return "    hello world"
```
`padLeft`存在一个问题， `padding`参数的类型指定成了`any`。这就是说我们传入一个既不是 `number` 也不是`string`类型的参数，但是TypeScript却不报错。
```ts
let indentedString = padLeft("Hello world", true); //编译阶段通过，运行时报错
```
在传统面向对象的语言里，我们可能会将两种类型抽象成有层级的类型。这么做显然是非常清晰的，但同时页存在了过度设计。padLeft原始版本的好处之一是允许我们传入原始类型。这样做的话使用起来既简单又方便。如果我们就是想使用已经存在的函数的话，这种新的方式就不适用了。

代替 `any` 我们可以使用 联合类型作为`padding` 的参数：
```ts
function padLeft(value: string , padding: string | number) {
    // ...
}
let indentedString = padLeft("hello world", true); // error during compilation
```
联合类型表示一个值是联合类型，我们只能访问此联合类型的所有类型里共有的成员
```ts
interface Bird {
    fly();
    layEggs();
}
interface Fish(){
    swim();
    layEggs();
}
function getSmallPet(): Fish | Bird {
    // ...
}
let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim(); // errors
```
如果一个值类型是`A | B`,我们能够确定的是它包含了`A`和`B`, 我们能够确定的是它包含了`A`和`B`中共有的成员。这个例子里，`Brid`具有一个`fly`成员。我们不能确定一个`Brid ｜ Fish`类型的变量是否有`fly`的方法。如果变量在运行时是`Firsh`类型，那么调用 `pet.fly()`就出错了。
