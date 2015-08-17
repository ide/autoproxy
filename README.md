# autoproxy
A higher-order decorator to automatically proxy properties from the original function to the decorated one so that higher-order components don't get in the way.

[![npm package](https://nodei.co/npm/autoproxy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/autoproxy/)

## How does autoproxy help?

Autoproxy exposes a class' static and instance properties through a wrapper class.

For example, a React component with Redux looks like this:
```js
@connect(data => { size: data.layout.size })
class Box extends React.Component {
  static NUMBER_OF_SIDES = 4;
  bounce() {
    ...
  }
  render() {
    ...
  }
}
```

This component defines a static property called `NUMBER_OF_SIDES` and method called `bounce`.

### Without autoproxy

Without autoproxy, to access these properties we have to write code like this:
```js
class Root extends React.Component {
  render() {
    return <Box ref={component => { this._box = component; }} />;
  }
  componentDidMount() {
    console.log('There are %d sides', Box.WrappedComponent.NUMBER_OF_SIDES);
    this._box.getWrappedInstance().bounce();
  }
}
```

See how we need `WrappedComponent` and `getWrappedInstance()`? This is because the `connect` decorator wraps the underlying class and `Box` refers to the wrapper class. As a result `Box.NUMBER_OF_SIDES` and `this._box.bounce` are both undefined.

### With autoproxy

With `autoproxy`, the wrapper class automatically proxies the underlying class' properties. Use `@autoproxy` to decorate a decorator:

```js
@autoproxy(connect(data => { size: data.layout.size }))
class Box extends React.Component {
  ...
}
```

Then you can write `Box.NUMBER_OF_SIDES` and `this._box.bounce`.
