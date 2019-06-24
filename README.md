# dom-sim &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nbeach/dom-sim/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/dom-sim.svg?style=flat)](https://www.npmjs.com/package/dom-sim) [![Build Status](https://travis-ci.org/nbeach/dom-sim.svg?branch=master)](https://travis-ci.org/nbeach/dom-sim) [![Coverage Status](https://coveralls.io/repos/github/nbeach/dom-sim/badge.svg?branch=master)](https://coveralls.io/github/nbeach/dom-sim?branch=master)

dom-sim allows you to simulate user interaction with your interface by firing DOM events and changing input values.

## Installation
    npm install --save-dev dom-sim
    
## Usage

#### Simulating events
You can simulate DOM events by using `trigger()`.

```typescript
import {trigger} from "dom-sim"

const button = document.querySelector("button")
trigger(button, 'click')
```

Additionally you can optionally pass an object with properties to be added to the event object.

```typescript
import {trigger} from "dom-sim"

const input = document.querySelector("input[type='text']")
trigger(input, 'keydown', { charCode: 13 })
```

#### Setting inputs element values

```typescript
import {setTextInputValue, setTextAreaValue, setCheckboxValue, setRadioButton, setSelectValue} from "dom-sim"

setTextInputValue(document.querySelector("input[type=text]"), "Sasquatch") //Text field now has value "Sasquatch"
setTextAreaValue(document.querySelector("textarea"), "Sasquatch") //Text area now has value "Sasquatch"
setCheckboxValue(document.querySelector("input[type=check]"), true) //Checkbox is now checked
setRadioButton(document.querySelector("input[type=radio]"), true) //Radio button is now selected
setSelectValue(document.querySelector("select"), "Hancock") //Dropdown list now has the value "Hancock" selected
```

Don't forget to fire the appropriate event after you change an input value or any code watching for changes will be 
unaware of the change. 

```typescript
import {setTextInputValue, trigger} from "dom-sim"

const input = document.querySelector("input[type='text']")
setTextInputValue(input, "Sasquatch")
trigger(input, 'change')
```

