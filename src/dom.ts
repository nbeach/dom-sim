import {findIndex, isNil} from "lodash"

function doIfElementPresent<T>(element: T | null, action: (item: T) => void) {
    if (isNil(element)) {
        throw new Error("Element is not present")
    } else {
        action(element)
    }
}

export function setTextInputValue(input: Element | null, value: string): void {
    doIfElementPresent(input, input => {
        (input as HTMLInputElement).value = value
    })
}

export function setSelectValue(selectBox: Element | null, value: string): void {
    doIfElementPresent(selectBox, selectBox => {
        (selectBox as any).selectedIndex = findIndex(selectBox.children, option =>
            option.getAttribute("value") === value || option.textContent === value)
    })
}

export const setTextAreaValue = setTextInputValue

export function setCheckboxValue(input: Element | null, checked: boolean): void {
    doIfElementPresent(input, input => {
        (input as HTMLInputElement).checked = checked
    })
}

export function setRadioButton(radioButton: Element | null, selected: boolean): void {
    doIfElementPresent(radioButton, radioButton => {
        (radioButton as HTMLInputElement).checked = selected
    })
}

export interface EventProperties {
    [key: string]: any
}

export function trigger(element: Node | null, eventType: string, eventProperties: EventProperties = {}): void {
    doIfElementPresent(element, element => {
        try {
            const event: any = new Event(eventType, { bubbles: true, cancelable: true  })
            element.dispatchEvent(Object.assign(event, eventProperties))
        } catch (exception) {
            // IE11 Fix
            if (exception.description === "Object doesn't support this action") {
                const event = document.createEvent("MouseEvent")
                event.initMouseEvent(
                    eventType,
                    true,
                    true,
                    window,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null)

                element.dispatchEvent(Object.assign(event, eventProperties))

            } else {
                throw exception
            }
        }
    })
}
